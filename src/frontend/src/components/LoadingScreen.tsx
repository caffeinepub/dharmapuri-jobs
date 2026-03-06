import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="app-shell flex items-center justify-center min-h-dvh">
      <div className="flex flex-col items-center gap-4">
        <img
          src="/assets/generated/dj-logo-transparent.dim_120x120.png"
          alt="Dharmapuri Jobs"
          className="w-16 h-16 rounded-2xl"
        />
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading…</span>
        </div>
      </div>
    </div>
  );
}
