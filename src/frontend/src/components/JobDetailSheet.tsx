import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { Application, Job } from "@/hooks/useQueries";
import { ApplicationStatus, useApplyToJob } from "@/hooks/useQueries";
import {
  Banknote,
  Building2,
  Calendar,
  CheckCircle2,
  Loader2,
  MapPin,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import CategoryChip from "./CategoryChip";

interface Props {
  job: Job | null;
  distanceKm?: number;
  businessName?: string;
  existingApplication?: Application | null;
  onClose: () => void;
}

function formatPay(amount: bigint, payType: string): string {
  const n = Number(amount);
  const formatted = new Intl.NumberFormat("en-IN").format(n);
  const typeLabel =
    payType === "hourly"
      ? " / hour"
      : payType === "daily"
        ? " / day"
        : " / month";
  return `₹${formatted}${typeLabel}`;
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  if (status === ApplicationStatus.accepted) {
    return (
      <span className="status-accepted rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" /> Accepted
      </span>
    );
  }
  if (status === ApplicationStatus.rejected) {
    return (
      <span className="status-rejected rounded-full px-3 py-1 text-xs font-bold">
        ✕ Rejected
      </span>
    );
  }
  return (
    <span className="status-pending rounded-full px-3 py-1 text-xs font-bold">
      ⏳ Pending
    </span>
  );
}

export default function JobDetailSheet({
  job,
  distanceKm,
  businessName,
  existingApplication,
  onClose,
}: Props) {
  const [showApply, setShowApply] = useState(false);
  const [message, setMessage] = useState("");
  const applyMutation = useApplyToJob();

  const handleApply = async () => {
    if (!job) return;
    try {
      await applyMutation.mutateAsync({ jobId: job.id, message });
      toast.success("Application submitted! 🎉");
      setShowApply(false);
      setMessage("");
    } catch {
      toast.error("Failed to apply. Try again.");
    }
  };

  if (!job) return null;

  return (
    <>
      <Sheet open={!!job} onOpenChange={(open) => !open && onClose()}>
        <SheetContent
          side="bottom"
          className="max-h-[90dvh] overflow-y-auto rounded-t-3xl px-5 py-6"
          data-ocid="job_detail.dialog"
        >
          <SheetHeader className="mb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <SheetTitle className="text-lg font-bold leading-tight text-left">
                  {job.title}
                </SheetTitle>
                {businessName && (
                  <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
                    <Building2 className="w-3.5 h-3.5" />
                    {businessName}
                  </div>
                )}
              </div>
              {distanceKm !== undefined && (
                <div className="flex items-center gap-1 rounded-full bg-teal-light px-2.5 py-1.5 text-teal text-sm font-bold shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                  {distanceKm.toFixed(1)} km
                </div>
              )}
            </div>
          </SheetHeader>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            <CategoryChip category={job.category} size="sm" showEmoji />
          </div>

          {/* Pay */}
          <div className="flex items-center gap-2 rounded-xl bg-saffron-light p-3 mb-4">
            <Banknote className="w-5 h-5 text-saffron-dark" />
            <div>
              <p className="text-saffron-dark text-xs font-medium">Pay</p>
              <p className="text-saffron-dark font-bold">
                {formatPay(job.payAmount, job.payType)}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 mb-4 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-teal" />
            <span>{job.address || "Dharmapuri, Tamil Nadu"}</span>
          </div>

          {/* Description */}
          {job.description && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                About the job
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                {job.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {job.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <Tag className="w-3.5 h-3.5 text-muted-foreground" />
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Posted */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-5">
            <Calendar className="w-3.5 h-3.5" />
            Posted{" "}
            {new Date(Number(job.postedAt) / 1_000_000).toLocaleDateString(
              "en-IN",
            )}
          </div>

          {/* CTA */}
          {existingApplication ? (
            <div className="flex flex-col items-center gap-2 py-3 rounded-xl bg-muted/50">
              <p className="text-xs text-muted-foreground font-medium">
                Your application status
              </p>
              <StatusBadge status={existingApplication.status} />
            </div>
          ) : (
            <Button
              onClick={() => setShowApply(true)}
              data-ocid="job_detail.apply_button"
              className="w-full h-13 rounded-xl bg-saffron text-white font-bold text-base hover:bg-saffron-dark transition-colors"
            >
              Apply Now →
            </Button>
          )}
        </SheetContent>
      </Sheet>

      {/* Apply dialog */}
      <Dialog open={showApply} onOpenChange={setShowApply}>
        <DialogContent className="max-w-sm rounded-2xl mx-4">
          <DialogHeader>
            <DialogTitle>Apply for "{job.title}"</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <Label htmlFor="apply-msg" className="text-sm font-semibold">
              Message to Employer (optional)
            </Label>
            <Textarea
              id="apply-msg"
              data-ocid="apply.message.textarea"
              placeholder="Tell the employer why you're a great fit..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="rounded-xl resize-none"
            />
          </div>
          <DialogFooter className="gap-2 flex-col sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setShowApply(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              disabled={applyMutation.isPending}
              data-ocid="apply.submit_button"
              className="rounded-xl bg-saffron text-white font-bold hover:bg-saffron-dark"
            >
              {applyMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Submitting…
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
