package com.laptopshop.fileservice.repository;

import com.laptopshop.fileservice.entity.FileMgmt;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileMgmtRepository extends MongoRepository<FileMgmt, String> {
}
