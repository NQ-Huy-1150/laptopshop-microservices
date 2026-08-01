package com.laptopshop.fileservice.repository;

import com.laptopshop.fileservice.dto.response.FileInfo;
import com.laptopshop.fileservice.dto.response.Product;
import com.laptopshop.fileservice.entity.FileMgmt;
import com.laptopshop.fileservice.enums.ProductField;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Repository;
import org.springframework.util.DigestUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@Slf4j
@Repository
public class FileRepository {
    @NonFinal
    @Value("${app.save-location}")
    String savedPath;

    @NonFinal
    @Value("${app.download-url}")
    String downloadUrl;

    public FileInfo store(MultipartFile file) throws IOException {
        Path folder = Paths.get(savedPath);
        var fileExtension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String fileName = "";
        if (file.getOriginalFilename().contains("main")) {
            fileName = Objects.isNull(fileExtension)
                    ? "main-" + UUID.randomUUID()
                    : "main-" + UUID.randomUUID() + "." + fileExtension;
        } else {
            fileName = Objects.isNull(fileExtension)
                    ? UUID.randomUUID().toString()
                    : UUID.randomUUID() + "." + fileExtension;
        }

        Path filePath = folder.resolve(fileName).normalize().toAbsolutePath();
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        log.info("ContentType: {}", file.getContentType());
        // return fileMgmt
        return FileInfo.builder()
                .name(fileName)
                .contentType(file.getContentType())
                .size(file.getSize())
                .path(filePath.toString())
                .md5Checksum(DigestUtils.md5DigestAsHex(file.getInputStream()))
                .url(downloadUrl + fileName)
                .build();
    }

    public Resource read(FileMgmt fileMgmt) throws IOException {
        var data = Files.readAllBytes(Path.of(fileMgmt.getPath()));
        return new ByteArrayResource(data);
    }

    public List<Product> parseExcel(FileMgmt fileMgmt) throws IOException {
        try (InputStream is = Files.newInputStream(Path.of(fileMgmt.getPath()))) {
            log.info("Parsing excel file");
            HSSFWorkbook workbook = new HSSFWorkbook(is);
            HSSFSheet sheet = workbook.getSheetAt(0);
            var list = parseData(sheet);
            return list;
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    private List<Product> parseData(HSSFSheet sheet) {
        List<Product> products = new ArrayList<>();
        List<String> attributes = new ArrayList<>();
        for (Row row : sheet) {
            Iterator<Cell> cells = row.cellIterator();
            Product product = new Product();
            while (cells.hasNext()) {
                Cell cell = cells.next();
                if (row.getRowNum() == 0) {
                    attributes.add(cell.getStringCellValue().toUpperCase());
                } else {
                    var data = cell.getStringCellValue();
                    var cellIndex = cell.getColumnIndex();

                    if (cellIndex == attributes.indexOf(ProductField.NAME.name())) {
                        product.setName(data);
                    } else if (cellIndex == attributes.indexOf(ProductField.DESCRIPTION.name())) {
                        product.setDescription(data);
                    } else if (cellIndex == attributes.indexOf(ProductField.PRICE.name())) {
                        product.setPrice(data);
                    } else if (cellIndex == attributes.indexOf(ProductField.SPEC.name())) {
                        product.setSpec(data);
                    } else if (cellIndex == attributes.indexOf(ProductField.BRAND.name())) {
                        product.setBrand(data);
                    }
                }
            }
            products.add(product);
        }
        return products.stream().filter(product -> !(product.getName() == null)).toList();
    }

}
