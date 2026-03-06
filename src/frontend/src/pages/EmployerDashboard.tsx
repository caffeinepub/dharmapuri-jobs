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
      {/* Header */}
      <header className="bg-white px-5 pt-10 pb-4 shadow-xs border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">
              {employer?.businessName ?? "My Business"}
            </h1>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <Building2 className="w-3 h-3 text-saffron" />
              <span>{employer?.businessType ?? "Business"} · Dharmapuri</span>
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
          {tab === "jobs" && (
            <motion.div
              key="jobs"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-4 pt-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold">My Posted Jobs</h2>
                <span className="text-xs text-muted-foreground">
                  {jobs.length} job{jobs.length !== 1 ? "s" : ""}
                </span>
              </div>

              {jobsLoading ? (
                <div className="flex flex-col gap-3">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl p-4 shadow-xs border border-border/60"
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
                  className="flex flex-col items-center py-14 text-center"
                >
                  <div className="text-4xl mb-3">📋</div>
                  <p className="font-semibold text-foreground">
                    No jobs posted yet
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Post your first job to start hiring students
                  </p>
                  <Button
                    onClick={() => setTab("post")}
                    className="mt-4 rounded-xl bg-saffron text-white hover:bg-saffron-dark"
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
          <BottomNavItem
            label="My Jobs"
            icon={<BriefcaseBusiness className="w-5 h-5" />}
            active={tab === "jobs"}
            onClick={() => setTab("jobs")}
            dataOcid="nav.employer_jobs.tab"
          />
          <BottomNavItem
            label="Post Job"
            icon={<PlusCircle className="w-5 h-5" />}
            active={tab === "post"}
            onClick={() => setTab("post")}
            dataOcid="nav.post_job.tab"
          />
          <BottomNavItem
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

function BottomNavItem({
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
      className="flex-1 flex flex-col items-center py-3 gap-1 transition-colors"
    >
      <div className={active ? "text-saffron" : "text-muted-foreground"}>
        {icon}
      </div>
      <span
        className={`text-[10px] font-semibold ${active ? "text-saffron" : "text-muted-foreground"}`}
      >
        {label}
      </span>
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
      className="bg-white rounded-2xl p-4 shadow-xs border border-border/60"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-foreground leading-tight truncate">
            {job.title}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <Banknote className="w-3 h-3" />
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
              data-ocid={`job.item.${index}`}
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
          <AlertDialogContent className="max-w-[320px] rounded-2xl mx-4">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this job?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove "{job.title}" and all its applications.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
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
          className="flex items-center gap-1.5 text-xs font-semibold text-teal hover:text-teal-dark transition-colors"
        >
          <Users className="w-3.5 h-3.5" />
          {applications.length} applicant{applications.length !== 1 ? "s" : ""}
          {pendingCount > 0 && (
            <span className="bg-saffron text-white rounded-full px-1.5 py-0.5 text-[9px] font-bold">
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
      <h2 className="text-base font-bold mb-1">Post a New Job</h2>

      <div className="flex flex-col gap-2">
        <Label htmlFor="job-title" className="text-sm font-semibold">
          Job Title *
        </Label>
        <Input
          id="job-title"
          data-ocid="post_job.title.input"
          placeholder="e.g. Part-time Cashier"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="h-12 rounded-xl"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="job-desc" className="text-sm font-semibold">
          Description
        </Label>
        <Textarea
          id="job-desc"
          data-ocid="post_job.description.textarea"
          placeholder="Describe the job, timings, and requirements…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="rounded-xl resize-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="job-category" className="text-sm font-semibold">
          Category *
        </Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="job-category" className="h-12 rounded-xl">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col gap-2 flex-1">
          <Label htmlFor="pay-amount" className="text-sm font-semibold">
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
            className="h-12 rounded-xl"
          />
        </div>
        <div className="flex flex-col gap-2 w-32">
          <Label className="text-sm font-semibold">Pay Type</Label>
          <Select value={payType} onValueChange={setPayType}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAY_TYPES.map((pt) => (
                <SelectItem key={pt} value={pt}>
                  {pt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="job-address" className="text-sm font-semibold">
          Address
        </Label>
        <Input
          id="job-address"
          placeholder="Shop/office address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="h-12 rounded-xl"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="job-tags" className="text-sm font-semibold">
          Tags (optional)
        </Label>
        <Input
          id="job-tags"
          placeholder="e.g. Weekend, Part-time, No experience"
          value={tagsRaw}
          onChange={(e) => setTagsRaw(e.target.value)}
          className="h-12 rounded-xl"
        />
        <p className="text-xs text-muted-foreground">Separate with commas</p>
      </div>

      {/* Location note */}
      <div className="flex items-start gap-2 rounded-xl bg-saffron-light p-3">
        <MapPin className="w-4 h-4 text-saffron-dark mt-0.5 shrink-0" />
        <p className="text-saffron-dark text-xs">
          Location auto-filled from your business profile
        </p>
      </div>

      <Button
        type="submit"
        data-ocid="post_job.submit_button"
        disabled={postJob.isPending}
        className="h-13 rounded-xl bg-saffron text-white font-bold text-base hover:bg-saffron-dark"
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
        className="max-h-[85dvh] overflow-y-auto rounded-t-3xl px-5 py-6"
      >
        <SheetHeader className="mb-4">
          <SheetTitle className="text-left">
            Applicants for "{job.title}"
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 border border-border/60"
              >
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-3 w-full mb-2" />
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <div className="text-3xl mb-2">👥</div>
            <p className="font-semibold text-foreground text-sm">
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

  return (
    <div className="bg-white rounded-2xl p-4 border border-border/60 shadow-xs">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-9 h-9 rounded-full bg-teal-light flex items-center justify-center shrink-0">
          <span className="text-teal text-sm font-bold">S</span>
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
        <p className="text-xs text-muted-foreground bg-muted/60 rounded-lg p-2 mb-3 leading-relaxed italic">
          "{app.message}"
        </p>
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
