# Job Portal Application Summary

## Overview
This is a comprehensive job portal application built with a Spring Boot backend and Next.js frontend. The platform allows different user types (job seekers, technicians, enterprises, personal employers, and administrators) to interact with job listings, applications, and AI-powered job matching features.

## Backend Architecture (Spring Boot)

### Core Components

1. **Authentication & Authorization**
   - JWT-based authentication system
   - Role-based access control (ADMIN, JOB_SEEKER, TECHNICIAN, ENTERPRISE, PERSONAL_EMPLOYER, UNKNOWN)
   - Password reset functionality with email verification
   - User registration with profile creation based on user role

2. **Job Management**
   - Job entity with fields for title, description, salary range, location, and job type
   - Support for different job types (FULL_TIME, PART_TIME, INTERNSHIP, REMOTE, CONTRACT, FREELANCE)
   - Job categories and skills association
   - CRUD operations for job listings
   - Job filtering by status, skills, location, and type

3. **Application System**
   - Application entity linking job seekers/technicians to jobs
   - Application status tracking (SUBMITTED, REVIEWED, SHORTLISTED, REJECTED, ACCEPTED)
   - Resume and portfolio URL storage
   - Cover letter support

4. **AI Job Matching**
   - Integration with Ollama AI model for job-CV matching
   - Match scoring system between user CVs and job requirements
   - Match history tracking with keywords and scores
   - Automated matching for all available jobs

5. **User Profiles**
   - Multiple user types with specialized profiles:
     - Job Seekers with CV management
     - Technicians with professional details
     - Enterprises for company job postings
     - Personal Employers for individual job postings
     - Admins for system management
   - CV upload and text extraction functionality

6. **Additional Features**
   - Payment integration (Campay)
   - Messaging system
   - Notification system
   - Subscription management
   - API request logging

## Frontend Architecture (Next.js)

### Key Pages & Components

1. **Public Pages**
   - Home page with job search functionality
   - Job listing page with filtering options
   - Individual job detail pages with comprehensive information
   - Authentication pages (login, registration, password reset)

2. **User Dashboards**
   - Role-specific dashboards for different user types
   - Job seeker dashboard for application tracking
   - Employer dashboards for job posting and application management
   - Admin dashboard for system oversight

3. **Job Application Flow**
   - Job browsing with search and filters
   - Detailed job view with requirements and benefits
   - Application form with resume upload
   - Application status tracking

4. **Authentication System**
   - JWT token management in localStorage and cookies
   - Role-based routing and access control
   - Profile management and updates
   - Password reset functionality

## Key Features

1. **AI-Powered Job Matching**
   - Automated CV analysis against job requirements
   - Match scoring system for personalized job recommendations
   - Integration with Ollama AI models

2. **Comprehensive Job Management**
   - Full CRUD operations for job listings
   - Advanced filtering and search capabilities
   - Job categorization and skill tagging

3. **Multi-User System**
   - Five distinct user roles with specialized functionality
   - Role-based access control throughout the application
   - Profile management tailored to each user type

4. **Application Tracking**
   - Complete application lifecycle management
   - Status updates and notifications
   - Resume and portfolio management

5. **Admin Capabilities**
   - User management and role assignment
   - System monitoring and analytics
   - Content moderation tools

## Technical Stack

- **Backend**: Spring Boot, Java, JWT, MySQL
- **Frontend**: Next.js, React, TypeScript
- **AI Integration**: Ollama for job matching
- **Authentication**: JWT with role-based access control
- **File Handling**: PDF resume upload with text extraction
- **Deployment**: Docker support included

## API Endpoints

The application provides RESTful APIs for:
- Authentication and user management
- Job listing and management
- Application submission and tracking
- AI job matching services
- CV upload and management
- Payment processing

This job portal provides a complete solution for job seekers to find opportunities, employers to post positions, and administrators to manage the platform, all enhanced with AI-powered matching capabilities.