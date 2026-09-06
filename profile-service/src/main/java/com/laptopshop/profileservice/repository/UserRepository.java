package com.laptopshop.profileservice.repository;

import com.laptopshop.profileservice.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByUsername(String username);

    Page<User> findAll(Pageable pageable);

    User findByKeyCloakId(String keyCloakId);
}
