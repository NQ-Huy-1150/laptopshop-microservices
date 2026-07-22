package com.laptopshop.fileservice.dto.response;

import org.springframework.core.io.Resource;

public record FileMetadata(String contentType, Resource resource) {
}
