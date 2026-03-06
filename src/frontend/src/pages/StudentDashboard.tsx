import CategoryChip from "@/components/CategoryChip";
import JobCard from "@/components/JobCard";
import JobDetailSheet from "@/components/JobDetailSheet";
import StudentProfileTab from "@/components/StudentProfileTab";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { useActor } from "@/hooks/useActor";
import { useAuth } from "@/hooks/useAuth";
import {
  type Application,
  ApplicationStatus,
  type JobWithDistance,
  useGetJobsNearLocation,
  useGetMyApplications,
  useGetMyProfile,
  useInitSeedData,
} from "@/hooks/useQueries";
import {
  BriefcaseBusiness,
  ListChecks,
  Loader2,
  LogOut,
  MapPin,
  Search,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const DHARMAPURI_LAT = 12.1211;
const DHARMAPURI_LNG = 78.1582;

const CATEGORIES = [
  "All",
  "Tea Shop",
  "Bakery",
  "Tuition Center",
  "Supermarket",
  "Courier Office",
  "Clinic",
  "Others",
];

type Tab = "feed" | "applications" | "profile";

function formatPay(amount: bigint, payType: string): string {
  const n = Number(amount);
  const formatted = new Intl.NumberFormat("en-IN").format(n);
  const typeLabel =
    payType === "hourly" ? "/hr" : payType === "daily" ? "/day" : "/mo";
  return `₹${formatted}${typeLabel}`;
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  if (status === ApplicationStatus.accepted) {
    return (
      <span className="status-accepted rounded-full px-2.5 py-0.5 text-xs font-bold">
        ✓ Accepted
      </span>
    );
  }
  if (status === ApplicationStatus.rejected) {
    return (
      <span className="status-rejected rounded-full px-2.5 py-0.5 text-xs font-bold">
        ✕ Rejected
      </span>
    );
  }
  return (
    <span className="status-pending rounded-full px-2.5 py-0.5 text-xs font-bold">
      ⏳ Pending
    </span>
  );
}

export default function StudentDashboard() {
  const { logout } = useAuth();
  const { actor, isFetching: actorFetching } = useActor();
  const [tab, setTab] = useState<Tab>("feed");
  const [radiusKm, setRadiusKm] = useState(6);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobWithDistance | null>(null);

  const { data: profile } = useGetMyProfile();
  const studentLat =
    profile?.__kind__ === "student"
      ? profile.student.locationLat
      : DHARMAPURI_LAT;
  const studentLng =
    profile?.__kind__ === "student"
      ? profile.student.locationLng
      : DHARMAPURI_LNG;

  // Init seed data once
  const seedMutation = useInitSeedData();
  const seedInitialized = useRef(false);
  useEffect(() => {
    if (actor && !actorFetching && !seedInitialized.current) {
      seedInitialized.current = true;
      const already = localStorage.getItem("dj_seed_done");
      if (!already) {
        seedMutation.mutate(undefined, {
          onSuccess: () => localStorage.setItem("dj_seed_done", "1"),
        });
      }
    }
  }, [actor, actorFetching, seedMutation]);

  const { data: jobsNear = [], isLoading: jobsLoading } =
    useGetJobsNearLocation(studentLat, studentLng, radiusKm);
  const { data: applications = [], isLoading: appsLoading } =
    useGetMyApplications();

  // Filter jobs
  const filteredJobs = jobsNear.filter((jd) => {
    const matchCategory = category === "All" || jd.job.category === category;
    const matchSearch =
      !search ||
      jd.job.title.toLowerCase().includes(search.toLowerCase()) ||
      jd.job.address.toLowerCase().includes(search.toLowerCase()) ||
      jd.job.category.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const existingApp = selectedJob
    ? (applications.find(
        (a) => a.jobId.toString() === selectedJob.job.id.toString(),
      ) ?? null)
    : null;

  return (
    <div className="app-shell flex flex-col min-h-dvh bg-background">
      {/* Top header */}
      <header className="bg-white px-5 pt-safe-top pt-10 pb-4 shadow-xs border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">
              Dharmapuri Jobs
            </h1>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <MapPin className="w-3 h-3 text-teal" />
              <span>Dharmapuri, TN</span>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Tab content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          {tab === "feed" && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-4 pt-4"
            >
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  data-ocid="job_feed.search_input"
                  placeholder="Search jobs, places…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11 rounded-xl pl-9 bg-white"
                />
              </div>

              {/* Radius */}
              <div className="bg-white rounded-xl p-3 mb-3 shadow-xs border border-border/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Search radius
                  </span>
                  <span className="text-xs font-bold text-teal">
                    {radiusKm} km
                  </span>
                </div>
                <Slider
                  data-ocid="job_feed.radius.select"
                  min={1}
                  max={10}
                  step={0.5}
                  value={[radiusKm]}
                  onValueChange={([v]) => setRadiusKm(v)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 km</span>
                  <span>10 km</span>
                </div>
              </div>

              {/* Categories */}
              <div
                className="flex gap-2 overflow-x-auto scrollbar-hide mb-4 -mx-1 px-1 pb-1"
                data-ocid="job_feed.category.tab"
              >
                {CATEGORIES.map((cat) => (
                  <CategoryChip
                    key={cat}
                    category={cat}
                    active={category === cat}
                    onClick={() => setCategory(cat)}
                    size="sm"
                  />
                ))}
              </div>

              {/* Jobs count */}
              <p className="text-xs text-muted-foreground mb-3 font-medium">
                {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}{" "}
                found {category !== "All" && `in ${category}`}
              </p>

              {/* Job list */}
              {jobsLoading ? (
                <div className="flex flex-col gap-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl p-4 shadow-xs border border-border/60"
                    >
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2 mb-3" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  ))}
                </div>
              ) : filteredJobs.length === 0 ? (
                <div
                  data-ocid="job_feed.empty_state"
                  className="flex flex-col items-center justify-center py-14 text-center"
                >
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="font-semibold text-foreground">No jobs found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try increasing the search radius or changing the category
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredJobs.map((jd, idx) => (
                    <JobCard
                      key={jd.job.id.toString()}
                      job={jd.job}
                      distanceKm={jd.distanceKm}
                      onClick={() => setSelectedJob(jd)}
                      index={idx + 1}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {tab === "applications" && (
            <motion.div
              key="apps"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-4 pt-4"
            >
              <h2 className="text-base font-bold mb-4">My Applications</h2>
              {appsLoading ? (
                <div className="flex flex-col gap-3">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl p-4 shadow-xs border border-border/60"
                    >
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : applications.length === 0 ? (
                <div
                  data-ocid="applications.empty_state"
                  className="flex flex-col items-center justify-center py-14 text-center"
                >
                  <div className="text-4xl mb-3">📋</div>
                  <p className="font-semibold text-foreground">
                    No applications yet
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Browse jobs and apply to get started
                  </p>
                  <Button
                    onClick={() => setTab("feed")}
                    className="mt-4 rounded-xl bg-teal text-white hover:bg-teal-dark"
                  >
                    Browse Jobs
                  </Button>
                </div>
              ) : (
                <div
                  data-ocid="applications.list"
                  className="flex flex-col gap-3"
                >
                  {applications.map((app) => (
                    <ApplicationCard
                      key={app.id.toString()}
                      app={app}
                      jobs={jobsNear}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {tab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-4 pt-4"
            >
              <StudentProfileTab />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom navigation */}
      <nav className="bottom-nav shadow-bottom">
        <div className="flex">
          <BottomNavItem
            label="Job Feed"
            icon={<BriefcaseBusiness className="w-5 h-5" />}
            active={tab === "feed"}
            onClick={() => setTab("feed")}
            dataOcid="nav.student_feed.tab"
          />
          <BottomNavItem
            label="Applications"
            icon={<ListChecks className="w-5 h-5" />}
            active={tab === "applications"}
            onClick={() => setTab("applications")}
            dataOcid="nav.applications.tab"
            badge={
              applications.filter((a) => a.status === ApplicationStatus.pending)
                .length
            }
          />
          <BottomNavItem
            label="Profile"
            icon={<User className="w-5 h-5" />}
            active={tab === "profile"}
            onClick={() => setTab("profile")}
            dataOcid="nav.profile.tab"
          />
        </div>
      </nav>

      {/* Job detail sheet */}
      <JobDetailSheet
        job={selectedJob?.job ?? null}
        distanceKm={selectedJob?.distanceKm}
        existingApplication={existingApp}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
}

function BottomNavItem({
  label,
  icon,
  active,
  onClick,
  dataOcid,
  badge,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  dataOcid: string;
  badge?: number;
}) {
  return (
    <button
      type="button"
      data-ocid={dataOcid}
      onClick={onClick}
      className="flex-1 flex flex-col items-center py-3 gap-1 relative transition-colors"
    >
      <div className={active ? "text-teal" : "text-muted-foreground"}>
        {icon}
      </div>
      <span
        className={`text-[10px] font-semibold ${active ? "text-teal" : "text-muted-foreground"}`}
      >
        {label}
      </span>
      {!!badge && badge > 0 && (
        <span className="absolute top-2 right-1/4 w-4 h-4 rounded-full bg-saffron text-white text-[9px] font-bold flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
}

function ApplicationCard({
  app,
  jobs,
}: {
  app: Application;
  jobs: JobWithDistance[];
}) {
  const jd = jobs.find((j) => j.job.id.toString() === app.jobId.toString());
  const job = jd?.job;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-xs border border-border/60 flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground truncate">
          {job?.title ?? `Job #${app.jobId.toString()}`}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {job
            ? `${job.category} · ${formatPay(job.payAmount, job.payType)}`
            : "Loading…"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Applied{" "}
          {new Date(Number(app.appliedAt) / 1_000_000).toLocaleDateString(
            "en-IN",
          )}
        </p>
      </div>
      <StatusBadge status={app.status} />
    </div>
  );
}
