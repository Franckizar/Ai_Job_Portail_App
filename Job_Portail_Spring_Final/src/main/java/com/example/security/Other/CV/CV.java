package com.example.security.Other.CV;

import org.hibernate.annotations.processing.SQL;

import com.example.security.user.JobSeeker.JobSeeker;
import com.example.security.user.Technicien.Technician;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
 @Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CV {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    @Lob
    private byte[] content;

    private String fileType;

    @OneToOne(mappedBy = "cv")
    @JsonIgnore
    private JobSeeker jobSeeker;

    @OneToOne(mappedBy = "cv")
    @JsonIgnore
    private Technician technician;

    @Lob
    private String cvText;

    // do this in the databse
    // ALTER TABLE cv MODIFY COLUMN cv_text TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
//     SQL Error: 1366, SQLState: HY000
// Incorrect string value: '\xE2\x86\x92 cl...' for column 'cv_text' at row 1




    // Getters and setters
}
