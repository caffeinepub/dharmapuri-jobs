# Dharmapuri Jobs - Hyperlocal Student Part-Time Job App

## Current State
Fresh project. No backend or frontend logic exists. This is a new build from scratch.

## Requested Changes (Diff)

### Add
- Two-role authentication: Students and Employers (local business owners)
- Student profile: name, college, skills, availability, location (lat/lng), bio
- Employer profile: business name, type (tea shop, bakery, clinic, etc.), location, contact
- Job listings: title, description, pay (daily/hourly/monthly), job type, employer location, distance from student
- Application system: students apply to jobs, employers review and accept/reject applicants
- Hyperlocal filtering: show jobs within ~5-6 km of student's location using geo distance calculation
- Job categories: Tea Shop, Bakery, Tuition Center, Supermarket, Courier, Clinic, Others
- Dashboard views: student job feed, employer job management
- Application tracking: students see their applied jobs and status; employers see all applicants per job
- Sample seed data: realistic Dharmapuri-area employers and job listings

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan

### Backend (Motoko)
1. User profiles: createStudentProfile, createEmployerProfile, getMyProfile, updateProfile
2. Jobs: postJob, getJobById, listJobsByEmployer, listAllJobs, deleteJob
3. Applications: applyToJob, getApplicationsByJob, getApplicationsByStudent, updateApplicationStatus (accept/reject)
4. Geo filtering: store lat/lng on jobs and students; compute haversine distance on query; return jobs within 6km radius
5. Seed data: 5-8 Dharmapuri-area employer profiles + 10-15 job listings with realistic coordinates

### Frontend (React + Tailwind)
1. Landing/onboarding: role selection screen (Student or Employer)
2. Auth: login/register with role
3. Student flow:
   - Profile setup (name, college, skills, availability)
   - Job feed with distance filter (default 6km), search, category filter
   - Job detail page with Apply button
   - My Applications tab (pending/accepted/rejected)
4. Employer flow:
   - Business profile setup
   - Post Job form (title, description, pay, category, location)
   - My Jobs list
   - Applicants view per job with Accept/Reject controls
5. Shared: navigation, profile view, loading/error states
