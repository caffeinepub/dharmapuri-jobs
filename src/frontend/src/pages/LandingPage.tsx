import type { AppRole } from "@/App";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  Briefcase,
  ChevronRight,
  Loader2,
  MapPin,
  Star,
  Store,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface Props {
  onRoleSelect: (role: AppRole) => void;
}

const FEATURES = [
  { icon: "📍", label: "Hyperlocal", text: "Jobs within 5–6 km" },
  { icon: "⚡", label: "Instant", text: "Apply in one tap" },
  { icon: "💰", label: "Flexible Pay", text: "Hourly, daily & monthly" },
  { icon: "🏪", label: "Local Shops", text: "Tea, bakery & more" },
];

type FloatEmoji = {
  emoji: string;
  top: string;
  leftPos?: string;
  rightPos?: string;
  rotate: string;
  size: string;
};

const FLOATING_EMOJIS: FloatEmoji[] = [
  {
    emoji: "☕",
    top: "10%",
    leftPos: "7%",
    rotate: "-15deg",
    size: "text-3xl",
  },
  {
    emoji: "🥐",
    top: "18%",
    rightPos: "9%",
    rotate: "10deg",
    size: "text-2xl",
  },
  { emoji: "📚", top: "52%", leftPos: "4%", rotate: "-8deg", size: "text-3xl" },
  {
    emoji: "🛒",
    top: "58%",
    rightPos: "6%",
    rotate: "12deg",
    size: "text-2xl",
  },
  { emoji: "📦", top: "33%", leftPos: "2%", rotate: "5deg", size: "text-xl" },
];

export default function LandingPage({ onRoleSelect }: Props) {
  const { login, isLoggingIn } = useAuth();
  const [selectedRole, setSelectedRole] = useState<AppRole>(null);

  const handleRoleLogin = (role: AppRole) => {
    if (isLoggingIn) return;
    onRoleSelect(role);
    setSelectedRole(role);
    login();
  };

  return (
    <div className="app-shell flex flex-col min-h-dvh bg-background">
      {/* Hero */}
      <div className="hero-gradient px-6 pt-14 pb-12 flex flex-col items-center text-center relative overflow-hidden">
        {/* Floating emojis */}
        {FLOATING_EMOJIS.map((item) => (
          <div
            key={item.emoji}
            className={`absolute ${item.size} opacity-[0.08] pointer-events-none select-none`}
            style={{
              top: item.top,
              left: item.leftPos,
              right: item.rightPos,
              transform: `rotate(${item.rotate})`,
            }}
          >
            {item.emoji}
          </div>
        ))}

        {/* Glowing orbs in bg */}
        <div
          className="absolute top-0 left-1/4 w-40 h-40 rounded-full opacity-[0.12] blur-3xl pointer-events-none"
          style={{ background: "oklch(0.62 0.22 285)" }}
        />
        <div
          className="absolute bottom-4 right-1/4 w-32 h-32 rounded-full opacity-[0.10] blur-3xl pointer-events-none"
          style={{ background: "oklch(0.65 0.26 340)" }}
        />

        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
          className="mb-5 relative z-10"
        >
          <div className="relative">
            <div
              className="absolute inset-0 rounded-2xl blur-lg opacity-50"
              style={{ background: "oklch(0.62 0.22 285)" }}
            />
            <img
              src="/assets/generated/dj-logo-transparent.dim_120x120.png"
              alt="Dharmapuri Jobs Logo"
              className="w-20 h-20 rounded-2xl shadow-lg mx-auto ring-2 ring-violet/30 relative z-10"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="relative z-10"
        >
          <h1 className="font-display text-4xl font-black text-white tracking-tighter leading-tight">
            Dharmapuri
            <br />
            <span className="gradient-text-saffron">Jobs</span>
          </h1>
          <p className="mt-3 text-white/70 text-base font-medium">
            Find part-time work near you
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-2 text-white/45 text-xs">
            <MapPin className="w-3 h-3" />
            <span>Dharmapuri, Tamil Nadu</span>
          </div>
        </motion.div>

        {/* Trust pill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-5 flex items-center gap-1.5 glass-surface rounded-full px-3.5 py-1.5 relative z-10"
        >
          <Star className="w-3.5 h-3.5 text-saffron fill-saffron" />
          <span className="text-white/80 text-xs font-semibold">
            Trusted by 1,200+ students
          </span>
        </motion.div>
      </div>

      {/* Feature strip */}
      <div className="bg-card px-4 py-3.5 border-b border-border overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 min-w-max pr-2">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2 bg-muted/60 rounded-xl px-3 py-2 whitespace-nowrap border border-border/50"
            >
              <span className="text-base">{f.icon}</span>
              <div>
                <p className="text-[10px] font-bold text-foreground leading-tight">
                  {f.label}
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  {f.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role selection */}
      <div className="flex-1 bg-background px-5 pt-7 pb-8 flex flex-col gap-4">
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-center text-muted-foreground mb-5 font-semibold uppercase tracking-wider text-[11px]">
            Choose your role to get started
          </p>

          {/* Student card */}
          <button
            type="button"
            data-ocid="landing.student.button"
            onClick={() => handleRoleLogin("student")}
            disabled={isLoggingIn}
            className="w-full text-left mb-3 rounded-2xl border border-border bg-card card-elevated hover:card-glow-violet hover:scale-[1.02] transition-all duration-200 p-4 flex items-center gap-4 disabled:opacity-60"
          >
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-violet to-violet-dark shadow-violet-glow">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-display font-bold text-foreground text-base">
                I'm a Student
              </p>
              <p className="text-muted-foreground text-sm mt-0.5">
                Browse jobs near your college
              </p>
            </div>
            {isLoggingIn && selectedRole === "student" ? (
              <Loader2 className="w-5 h-5 animate-spin text-violet" />
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {/* Employer card */}
          <button
            type="button"
            data-ocid="landing.employer.button"
            onClick={() => handleRoleLogin("employer")}
            disabled={isLoggingIn}
            className="w-full text-left rounded-2xl border border-border bg-card card-elevated hover:card-glow-pink hover:scale-[1.02] transition-all duration-200 p-4 flex items-center gap-4 disabled:opacity-60"
          >
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-pink to-pink-dark shadow-pink-glow">
              <Store className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-display font-bold text-foreground text-base">
                I'm a Business Owner
              </p>
              <p className="text-muted-foreground text-sm mt-0.5">
                Post jobs & hire students
              </p>
            </div>
            {isLoggingIn && selectedRole === "employer" ? (
              <Loader2 className="w-5 h-5 animate-spin text-pink" />
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-auto"
        >
          <div className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground text-center border border-border/60">
            <span className="text-base">🏪</span>{" "}
            <span className="font-medium text-foreground/70">
              Tea shops, bakeries, tuition centers & more
            </span>
            <p className="text-xs mt-1 text-muted-foreground">
              All in your neighborhood
            </p>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-card py-4 px-5 text-center text-xs text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} Dharmapuri Jobs.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-violet transition-colors"
        >
          Built with ❤️ using caffeine.ai
        </a>
      </footer>
    </div>
  );
}
