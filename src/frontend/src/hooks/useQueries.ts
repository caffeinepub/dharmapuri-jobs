import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Application,
  EmployerProfile,
  Job,
  JobWithDistance,
  Profile,
  StudentProfile,
} from "../backend.d";
import { ApplicationStatus } from "../backend.d";
import { useActor } from "./useActor";

export { ApplicationStatus };
export type {
  StudentProfile,
  EmployerProfile,
  Application,
  Job,
  JobWithDistance,
  Profile,
};

// ── Profile ──────────────────────────────────────────────────────────────────

export function useGetMyProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<Profile | null>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateStudentProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: StudentProfile) => {
      if (!actor) throw new Error("Not connected");
      await actor.createStudentProfile(profile);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

export function useCreateEmployerProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: EmployerProfile) => {
      if (!actor) throw new Error("Not connected");
      await actor.createEmployerProfile(profile);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

export function useUpdateStudentProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: StudentProfile) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateStudentProfile(profile);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

export function useUpdateEmployerProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: EmployerProfile) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateEmployerProfile(profile);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

// ── Jobs ─────────────────────────────────────────────────────────────────────

export function useGetJobsNearLocation(
  lat: number,
  lng: number,
  radiusKm: number,
) {
  const { actor, isFetching } = useActor();
  return useQuery<JobWithDistance[]>({
    queryKey: ["jobsNear", lat, lng, radiusKm],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getJobsNearLocation(lat, lng, radiusKm);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListJobsByEmployer(employerId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Job[]>({
    queryKey: ["jobsByEmployer", employerId],
    queryFn: async () => {
      if (!actor || !employerId) return [];
      const { Principal } = await import("@icp-sdk/core/principal");
      const principal = Principal.fromText(employerId);
      return actor.listJobsByEmployer(principal);
    },
    enabled: !!actor && !isFetching && !!employerId,
  });
}

export function usePostJob() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (job: Job) => {
      if (!actor) throw new Error("Not connected");
      return actor.postJob(job);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["jobsByEmployer"] });
      void qc.invalidateQueries({ queryKey: ["jobsNear"] });
    },
  });
}

export function useDeleteJob() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteJob(jobId);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["jobsByEmployer"] });
      void qc.invalidateQueries({ queryKey: ["jobsNear"] });
    },
  });
}

// ── Applications ─────────────────────────────────────────────────────────────

export function useGetMyApplications() {
  const { actor, isFetching } = useActor();
  return useQuery<Application[]>({
    queryKey: ["myApplications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyApplications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetApplicationsForJob(jobId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Application[]>({
    queryKey: ["jobApplications", jobId?.toString()],
    queryFn: async () => {
      if (!actor || jobId === null) return [];
      return actor.getApplicationsForJob(jobId);
    },
    enabled: !!actor && !isFetching && jobId !== null,
  });
}

export function useApplyToJob() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      jobId,
      message,
    }: { jobId: bigint; message: string }) => {
      if (!actor) throw new Error("Not connected");
      await actor.applyToJob(jobId, message);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["myApplications"] });
    },
  });
}

export function useUpdateApplicationStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      appId,
      status,
    }: { appId: bigint; status: ApplicationStatus }) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateApplicationStatus(appId, status);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["jobApplications"] });
      void qc.invalidateQueries({ queryKey: ["myApplications"] });
    },
  });
}

// ── Seed ─────────────────────────────────────────────────────────────────────

export function useInitSeedData() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await actor.initSeedData();
    },
  });
}
