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
import { toast } from "sonner";

interface Props {
  onRoleSelect: (role: AppRole) => void;
}

const FEATURES = [
  { icon: "📍", text: "Jobs within 5–6 km of your location" },
  { icon: "⚡", text: "Apply instantly, get hired fast" },
  { icon: "💰", text: "Daily, hourly & monthly pay options" },
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
    <div className="app-shell flex flex-col min-h-dvh">
      {/* Hero */}
      <div className="saffron-hero px-6 pt-14 pb-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
          className="mb-5"
        >
          <img
            src="/assets/generated/dj-logo-transparent.dim_120x120.png"
            alt="Dharmapuri Jobs Logo"
            className="w-20 h-20 rounded-2xl shadow-lg mx-auto"
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">
            Dharmapuri
            <br />
            <span className="text-saffron-light">Jobs</span>
          </h1>
          <p className="mt-2 text-white/80 text-base font-medium">
            Find part-time work near you
          </p>
          <div className="flex items-center justify-center gap-1 mt-2 text-white/60 text-xs">
            <MapPin className="w-3 h-3" />
            <span>Dharmapuri, Tamil Nadu</span>
          </div>
        </motion.div>

        {/* Rating pill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5"
        >
          <Star className="w-3.5 h-3.5 text-saffron-light fill-saffron-light" />
          <span className="text-white/90 text-xs font-medium">
            Trusted by 1,200+ students
          </span>
        </motion.div>
      </div>

      {/* Features strip */}
      <div className="bg-white px-4 py-4 border-b border-border">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {FEATURES.map((f) => (
            <div
              key={f.text}
              className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap"
            >
              <span className="text-sm">{f.icon}</span>
              <span>{f.text}</span>
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
          <p className="text-center text-sm text-muted-foreground mb-5 font-medium">
            Choose how you want to use the app
          </p>

          {/* Student card */}
          <button
            type="button"
            onClick={() => handleRoleLogin("student")}
            disabled={isLoggingIn}
            className="w-full text-left mb-3 rounded-2xl border-2 border-transparent bg-white shadow-card hover:border-teal hover:shadow-card-hover transition-all duration-200 p-4 flex items-center gap-4 disabled:opacity-60"
          >
            <div className="w-14 h-14 rounded-xl bg-teal-light flex items-center justify-center shrink-0">
              <Briefcase className="w-7 h-7 text-teal" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground text-base">
                I'm a Student
              </p>
              <p className="text-muted-foreground text-sm mt-0.5">
                Browse jobs near your college
              </p>
            </div>
            {isLoggingIn && selectedRole === "student" ? (
              <Loader2 className="w-5 h-5 animate-spin text-teal" />
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {/* Employer card */}
          <button
            type="button"
            onClick={() => handleRoleLogin("employer")}
            disabled={isLoggingIn}
            className="w-full text-left rounded-2xl border-2 border-transparent bg-white shadow-card hover:border-saffron hover:shadow-card-hover transition-all duration-200 p-4 flex items-center gap-4 disabled:opacity-60"
          >
            <div className="w-14 h-14 rounded-xl bg-saffron-light flex items-center justify-center shrink-0">
              <Store className="w-7 h-7 text-saffron" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground text-base">
                I'm a Business Owner
              </p>
              <p className="text-muted-foreground text-sm mt-0.5">
                Post jobs & hire students
              </p>
            </div>
            {isLoggingIn && selectedRole === "employer" ? (
              <Loader2 className="w-5 h-5 animate-spin text-saffron" />
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
          <div className="rounded-xl bg-secondary p-4 text-sm text-muted-foreground text-center">
            🏪 Tea shops, bakeries, tuition centers, supermarkets & more — all
            in your neighborhood
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-4 px-5 text-center text-xs text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} Dharmapuri Jobs.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-teal transition-colors"
        >
          Built with ❤️ using caffeine.ai
        </a>
      </footer>
    </div>
  );
}
