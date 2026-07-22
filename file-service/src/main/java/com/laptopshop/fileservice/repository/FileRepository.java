package com.laptopshop.fileservice.repository;

import com.laptopshop.fileservice.dto.response.FileInfo;
import com.laptopshop.fileservice.entity.FileMgmt;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Repository;
import org.springframework.util.DigestUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

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
        var fileName = Objects.isNull(fileExtension)
                ? UUID.randomUUID().toString()
                : UUID.randomUUID() + "." + fileExtension;
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
}
