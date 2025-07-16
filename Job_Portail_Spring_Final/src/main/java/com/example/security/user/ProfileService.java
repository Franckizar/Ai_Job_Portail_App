// package com.example.security.user;

// import lombok.RequiredArgsConstructor;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// // import com.example.security.user.Doctor.DoctorProfile;
// // import com.example.security.user.Doctor.DoctorProfileRepository;
// // import com.example.security.user.JobSeeker.PatientProfile;
// // import com.example.security.user.JobSeeker.PatientProfileRepository;
// import com.example.security.user.adminthings.AdminProfile;
// import com.example.security.user.adminthings.AdminProfileRepository;

// @Service
// @RequiredArgsConstructor
// @Transactional
// public class ProfileService {

//     // private final DoctorProfileRepository doctorProfileRepository;
//     private final AdminProfileRepository adminProfileRepository;
//     // private final PatientProfileRepository patientProfileRepository;

//     // Create profiles based on user role
//     public void createProfileForUser(User user) {
//         if (user.hasRole(Role.DOCTOR)) {
//             createDoctorProfile(user);
//         }
//         if (user.hasRole(Role.ADMIN)) {
//             createAdminProfile(user);
//         }
//         // if (user.hasRole(Role.USER)) {
//         //     createPatientProfile(user);
//         // }
//     }

//     // private void createDoctorProfile(User user) {
//     //     DoctorProfile doctorProfile = DoctorProfile.builder()
//     //             .user(user)
//     //             .specialization("General Medicine")
//     //             .licenseNumber("DOC-" + user.getId())
//     //             .hospitalAffiliation("Default Hospital")
//     //             .yearsOfExperience(0)
//     //             .contactNumber("000-000-0000")
//     //             .build();
//     //     doctorProfileRepository.save(doctorProfile);
//     // }

//    private void createAdminProfile(User user) {
//     AdminProfile adminProfile = AdminProfile.builder()
//             .user(user)
//             .favoriteColor("Blue") // Example random value
//             .luckyNumber(42)       // Example random value
//             .isSuperAdmin(false)   // Example random value
//             .notes("Test admin profile for user " + user.getId())
//             .build();
//     adminProfileRepository.save(adminProfile);
// }


//     // private void createPatientProfile(User user) {
//     //     PatientProfile patientProfile = PatientProfile.builder()
//     //             .user(user)
//     //             .dateOfBirth(null)
//     //             .gender(null)
//     //             .phoneNumber(null)
//     //             .address(null)
//     //             .emergencyContact(null)
//     //             .bloodType(null)
//     //             .allergies(null)
//     //             .build();
//     //     patientProfileRepository.save(patientProfile);
//     // }

//     // Get profile by user
//     public DoctorProfile getDoctorProfile(User user) {
//         return doctorProfileRepository.findByUserId(user.getId()).orElse(null);
//     }

//     public AdminProfile getAdminProfile(User user) {
//         return adminProfileRepository.findByUserId(user.getId()).orElse(null);
//     }

//     // public PatientProfile getPatientProfile(User user) {
//     //     return patientProfileRepository.findById(user.getId()).orElse(null);
//     // }
// }
