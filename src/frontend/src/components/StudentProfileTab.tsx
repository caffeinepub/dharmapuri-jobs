import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useGetMyProfile, useUpdateStudentProfile } from "@/hooks/useQueries";
import { Edit2, GraduationCap, Loader2, MapPin, Save, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function StudentProfileTab() {
  const { logout, principal } = useAuth();
  const { data: profile, isLoading } = useGetMyProfile();
  const [editing, setEditing] = useState(false);
  const updateProfile = useUpdateStudentProfile();

  const student = profile?.__kind__ === "student" ? profile.student : null;

  const [name, setName] = useState(student?.name ?? "");
  const [college, setCollege] = useState(student?.college ?? "");
  const [skillsRaw, setSkillsRaw] = useState(student?.skills.join(", ") ?? "");
  const [availability, setAvailability] = useState(student?.availability ?? "");
  const [bio, setBio] = useState(student?.bio ?? "");

  const startEdit = () => {
    setName(student?.name ?? "");
    setCollege(student?.college ?? "");
    setSkillsRaw(student?.skills.join(", ") ?? "");
    setAvailability(student?.availability ?? "");
    setBio(student?.bio ?? "");
    setEditing(true);
  };

  const handleSave = async () => {
    if (!student) return;
    const skills = skillsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      await updateProfile.mutateAsync({
        ...student,
        name: name.trim(),
        college: college.trim(),
        skills,
        availability: availability.trim(),
        bio: bio.trim(),
      });
      toast.success("Profile updated!");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (isLoading || !student) {
    return (
      <div className="space-y-3 pt-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-12 rounded-xl" />
        ))}
      </div>
    );
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-4 pb-8">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-bold text-foreground">Edit Profile</h2>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold text-foreground">
            Full Name
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 rounded-xl bg-muted border-border/60 text-foreground focus-visible:ring-violet/40"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold text-foreground">
            College
          </Label>
          <Input
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="h-11 rounded-xl bg-muted border-border/60 text-foreground focus-visible:ring-violet/40"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold text-foreground">
            Skills (comma separated)
          </Label>
          <Input
            value={skillsRaw}
            onChange={(e) => setSkillsRaw(e.target.value)}
            className="h-11 rounded-xl bg-muted border-border/60 text-foreground focus-visible:ring-violet/40"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold text-foreground">
            Availability
          </Label>
          <Input
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="h-11 rounded-xl bg-muted border-border/60 text-foreground focus-visible:ring-violet/40"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold text-foreground">
            About You
          </Label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="rounded-xl resize-none bg-muted border-border/60 text-foreground focus-visible:ring-violet/40"
          />
        </div>
        <Button
          onClick={handleSave}
          disabled={updateProfile.isPending}
          className="h-12 rounded-xl bg-gradient-to-r from-violet to-violet-dark text-white font-bold hover:opacity-90 btn-glow"
        >
          {updateProfile.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving…
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* Avatar + name */}
      <div className="bg-card rounded-2xl p-4 card-elevated border border-border/50 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet to-violet-dark flex items-center justify-center shrink-0 shadow-violet-glow">
          <span className="text-2xl font-bold text-white">
            {(student.name || "?")[0]?.toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-foreground text-base">{student.name}</p>
          <p className="text-muted-foreground text-xs truncate">
            {principal?.slice(0, 20)}…
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={startEdit}
          className="rounded-xl shrink-0 border-border/60 text-foreground hover:bg-muted"
        >
          <Edit2 className="w-4 h-4 mr-1" /> Edit
        </Button>
      </div>

      {/* College */}
      <InfoRow
        icon={<GraduationCap className="w-4 h-4 text-violet" />}
        label="College"
        value={student.college}
      />

      {/* Skills */}
      <div className="bg-card rounded-2xl p-4 card-elevated border border-border/50">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Skills
        </p>
        <div className="flex flex-wrap gap-2">
          {student.skills.length > 0 ? (
            student.skills.map((skill) => (
              <span
                key={skill}
                className="bg-violet-light text-violet text-xs px-2.5 py-1 rounded-full font-medium border border-violet/20"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No skills added</p>
          )}
        </div>
      </div>

      {/* Availability */}
      <InfoRow
        icon={<span className="text-sm">⏰</span>}
        label="Availability"
        value={student.availability || "Flexible"}
      />

      {/* Location */}
      <div className="flex items-start gap-2 rounded-xl bg-violet-light/50 p-3 border border-violet/20">
        <MapPin className="w-4 h-4 text-violet mt-0.5 shrink-0" />
        <div>
          <p className="text-violet text-xs font-semibold">Location</p>
          <p className="text-violet/60 text-xs">
            Dharmapuri, Tamil Nadu (12.12°N, 78.16°E)
          </p>
        </div>
      </div>

      {/* Bio */}
      {student.bio && (
        <div className="bg-card rounded-2xl p-4 card-elevated border border-border/50">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            About
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            {student.bio}
          </p>
        </div>
      )}

      {/* Logout */}
      <button
        type="button"
        onClick={logout}
        className="mt-2 text-center text-sm text-destructive hover:underline"
      >
        Sign out
      </button>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card rounded-2xl p-4 card-elevated border border-border/50 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 border border-border/50">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
