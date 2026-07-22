package com.laptopshop.identityservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

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
    String firstName;
    String lastName;
    @Column(unique = true)
    String username;
    String password;
    @Column(unique = true)
    String email;
    LocalDate dob;
    String address;
    String phoneNumber;
    @ManyToMany
    Set<Role> roles;
}
