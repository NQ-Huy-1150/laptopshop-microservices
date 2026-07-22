package com.laptopshop.fileservice.entity;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "file_mgmt")
public class FileMgmt {
    @MongoId
    String id;
    String contentType;
    String ownerId;
    long size;
    String md5Checksum;
    String path;
}
