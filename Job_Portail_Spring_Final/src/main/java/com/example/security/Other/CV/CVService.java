package com.example.security.Other.CV;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.security.user.JobSeeker.JobSeeker;
import com.example.security.user.JobSeeker.JobSeekerRepository;
import com.example.security.user.Technicien.Technician;
import com.example.security.user.Technicien.TechnicianRepository;

import org.apache.tika.Tika;
import java.io.ByteArrayInputStream;
import org.apache.tika.exception.TikaException;

import java.io.IOException;

@Service
public class CVService {

    private final CVRepository cvRepository;
    private final JobSeekerRepository jobSeekerRepository;
    private final TechnicianRepository technicianRepository;

    public CVService(
        CVRepository cvRepository,
        JobSeekerRepository jobSeekerRepository,
        TechnicianRepository technicianRepository
    ) {
        this.cvRepository = cvRepository;
        this.jobSeekerRepository = jobSeekerRepository;
        this.technicianRepository = technicianRepository;
    }

///////////////////////
 public CV uploadCV(MultipartFile file, Integer userId, String userType) throws IOException {
        if (!file.getContentType().equals("application/pdf")) {
            throw new IOException("Only PDF files are allowed");
        }

        byte[] bytes = file.getBytes();
        Tika tika = new Tika();
        String extractedText;
        try {
            extractedText = tika.parseToString(new ByteArrayInputStream(bytes));
        } catch (TikaException e) {
            extractedText = "";
            e.printStackTrace();
        }

        CV cv;
        boolean isUpdate = false;

        // Check for existing CV based on userType and userId
        if (userType.equalsIgnoreCase("jobseeker")) {
            JobSeeker jobSeeker = jobSeekerRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("JobSeeker not found"));
            cv = jobSeeker.getCv();
            if (cv != null) {
                // Update existing CV
                isUpdate = true;
                cv.setFileName(file.getOriginalFilename());
                cv.setFileType(file.getContentType());
                cv.setContent(bytes);
                cv.setCvText(extractedText);
            } else {
                // Create new CV
                cv = new CV();
                cv.setFileName(file.getOriginalFilename());
                cv.setFileType(file.getContentType());
                cv.setContent(bytes);
                cv.setCvText(extractedText);
                cv.setJobSeeker(jobSeeker);
                jobSeeker.setCv(cv);
            }
        } else if (userType.equalsIgnoreCase("technician")) {
            Technician technician = technicianRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Technician not found"));
            cv = technician.getCv();
            if (cv != null) {
                // Update existing CV
                isUpdate = true;
                cv.setFileName(file.getOriginalFilename());
                cv.setFileType(file.getContentType());
                cv.setContent(bytes);
                cv.setCvText(extractedText);
            } else {
                // Create new CV
                cv = new CV();
                cv.setFileName(file.getOriginalFilename());
                cv.setFileType(file.getContentType());
                cv.setContent(bytes);
                cv.setCvText(extractedText);
                cv.setTechnician(technician);
                technician.setCv(cv);
            }
        } else {
            throw new IllegalArgumentException("Invalid user type");
        }

        // Save the CV (create or update)
        cv = cvRepository.save(cv);

        // Optionally, update the user entity to ensure the relationship is persisted
        if (userType.equalsIgnoreCase("jobseeker")) {
            jobSeekerRepository.save(cv.getJobSeeker());
        } else if (userType.equalsIgnoreCase("technician")) {
            technicianRepository.save(cv.getTechnician());
        }

        return cv;
    }


//////////////////////////////////////////////////////////////
    public CV getCVByUserId(Integer userId, String userType) {
    if (userType.equalsIgnoreCase("jobseeker")) {
        return cvRepository.findByJobSeekerId(userId)
                .orElseThrow(() -> new IllegalArgumentException("CV not found for JobSeeker ID: " + userId));
    } else if (userType.equalsIgnoreCase("technician")) {
        return cvRepository.findByTechnicianId(userId)
                .orElseThrow(() -> new IllegalArgumentException("CV not found for Technician ID: " + userId));
    } else {
        throw new IllegalArgumentException("Invalid user type. Must be 'jobseeker' or 'technician'");
    }
}

}
