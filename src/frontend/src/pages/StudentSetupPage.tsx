import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useCreateStudentProfile } from "@/hooks/useQueries";
import { CheckCircle2, GraduationCap, Loader2, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const DHARMAPURI_LAT = 12.1211;
const DHARMAPURI_LNG = 78.1582;

export default function StudentSetupPage() {
  const { logout } = useAuth();
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [skillsRaw, setSkillsRaw] = useState("");
  const [availability, setAvailability] = useState("");
  const [bio, setBio] = useState("");

  const createProfile = useCreateStudentProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !college.trim()) {
      toast.error("Name and college are required");
      return;
    }
    const skills = skillsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      await createProfile.mutateAsync({
        name: name.trim(),
        college: college.trim(),
        skills,
        availability: availability.trim() || "Flexible",
        bio: bio.trim(),
        locationLat: DHARMAPURI_LAT,
        locationLng: DHARMAPURI_LNG,
        createdAt: BigInt(Date.now()) * BigInt(1_000_000),
      });
      toast.success("Profile created! Welcome to Dharmapuri Jobs 🎉");
    } catch {
      toast.error("Failed to create profile. Please try again.");
    }
  };

  return (
    <div className="app-shell flex flex-col min-h-dvh bg-background">
      {/* Header */}
      <div className="hero-gradient px-6 pt-10 pb-10">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet to-violet-dark flex items-center justify-center border border-violet/30 shadow-violet-glow">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white/55 text-xs font-semibold uppercase tracking-wider">
                Step 1 of 1
              </p>
              <h1 className="font-display text-white text-xl font-bold tracking-tight">
                Student Profile
              </h1>
            </div>
          </div>
          <p className="text-white/60 text-sm">
            Set up your profile to start applying for jobs
          </p>
        </motion.div>
      </div>

      {/* Form */}
      <div className="flex-1 bg-background px-4 py-5 overflow-y-auto pb-28">
        <motion.div
          className="bg-card rounded-3xl p-5 card-elevated border border-border/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="name"
                className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                Full Name *
              </Label>
              <Input
                id="name"
                data-ocid="setup.name.input"
                placeholder="e.g. Arjun Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12 rounded-xl bg-muted border-border/60 text-foreground placeholder:text-muted-foreground focus-visible:ring-violet/40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="college"
                className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                College / Institution *
              </Label>
              <Input
                id="college"
                data-ocid="setup.college.input"
                placeholder="e.g. Govt. Arts College, Dharmapuri"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                required
                className="h-12 rounded-xl bg-muted border-border/60 text-foreground placeholder:text-muted-foreground focus-visible:ring-violet/40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="skills"
                className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                Skills
              </Label>
              <Input
                id="skills"
                data-ocid="setup.skills.input"
                placeholder="e.g. Delivery, Customer Service, Data Entry"
                value={skillsRaw}
                onChange={(e) => setSkillsRaw(e.target.value)}
                className="h-12 rounded-xl bg-muted border-border/60 text-foreground placeholder:text-muted-foreground focus-visible:ring-violet/40"
              />
              <p className="text-xs text-muted-foreground">
                Separate skills with commas
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="availability"
                className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                Availability
              </Label>
              <Input
                id="availability"
                data-ocid="setup.availability.input"
                placeholder="e.g. Weekends, Evenings after 5 PM"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="h-12 rounded-xl bg-muted border-border/60 text-foreground placeholder:text-muted-foreground focus-visible:ring-violet/40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="bio"
                className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                About You
              </Label>
              <Textarea
                id="bio"
                data-ocid="setup.bio.textarea"
                placeholder="Tell employers a bit about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="rounded-xl resize-none bg-muted border-border/60 text-foreground placeholder:text-muted-foreground focus-visible:ring-violet/40"
              />
            </div>

            {/* Location note */}
            <div className="flex items-start gap-2 rounded-xl bg-violet-light/50 p-3 border border-violet/20">
              <MapPin className="w-4 h-4 text-violet mt-0.5 shrink-0" />
              <div>
                <p className="text-violet text-xs font-semibold">
                  Using Dharmapuri, Tamil Nadu
                </p>
                <p className="text-violet/60 text-xs mt-0.5">
                  Jobs near lat 12.1211°N, lng 78.1582°E will be shown
                </p>
              </div>
            </div>

            <Button
              type="submit"
              data-ocid="setup.submit_button"
              disabled={createProfile.isPending}
              className="h-14 rounded-2xl bg-gradient-to-r from-violet to-violet-dark text-white font-bold text-base btn-glow transition-all mt-1 hover:opacity-90"
            >
              {createProfile.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating Profile…
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Create Profile & Continue
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>

      <div className="px-5 pb-4 text-center">
        <button
          type="button"
          onClick={logout}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
