package com.laptopshop.fileservice.service;

import com.laptopshop.fileservice.Mapper.FIleMapper;
import com.laptopshop.fileservice.dto.response.FileMetadata;
import com.laptopshop.fileservice.dto.response.FileResponse;
import com.laptopshop.fileservice.entity.FileMgmt;
import com.laptopshop.fileservice.exception.AppException;
import com.laptopshop.fileservice.exception.ErrorCode;
import com.laptopshop.fileservice.repository.FileMgmtRepository;
import com.laptopshop.fileservice.repository.FileRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FileService {
    FileRepository fileRepository;
    FileMgmtRepository fileMgmtRepository;
    FIleMapper fIleMapper;

    public FileResponse uploadFile(MultipartFile file) throws IOException {
        var fileInfo = this.fileRepository.store(file);
        //getOwnerId
        var userId = SecurityContextHolder.getContext().getAuthentication().getName();
        //create FIleMgmt
        FileMgmt fileMgmt = this.fIleMapper.toFileMgmt(fileInfo);
        fileMgmt.setOwnerId(userId);
        this.fileMgmtRepository.save(fileMgmt);
        return FileResponse.builder()
                .name(file.getOriginalFilename())
                .url(fileInfo.getUrl())
                .build();
    }

    public List<FileResponse> uploadMultipleFile(MultipartFile[] files) throws IOException {
        log.info("Upload multiple files to file service");
        List<FileResponse> fileResponses = new ArrayList<>();
        var userId = SecurityContextHolder.getContext().getAuthentication().getName();
        for (MultipartFile file : files) {
            var fileInfo = this.fileRepository.store(file);
            FileMgmt fileMgmt = this.fIleMapper.toFileMgmt(fileInfo);
            fileMgmt.setOwnerId(userId);
            this.fileMgmtRepository.save(fileMgmt);
            var response = FileResponse.builder()
                    .name(file.getOriginalFilename())
                    .url(fileInfo.getUrl())
                    .build();
            fileResponses.add(response);
        }
        log.info("FileResponse : {}", fileResponses);
        return fileResponses;

    }

    public FileMetadata download(String name) throws IOException {
        FileMgmt fileMgmt = this.fileMgmtRepository.findById(name).orElseThrow(
                () -> new AppException(ErrorCode.FILE_NOT_FOUND));
        var data = this.fileRepository.read(fileMgmt);
        return new FileMetadata(fileMgmt.getContentType(), data);
    }
}
