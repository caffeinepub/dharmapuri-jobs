import { motion } from "motion/react";

export default function LoadingScreen() {
  return (
    <div className="app-shell flex items-center justify-center min-h-dvh hero-gradient">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, type: "spring", bounce: 0.35 }}
          className="relative"
        >
          {/* Pulsing violet glow ring */}
          <div className="absolute inset-[-8px] rounded-2xl violet-pulse-ring opacity-80" />
          <div className="absolute inset-0 rounded-2xl ring-2 ring-violet/40 animate-pulse" />
          <img
            src="/assets/generated/dj-logo-transparent.dim_120x120.png"
            alt="Dharmapuri Jobs"
            className="w-20 h-20 rounded-2xl relative z-10 shadow-violet-glow"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col items-center gap-3"
        >
          <h1 className="font-display text-xl font-bold text-white tracking-tight">
            Dharmapuri <span className="gradient-text-saffron">Jobs</span>
          </h1>
          <div className="dot-pulse flex items-center gap-2">
            <span />
            <span />
            <span />
          </div>
          <p className="text-white/50 text-sm font-medium">
            Finding jobs near you…
          </p>
        </motion.div>
      </div>
    </div>
  );
}
