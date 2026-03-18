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
          className="max-h-[90dvh] overflow-y-auto rounded-t-3xl px-5 py-6 bg-card border-t border-border"
          data-ocid="job_detail.dialog"
        >
          <SheetHeader className="mb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <SheetTitle className="font-display text-lg font-bold leading-tight text-left text-foreground">
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
                <div className="badge-violet-cyan flex items-center gap-1 rounded-full text-white text-sm font-bold px-2.5 py-1.5 shrink-0">
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

          {/* Pay — vivid gradient card */}
          <div className="w-full rounded-2xl p-4 mb-4 flex flex-col items-start gap-1 bg-gradient-to-br from-violet-dark to-violet/30 border border-violet/30">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">
              Pay Rate
            </p>
            <p className="text-cyan text-2xl font-black leading-tight">
              {formatPay(job.payAmount, job.payType)}
            </p>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 mb-4 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-violet" />
            <span>{job.address || "Dharmapuri, Tamil Nadu"}</span>
          </div>

          {/* Description */}
          {job.description && (
            <div className="mb-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
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
                  className="bg-muted border border-border/50 text-muted-foreground text-xs px-2.5 py-1 rounded-full"
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
            <div className="flex flex-col items-center gap-2 py-3 rounded-xl bg-muted/50 border border-border/50">
              <p className="text-xs text-muted-foreground font-medium">
                Your application status
              </p>
              <StatusBadge status={existingApplication.status} />
            </div>
          ) : (
            <Button
              onClick={() => setShowApply(true)}
              data-ocid="job_detail.apply_button"
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet to-violet-dark text-white font-bold text-base btn-glow transition-all hover:opacity-90"
            >
              Apply Now →
            </Button>
          )}
        </SheetContent>
      </Sheet>

      {/* Apply dialog */}
      <Dialog open={showApply} onOpenChange={setShowApply}>
        <DialogContent
          data-ocid="apply.dialog"
          className="max-w-sm rounded-2xl mx-4 bg-card border-border"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">
              Apply for "{job.title}"
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <Label
              htmlFor="apply-msg"
              className="text-sm font-semibold text-foreground"
            >
              Message to Employer (optional)
            </Label>
            <Textarea
              id="apply-msg"
              data-ocid="apply.message.textarea"
              placeholder="Tell the employer why you're a great fit..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="rounded-xl resize-none bg-muted border-border/60 text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <DialogFooter className="gap-2 flex-col sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setShowApply(false)}
              data-ocid="apply.cancel_button"
              className="rounded-xl border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              disabled={applyMutation.isPending}
              data-ocid="apply.submit_button"
              className="rounded-xl bg-gradient-to-r from-violet to-violet-dark text-white font-bold btn-glow hover:opacity-90"
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
