import CategoryChip from "@/components/CategoryChip";
import EmployerProfileTab from "@/components/EmployerProfileTab";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import {
  type Application,
  ApplicationStatus,
  type Job,
  useDeleteJob,
  useGetApplicationsForJob,
  useGetMyProfile,
  useListJobsByEmployer,
  usePostJob,
  useUpdateApplicationStatus,
} from "@/hooks/useQueries";
import {
  Banknote,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  Loader2,
  LogOut,
  MapPin,
  PlusCircle,
  Trash2,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const CATEGORIES = [
  "Tea Shop",
  "Bakery",
  "Tuition Center",
  "Supermarket",
  "Courier Office",
  "Clinic",
  "Others",
];
const PAY_TYPES = ["hourly", "daily", "monthly"];

type Tab = "jobs" | "post" | "profile";

export default function EmployerDashboard() {
  const { logout, principal } = useAuth();
  const [tab, setTab] = useState<Tab>("jobs");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const { data: profile } = useGetMyProfile();
  const employer = profile?.__kind__ === "employer" ? profile.employer : null;

  const { data: jobs = [], isLoading: jobsLoading } = useListJobsByEmployer(
    principal ?? "",
  );

  return (
    <div className="app-shell flex flex-col min-h-dvh bg-background">
      {/* Gradient header */}
      <header className="gradient-header px-5 pt-10 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-lg font-bold text-white tracking-tight">
              {employer?.businessName ?? "My Business"}
            </h1>
            <div className="flex items-center gap-1 text-xs text-white/55 mt-0.5">
              <Building2 className="w-3 h-3 text-pink/80" />
              <span>{employer?.businessType ?? "Business"} · Dharmapuri</span>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4 text-white/80" />
          </button>
        </div>
      </header>

      {/* Tab content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          {tab === "jobs" && (
            <motion.div
              key="jobs"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-4 pt-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-base font-bold text-foreground">
                  My Posted Jobs
                </h2>
                <span className="text-xs text-muted-foreground font-semibold">
                  {jobs.length} job{jobs.length !== 1 ? "s" : ""}
                </span>
              </div>

              {jobsLoading ? (
                <div
                  className="flex flex-col gap-3"
                  data-ocid="employer_jobs.loading_state"
                >
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="bg-card rounded-2xl p-4 card-elevated border border-border/40"
                    >
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2 mb-3" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <div
                  data-ocid="employer_jobs.empty_state"
                  className="flex flex-col items-center py-16 text-center"
                >
                  <div className="text-6xl mb-4">📋</div>
                  <p className="font-display font-bold text-foreground text-base">
                    No jobs posted yet
                  </p>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    Post your first job to start hiring students
                  </p>
                  <Button
                    onClick={() => setTab("post")}
                    className="mt-5 rounded-xl bg-gradient-to-r from-pink to-pink-dark text-white hover:opacity-90 btn-glow-pink"
                  >
                    Post a Job
                  </Button>
                </div>
              ) : (
                <div
                  data-ocid="employer_jobs.list"
                  className="flex flex-col gap-3"
                >
                  {jobs.map((job, idx) => (
                    <EmployerJobCard
                      key={job.id.toString()}
                      job={job}
                      index={idx + 1}
                      onViewApplicants={() => setSelectedJob(job)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {tab === "post" && (
            <motion.div
              key="post"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-4 pt-4"
            >
              <PostJobForm
                employer={employer}
                onSuccess={() => setTab("jobs")}
              />
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
              <EmployerProfileTab />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom navigation */}
      <nav className="bottom-nav shadow-bottom">
        <div className="flex">
          <BottomNavItemEmployer
            label="My Jobs"
            icon={<BriefcaseBusiness className="w-5 h-5" />}
            active={tab === "jobs"}
            onClick={() => setTab("jobs")}
            dataOcid="nav.employer_jobs.tab"
          />
          <BottomNavItemEmployer
            label="Post Job"
            icon={<PlusCircle className="w-5 h-5" />}
            active={tab === "post"}
            onClick={() => setTab("post")}
            dataOcid="nav.post_job.tab"
          />
          <BottomNavItemEmployer
            label="Profile"
            icon={<User className="w-5 h-5" />}
            active={tab === "profile"}
            onClick={() => setTab("profile")}
            dataOcid="nav.employer_profile.tab"
          />
        </div>
      </nav>

      {/* Applicants sheet */}
      {selectedJob && (
        <ApplicantsSheet
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}

function BottomNavItemEmployer({
  label,
  icon,
  active,
  onClick,
  dataOcid,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  dataOcid: string;
}) {
  return (
    <button
      type="button"
      data-ocid={dataOcid}
      onClick={onClick}
      className="flex-1 flex flex-col items-center py-2.5 gap-0.5 relative transition-all duration-200"
    >
      {active && (
        <span
          className="nav-active-indicator"
          style={{ background: "oklch(var(--pink))" }}
        />
      )}
      <div
        className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200"
        style={active ? { background: "oklch(var(--pink-light))" } : undefined}
      >
        <div
          style={{ color: active ? "oklch(var(--pink))" : undefined }}
          className={active ? "" : "text-muted-foreground"}
        >
          {icon}
        </div>
        <span className="text-[10px] font-bold">
          {!active && <span className="text-muted-foreground">{label}</span>}
          {active && (
            <span style={{ color: "oklch(var(--pink))" }}>{label}</span>
          )}
        </span>
      </div>
    </button>
  );
}

function EmployerJobCard({
  job,
  index,
  onViewApplicants,
}: {
  job: Job;
  index: number;
  onViewApplicants: () => void;
}) {
  const deleteMutation = useDeleteJob();
  const { data: applications = [] } = useGetApplicationsForJob(job.id);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(job.id);
      toast.success("Job deleted");
    } catch {
      toast.error("Failed to delete job");
    }
  };

  const pendingCount = applications.filter(
    (a) => a.status === ApplicationStatus.pending,
  ).length;

  return (
    <div
      data-ocid={`job.item.${index}`}
      className="bg-card rounded-2xl p-4 card-elevated border border-border/50"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground leading-tight truncate">
            {job.title}
          </h3>
          <div className="flex items-center gap-1.5 text-sm font-black text-cyan mt-1">
            <Banknote className="w-3.5 h-3.5 text-cyan/70" />
            <span>
              ₹{Number(job.payAmount).toLocaleString("en-IN")}/{job.payType}
            </span>
            {!job.isActive && (
              <Badge
                variant="destructive"
                className="text-[10px] py-0 px-1.5 ml-1"
              >
                Inactive
              </Badge>
            )}
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              data-ocid={`job.delete_button.${index}`}
              className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              aria-label={`Delete job ${index}`}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-[320px] rounded-2xl mx-4 bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">
                Delete this job?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                This will remove "{job.title}" and all its applications.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                data-ocid={`job.cancel_button.${index}`}
                className="rounded-xl border-border text-foreground hover:bg-muted"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                data-ocid={`job.confirm_button.${index}`}
                onClick={handleDelete}
                className="rounded-xl bg-destructive hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex items-center justify-between">
        <CategoryChip category={job.category} size="sm" showEmoji />
        <button
          type="button"
          onClick={onViewApplicants}
          className="flex items-center gap-1.5 text-xs font-bold text-violet hover:text-violet-dark transition-colors"
        >
          <Users className="w-3.5 h-3.5" />
          {applications.length} applicant{applications.length !== 1 ? "s" : ""}
          {pendingCount > 0 && (
            <span className="bg-pink text-white rounded-full px-1.5 py-0.5 text-[9px] font-bold">
              {pendingCount}
            </span>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

interface PostJobFormProps {
  employer: {
    locationLat: number;
    locationLng: number;
    businessType: string;
  } | null;
  onSuccess: () => void;
}

function PostJobForm({ employer, onSuccess }: PostJobFormProps) {
  const { principal } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payType, setPayType] = useState("daily");
  const [address, setAddress] = useState("");
  const [tagsRaw, setTagsRaw] = useState("");

  const postJob = usePostJob();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category || !payAmount) {
      toast.error("Title, category, and pay are required");
      return;
    }
    if (!principal) {
      toast.error("Not authenticated");
      return;
    }

    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const { Principal } = await import("@icp-sdk/core/principal");
      await postJob.mutateAsync({
        id: BigInt(0),
        employerId: Principal.fromText(principal),
        title: title.trim(),
        description: description.trim(),
        category,
        payAmount: BigInt(Math.round(Number.parseFloat(payAmount))),
        payType,
        locationLat: employer?.locationLat ?? 12.1211,
        locationLng: employer?.locationLng ?? 78.1582,
        address: address.trim() || "Dharmapuri, Tamil Nadu",
        isActive: true,
        postedAt: BigInt(Date.now()) * BigInt(1_000_000),
        tags,
      });
      toast.success("Job posted successfully! 🎉");
      setTitle("");
      setDescription("");
      setCategory("");
      setPayAmount("");
      setPayType("daily");
      setAddress("");
      setTagsRaw("");
      onSuccess();
    } catch {
      toast.error("Failed to post job. Try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 pb-8">
      <div className="bg-card rounded-2xl p-5 card-elevated border border-border/50">
        <h2 className="font-display text-base font-bold mb-4 text-foreground">
          Post a New Job
        </h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="job-title"
              className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
            >
              Job Title *
            </Label>
            <Input
              id="job-title"
              data-ocid="post_job.title.input"
              placeholder="e.g. Part-time Cashier"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-12 rounded-xl bg-muted border-border/60 text-foreground placeholder:text-muted-foreground focus-visible:ring-pink/40"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="job-desc"
              className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
            >
              Description
            </Label>
            <Textarea
              id="job-desc"
              data-ocid="post_job.description.textarea"
              placeholder="Describe the job, timings, and requirements…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="rounded-xl resize-none bg-muted border-border/60 text-foreground placeholder:text-muted-foreground focus-visible:ring-pink/40"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="job-category"
              className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
            >
              Category *
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                id="job-category"
                className="h-12 rounded-xl bg-muted border-border/60 text-foreground focus:ring-pink/40"
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {CATEGORIES.map((c) => (
                  <SelectItem
                    key={c}
                    value={c}
                    className="text-foreground focus:bg-muted"
                  >
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-2 flex-1">
              <Label
                htmlFor="pay-amount"
                className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                Pay Amount *
              </Label>
              <Input
                id="pay-amount"
                type="number"
                placeholder="e.g. 500"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                min={1}
                required
                className="h-12 rounded-xl bg-muted border-border/60 text-foreground placeholder:text-muted-foreground focus-visible:ring-pink/40"
              />
            </div>
            <div className="flex flex-col gap-2 w-32">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Pay Type
              </Label>
              <Select value={payType} onValueChange={setPayType}>
                <SelectTrigger className="h-12 rounded-xl bg-muted border-border/60 text-foreground focus:ring-pink/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {PAY_TYPES.map((pt) => (
                    <SelectItem
                      key={pt}
                      value={pt}
                      className="text-foreground focus:bg-muted"
                    >
                      {pt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="job-address"
              className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
            >
              Address
            </Label>
            <Input
              id="job-address"
              placeholder="Shop/office address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-12 rounded-xl bg-muted border-border/60 text-foreground placeholder:text-muted-foreground focus-visible:ring-pink/40"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="job-tags"
              className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
            >
              Tags (optional)
            </Label>
            <Input
              id="job-tags"
              placeholder="e.g. Weekend, Part-time, No experience"
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
              className="h-12 rounded-xl bg-muted border-border/60 text-foreground placeholder:text-muted-foreground focus-visible:ring-pink/40"
            />
            <p className="text-xs text-muted-foreground">
              Separate with commas
            </p>
          </div>
        </div>
      </div>

      {/* Location note */}
      <div className="flex items-start gap-2 rounded-xl p-3 border border-violet/20 bg-violet-light/50">
        <MapPin className="w-4 h-4 text-violet mt-0.5 shrink-0" />
        <p className="text-violet text-xs">
          Location auto-filled from your business profile
        </p>
      </div>

      <Button
        type="submit"
        data-ocid="post_job.submit_button"
        disabled={postJob.isPending}
        className="h-14 rounded-2xl bg-gradient-to-r from-pink to-pink-dark text-white font-bold text-base btn-glow-pink transition-all hover:opacity-90"
      >
        {postJob.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" /> Posting…
          </>
        ) : (
          "Post Job →"
        )}
      </Button>
    </form>
  );
}

function ApplicantsSheet({ job, onClose }: { job: Job; onClose: () => void }) {
  const { data: applications = [], isLoading } = useGetApplicationsForJob(
    job.id,
  );
  const updateStatus = useUpdateApplicationStatus();

  const handleStatus = async (appId: bigint, status: ApplicationStatus) => {
    try {
      await updateStatus.mutateAsync({ appId, status });
      toast.success(
        status === ApplicationStatus.accepted
          ? "Applicant accepted!"
          : "Application rejected",
      );
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        data-ocid="applicants.sheet"
        className="max-h-[85dvh] overflow-y-auto rounded-t-3xl px-5 py-6 bg-card border-t border-border"
      >
        <SheetHeader className="mb-4">
          <SheetTitle className="text-left font-display text-foreground">
            Applicants for "{job.title}"
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-muted rounded-2xl p-4 border border-border/40"
              >
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-3 w-full mb-2" />
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div
            data-ocid="applicants.empty_state"
            className="flex flex-col items-center py-10 text-center"
          >
            <div className="text-5xl mb-3">👥</div>
            <p className="font-display font-bold text-foreground text-sm">
              No applicants yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Students will appear here once they apply
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {applications.map((app, idx) => (
              <ApplicantCard
                key={app.id.toString()}
                app={app}
                index={idx + 1}
                onAccept={() =>
                  handleStatus(app.id, ApplicationStatus.accepted)
                }
                onReject={() =>
                  handleStatus(app.id, ApplicationStatus.rejected)
                }
                isUpdating={updateStatus.isPending}
              />
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function ApplicantCard({
  app,
  index,
  onAccept,
  onReject,
  isUpdating,
}: {
  app: Application;
  index: number;
  onAccept: () => void;
  onReject: () => void;
  isUpdating: boolean;
}) {
  const shortId = `${app.studentId.toString().slice(0, 12)}…`;
  const appliedDate = new Date(
    Number(app.appliedAt) / 1_000_000,
  ).toLocaleDateString("en-IN");
  const initial = "S";

  return (
    <div
      data-ocid={`applicant.item.${index}`}
      className="bg-muted rounded-2xl p-4 border border-border/40"
    >
      <div className="flex items-start gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet to-violet-dark flex items-center justify-center shrink-0">
          <span className="text-white text-sm font-bold">{initial}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground font-mono">
            {shortId}
          </p>
          <p className="text-xs text-muted-foreground">Applied {appliedDate}</p>
        </div>
        {app.status !== ApplicationStatus.pending && (
          <span
            className={`text-xs font-bold rounded-full px-2 py-0.5 ${
              app.status === ApplicationStatus.accepted
                ? "status-accepted"
                : "status-rejected"
            }`}
          >
            {app.status === ApplicationStatus.accepted
              ? "✓ Accepted"
              : "✕ Rejected"}
          </span>
        )}
      </div>

      {app.message && (
        <blockquote className="text-xs text-muted-foreground bg-background/60 rounded-lg p-2.5 mb-3 leading-relaxed italic border-l-2 border-violet/30">
          "{app.message}"
        </blockquote>
      )}

      {app.status === ApplicationStatus.pending && (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={onAccept}
            disabled={isUpdating}
            data-ocid={`applicant.accept_button.${index}`}
            className="flex-1 h-9 rounded-xl bg-success text-white text-xs font-bold hover:bg-success/90"
          >
            {isUpdating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Accept
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onReject}
            disabled={isUpdating}
            data-ocid={`applicant.reject_button.${index}`}
            className="flex-1 h-9 rounded-xl border-destructive text-destructive text-xs font-bold hover:bg-destructive/10"
          >
            {isUpdating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
