import type { Job } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { Banknote, ChevronRight, Clock, MapPin } from "lucide-react";
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
      className="w-full text-left bg-white rounded-2xl shadow-card job-card border border-border/60 p-4 flex flex-col gap-3"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-sm leading-tight line-clamp-2">
            {job.title}
          </h3>
          {businessName && (
            <p className="text-muted-foreground text-xs mt-0.5 truncate">
              {businessName}
            </p>
          )}
        </div>
        {distanceKm !== undefined && (
          <div className="flex items-center gap-1 rounded-full bg-teal-light px-2 py-1 text-teal text-xs font-semibold shrink-0">
            <MapPin className="w-3 h-3" />
            {distanceKm.toFixed(1)} km
          </div>
        )}
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Banknote className="w-3.5 h-3.5" />
          <span className="font-semibold text-foreground">
            {formatPay(job.payAmount, job.payType)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span className="truncate max-w-[140px]">
            {job.address || "Dharmapuri"}
          </span>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between gap-2">
        <CategoryChip category={job.category} size="sm" showEmoji />
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {job.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="bg-muted px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
          <ChevronRight className="w-4 h-4 ml-1 opacity-50" />
        </div>
      </div>
    </button>
  );
}
