import type { Job } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { ChevronRight, MapPin } from "lucide-react";
import CategoryChip from "./CategoryChip";

interface Props {
  job: Job;
  distanceKm?: number;
  businessName?: string;
  onClick: () => void;
  index?: number;
}

function formatPay(amount: bigint, payType: string): string {
  const n = Number(amount);
  const formatted = new Intl.NumberFormat("en-IN").format(n);
  const typeLabel =
    payType === "hourly" ? "/hr" : payType === "daily" ? "/day" : "/mo";
  return `₹${formatted}${typeLabel}`;
}

export default function JobCard({
  job,
  distanceKm,
  businessName,
  onClick,
  index = 1,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={`job.item.${index}`}
      className={cn(
        "w-full text-left bg-card rounded-2xl card-elevated job-card border border-border/60 p-4 flex flex-col gap-3",
      )}
    >
      {/* Top row: title + distance badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">
            {job.title}
          </h3>
          {businessName && (
            <p className="text-muted-foreground text-xs mt-0.5 truncate">
              {businessName}
            </p>
          )}
        </div>
        {distanceKm !== undefined && (
          <div className="badge-violet-cyan flex items-center gap-1 rounded-full text-white text-xs font-semibold px-2.5 py-1 shrink-0">
            <MapPin className="w-3 h-3" />
            {distanceKm.toFixed(1)} km
          </div>
        )}
      </div>

      {/* Pay — vivid cyan/saffron */}
      <div className="pay-gradient rounded-xl px-3 py-2">
        <p className="text-xs text-muted-foreground font-medium mb-0.5">Pay</p>
        <p className="text-base font-black text-cyan leading-none">
          {formatPay(job.payAmount, job.payType)}
        </p>
      </div>

      {/* Address */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="w-3 h-3 text-violet shrink-0" />
        <span className="truncate max-w-[180px]">
          {job.address || "Dharmapuri"}
        </span>
      </div>

      {/* Bottom row: category + tags + chevron */}
      <div className="flex items-center justify-between gap-2">
        <CategoryChip category={job.category} size="sm" showEmoji />
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {job.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="bg-muted/80 border border-border/50 px-2 py-0.5 rounded-full text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          <ChevronRight className="w-4 h-4 ml-0.5 opacity-40 text-violet" />
        </div>
      </div>
    </button>
  );
}
