import LoadingScreen from "@/components/LoadingScreen";
import { Toaster } from "@/components/ui/sonner";
import { useActor } from "@/hooks/useActor";
import { useAuth } from "@/hooks/useAuth";
import { useGetMyProfile } from "@/hooks/useQueries";
import EmployerDashboard from "@/pages/EmployerDashboard";
import EmployerSetupPage from "@/pages/EmployerSetupPage";
import LandingPage from "@/pages/LandingPage";
import StudentDashboard from "@/pages/StudentDashboard";
import StudentSetupPage from "@/pages/StudentSetupPage";
import { useEffect, useState } from "react";

export type AppRole = "student" | "employer" | null;

function App() {
  const { isAuthenticated, isInitializing } = useAuth();
  const { isFetching: actorFetching } = useActor();
  const { data: profile, isLoading: profileLoading } = useGetMyProfile();
  const [pendingRole, setPendingRole] = useState<AppRole>(() => {
    const stored = localStorage.getItem("dj_pending_role");
    return (stored as AppRole) ?? null;
  });

  const setPendingRoleAndStore = (role: AppRole) => {
    if (role) localStorage.setItem("dj_pending_role", role);
    else localStorage.removeItem("dj_pending_role");
    setPendingRole(role);
  };

  // Clear pending role once profile is set
  useEffect(() => {
    if (profile) {
      localStorage.removeItem("dj_pending_role");
      setPendingRole(null);
    }
  }, [profile]);

  if (isInitializing || actorFetching) {
    return <LoadingScreen />;
  }

  // Not authenticated: show landing
  if (!isAuthenticated) {
    return (
      <>
        <LandingPage onRoleSelect={setPendingRoleAndStore} />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  // Authenticated but fetching profile
  if (profileLoading) {
    return <LoadingScreen />;
  }

  // No profile: show setup based on chosen role
  if (!profile) {
    if (pendingRole === "student") {
      return (
        <>
          <StudentSetupPage />
          <Toaster position="top-center" richColors />
        </>
      );
    }
    if (pendingRole === "employer") {
      return (
        <>
          <EmployerSetupPage />
          <Toaster position="top-center" richColors />
        </>
      );
    }
    // No pending role – redirect to landing to pick role
    return (
      <>
        <LandingPage onRoleSelect={setPendingRoleAndStore} />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  // Profile exists – route by type
  if (profile.__kind__ === "student") {
    return (
      <>
        <StudentDashboard />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  if (profile.__kind__ === "employer") {
    return (
      <>
        <EmployerDashboard />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  return <LoadingScreen />;
}

export default App;
