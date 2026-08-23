package com.laptopshop.profileservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String keyCloakId;
    String firstName;
    String lastName;
    @Column(unique = true)
    String username;
    @Column(unique = true)
    String email;
    LocalDate dob;
    String address;
    String phoneNumber;
}
