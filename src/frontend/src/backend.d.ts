import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface EmployerProfile {
    locationLat: number;
    locationLng: number;
    createdAt: bigint;
    businessName: string;
    businessType: string;
    address: string;
    contactNumber: string;
}
export interface StudentProfile {
    bio: string;
    locationLat: number;
    locationLng: number;
    name: string;
    createdAt: bigint;
    availability: string;
    skills: Array<string>;
    college: string;
}
export interface Job {
    id: bigint;
    locationLat: number;
    locationLng: number;
    title: string;
    postedAt: bigint;
    tags: Array<string>;
    description: string;
    isActive: boolean;
    employerId: Principal;
    address: string;
    payAmount: bigint;
    category: JobCategory;
    payType: PayType;
}
export interface Application {
    id: bigint;
    status: ApplicationStatus;
    appliedAt: bigint;
    studentId: Principal;
    jobId: bigint;
    message: string;
}
export type JobCategory = string;
export type Profile = {
    __kind__: "employer";
    employer: EmployerProfile;
} | {
    __kind__: "student";
    student: StudentProfile;
};
export type PayType = string;
export interface UserProfile {
    name: string;
    profileType: string;
}
export interface JobWithDistance {
    job: Job;
    distanceKm: number;
}
export enum ApplicationStatus {
    pending = "pending",
    rejected = "rejected",
    accepted = "accepted"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    applyToJob(jobId: bigint, message: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createEmployerProfile(profile: EmployerProfile): Promise<void>;
    createStudentProfile(profile: StudentProfile): Promise<void>;
    deleteJob(jobId: bigint): Promise<void>;
    getApplicationsForJob(jobId: bigint): Promise<Array<Application>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getJobById(id: bigint): Promise<Job | null>;
    getJobsNearLocation(lat: number, lng: number, radiusKm: number): Promise<Array<JobWithDistance>>;
    getMyApplications(): Promise<Array<Application>>;
    getMyProfile(): Promise<Profile | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initSeedData(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    listAllActiveJobs(): Promise<Array<Job>>;
    listJobsByEmployer(employerId: Principal): Promise<Array<Job>>;
    postJob(job: Job): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateApplicationStatus(appId: bigint, status: ApplicationStatus): Promise<void>;
    updateEmployerProfile(profile: EmployerProfile): Promise<void>;
    updateStudentProfile(profile: StudentProfile): Promise<void>;
}
