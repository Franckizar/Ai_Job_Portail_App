package com.example.security.user.Enterprise;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EnterpriseRepository extends JpaRepository<Enterprise, Integer> {

    Optional<Enterprise> findByUserId(Integer userId);

    boolean existsByUserId(Integer userId);

    Optional<Enterprise> findByName(String name);

}
