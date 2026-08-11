package com.laptopshop.transactionservice.repository;

import com.laptopshop.transactionservice.entity.TransactionMgmt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionMgmtRepository extends JpaRepository<TransactionMgmt, String> {
}
