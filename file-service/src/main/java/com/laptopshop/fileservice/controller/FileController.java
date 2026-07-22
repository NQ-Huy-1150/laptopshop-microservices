package com.laptopshop.fileservice.controller;

import com.laptopshop.fileservice.dto.response.ApiResponse;
import com.laptopshop.fileservice.dto.response.FileResponse;
import com.laptopshop.fileservice.service.FileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

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

    @GetMapping("/download/{name}")
    public ResponseEntity<Resource> download(@PathVariable String name) throws IOException {
        var metadata = this.fileService.download(name);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, metadata.contentType())
                .body(metadata.resource());
    }
}
