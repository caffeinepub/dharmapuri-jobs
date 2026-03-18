import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useGetMyProfile, useUpdateEmployerProfile } from "@/hooks/useQueries";
import { Edit2, Loader2, MapPin, Save, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const BUSINESS_TYPES = [
  "Tea Shop",
  "Bakery",
  "Tuition Center",
  "Supermarket",
  "Courier Office",
  "Clinic",
  "Others",
];

export default function EmployerProfileTab() {
  const { logout, principal } = useAuth();
  const { data: profile, isLoading } = useGetMyProfile();
  const [editing, setEditing] = useState(false);
  const updateProfile = useUpdateEmployerProfile();

  const employer = profile?.__kind__ === "employer" ? profile.employer : null;

  const [businessName, setBusinessName] = useState(
    employer?.businessName ?? "",
  );
  const [businessType, setBusinessType] = useState(
    employer?.businessType ?? "",
  );
  const [contactNumber, setContactNumber] = useState(
    employer?.contactNumber ?? "",
  );
  const [address, setAddress] = useState(employer?.address ?? "");

  const startEdit = () => {
    setBusinessName(employer?.businessName ?? "");
    setBusinessType(employer?.businessType ?? "");
    setContactNumber(employer?.contactNumber ?? "");
    setAddress(employer?.address ?? "");
    setEditing(true);
  };

  const handleSave = async () => {
    if (!employer) return;
    try {
      await updateProfile.mutateAsync({
        ...employer,
        businessName: businessName.trim(),
        businessType,
        contactNumber: contactNumber.trim(),
        address: address.trim(),
      });
      toast.success("Profile updated!");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (isLoading || !employer) {
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
          <h2 className="text-base font-bold text-foreground">
            Edit Business Profile
          </h2>
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
            Business Name
          </Label>
          <Input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="h-11 rounded-xl bg-muted border-border/60 text-foreground focus-visible:ring-pink/40"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold text-foreground">
            Business Type
          </Label>
          <Select value={businessType} onValueChange={setBusinessType}>
            <SelectTrigger className="h-11 rounded-xl bg-muted border-border/60 text-foreground focus:ring-pink/40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {BUSINESS_TYPES.map((t) => (
                <SelectItem
                  key={t}
                  value={t}
                  className="text-foreground focus:bg-muted"
                >
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold text-foreground">
            Contact Number
          </Label>
          <Input
            type="tel"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            className="h-11 rounded-xl bg-muted border-border/60 text-foreground focus-visible:ring-pink/40"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold text-foreground">
            Address
          </Label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="h-11 rounded-xl bg-muted border-border/60 text-foreground focus-visible:ring-pink/40"
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={updateProfile.isPending}
          className="h-12 rounded-xl bg-gradient-to-r from-pink to-pink-dark text-white font-bold hover:opacity-90 btn-glow-pink"
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
      {/* Business header card */}
      <div className="bg-card rounded-2xl p-4 card-elevated border border-border/50 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink to-pink-dark flex items-center justify-center shrink-0 shadow-pink-glow">
          <span className="text-2xl font-bold text-white">
            {(employer.businessName || "?")[0]?.toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-foreground text-base leading-tight">
            {employer.businessName}
          </p>
          <p className="text-muted-foreground text-xs mt-0.5">
            {employer.businessType}
          </p>
          <p className="text-muted-foreground text-xs font-mono truncate mt-0.5">
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

      {/* Contact */}
      <InfoRow icon="📞" label="Contact" value={employer.contactNumber} />

      {/* Address */}
      <InfoRow
        icon="🏠"
        label="Address"
        value={employer.address || "Dharmapuri, Tamil Nadu"}
      />

      {/* Location */}
      <div className="flex items-start gap-2 rounded-xl bg-pink-light/50 p-3 border border-pink/20">
        <MapPin className="w-4 h-4 text-pink mt-0.5 shrink-0" />
        <div>
          <p className="text-pink text-xs font-semibold">Job Visibility Area</p>
          <p className="text-pink/60 text-xs">
            Students within 5–6 km of Dharmapuri will see your jobs
          </p>
        </div>
      </div>

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
}: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-card rounded-2xl p-4 card-elevated border border-border/50 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 text-base border border-border/50">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
