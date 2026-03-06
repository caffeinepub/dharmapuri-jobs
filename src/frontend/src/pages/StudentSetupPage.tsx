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
    <div className="app-shell flex flex-col min-h-dvh">
      {/* Header */}
      <div className="saffron-hero px-6 pt-10 pb-8">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/70 text-xs font-medium">Step 1 of 1</p>
              <h1 className="text-white text-xl font-bold">Student Profile</h1>
            </div>
          </div>
          <p className="text-white/75 text-sm">
            Set up your profile to start applying for jobs
          </p>
        </motion.div>
      </div>

      {/* Form */}
      <div className="flex-1 bg-background px-5 py-6 overflow-y-auto pb-28">
        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-sm font-semibold">
              Full Name *
            </Label>
            <Input
              id="name"
              placeholder="e.g. Arjun Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12 rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="college" className="text-sm font-semibold">
              College / Institution *
            </Label>
            <Input
              id="college"
              placeholder="e.g. Govt. Arts College, Dharmapuri"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              required
              className="h-12 rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="skills" className="text-sm font-semibold">
              Skills
            </Label>
            <Input
              id="skills"
              placeholder="e.g. Delivery, Customer Service, Data Entry"
              value={skillsRaw}
              onChange={(e) => setSkillsRaw(e.target.value)}
              className="h-12 rounded-xl"
            />
            <p className="text-xs text-muted-foreground">
              Separate skills with commas
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="availability" className="text-sm font-semibold">
              Availability
            </Label>
            <Input
              id="availability"
              placeholder="e.g. Weekends, Evenings after 5 PM"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="bio" className="text-sm font-semibold">
              About You
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell employers a bit about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="rounded-xl resize-none"
            />
          </div>

          {/* Location note */}
          <div className="flex items-start gap-2 rounded-xl bg-teal-light p-3">
            <MapPin className="w-4 h-4 text-teal mt-0.5 shrink-0" />
            <div>
              <p className="text-teal text-xs font-semibold">
                Using Dharmapuri, Tamil Nadu
              </p>
              <p className="text-teal/80 text-xs mt-0.5">
                Jobs near lat 12.1211°N, lng 78.1582°E will be shown
              </p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={createProfile.isPending}
            className="h-13 rounded-xl bg-teal text-white font-semibold text-base hover:bg-teal-dark transition-colors mt-2"
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
        </motion.form>
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
