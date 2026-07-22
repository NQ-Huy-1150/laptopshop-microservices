package com.laptopshop.fileservice.Mapper;

import com.laptopshop.fileservice.dto.response.FileInfo;
import com.laptopshop.fileservice.entity.FileMgmt;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FIleMapper {
    @Mapping(target = "id", source = "name")
    FileMgmt toFileMgmt(FileInfo fileInfo);
}
