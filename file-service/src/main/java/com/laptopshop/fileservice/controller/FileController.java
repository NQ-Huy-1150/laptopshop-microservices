package com.laptopshop.fileservice.controller;

import com.laptopshop.fileservice.dto.response.ApiResponse;
import com.laptopshop.fileservice.dto.response.FileResponse;
import com.laptopshop.fileservice.service.FileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/media")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FileController {
    FileService fileService;

    @PostMapping("/upload")
    public ApiResponse<FileResponse> upload(@RequestParam("file") MultipartFile file) throws IOException {
        return ApiResponse.<FileResponse>builder()
                .result(fileService.uploadFile(file))
                .build();
    }

    @PostMapping("/uploads")
    public ApiResponse<List<FileResponse>> uploads(@RequestParam("files") MultipartFile[] files) throws IOException {
        log.info("received files: {}", files.length);
        return ApiResponse.<List<FileResponse>>builder()
                .result(fileService.uploadMultipleFile(files))
                .build();
    }

    @GetMapping("/download/{name}")
    public ResponseEntity<Resource> download(@PathVariable String name) throws IOException {
        var metadata = this.fileService.download(name);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, metadata.contentType())
                .body(metadata.resource());
    }
}
