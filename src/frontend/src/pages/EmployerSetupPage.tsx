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
import { useCreateEmployerProfile } from "@/hooks/useQueries";
import { CheckCircle2, Loader2, MapPin, Store } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const DHARMAPURI_LAT = 12.1211;
const DHARMAPURI_LNG = 78.1582;

const BUSINESS_TYPES = [
  "Tea Shop",
  "Bakery",
  "Tuition Center",
  "Supermarket",
  "Courier Office",
  "Clinic",
  "Others",
];

export default function EmployerSetupPage() {
  const { logout } = useAuth();
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");

  const createProfile = useCreateEmployerProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !businessType || !contactNumber.trim()) {
      toast.error("Business name, type, and contact are required");
      return;
    }

    try {
      await createProfile.mutateAsync({
        businessName: businessName.trim(),
        businessType,
        contactNumber: contactNumber.trim(),
        address: address.trim() || "Dharmapuri, Tamil Nadu",
        locationLat: DHARMAPURI_LAT,
        locationLng: DHARMAPURI_LNG,
        createdAt: BigInt(Date.now()) * BigInt(1_000_000),
      });
      toast.success("Business profile created! Start posting jobs 🎉");
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink to-pink-dark flex items-center justify-center border border-pink/30 shadow-pink-glow">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white/55 text-xs font-semibold uppercase tracking-wider">
                Step 1 of 1
              </p>
              <h1 className="font-display text-white text-xl font-bold tracking-tight">
                Business Profile
              </h1>
            </div>
          </div>
          <p className="text-white/60 text-sm">
            Tell students about your business
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
                htmlFor="bname"
                className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                Business Name *
              </Label>
              <Input
                id="bname"
                data-ocid="setup.business_name.input"
                placeholder="e.g. Sri Murugan Tea Stall"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                className="h-12 rounded-xl bg-muted border-border/60 text-foreground placeholder:text-muted-foreground focus-visible:ring-pink/40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="btype"
                className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                Business Type *
              </Label>
              <Select value={businessType} onValueChange={setBusinessType}>
                <SelectTrigger
                  id="btype"
                  data-ocid="setup.business_type.select"
                  className="h-12 rounded-xl bg-muted border-border/60 text-foreground focus:ring-pink/40"
                >
                  <SelectValue placeholder="Select business type" />
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
              <Label
                htmlFor="contact"
                className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                Contact Number *
              </Label>
              <Input
                id="contact"
                type="tel"
                data-ocid="setup.contact.input"
                placeholder="e.g. 9876543210"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
                className="h-12 rounded-xl bg-muted border-border/60 text-foreground placeholder:text-muted-foreground focus-visible:ring-pink/40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="address"
                className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                Address
              </Label>
              <Input
                id="address"
                data-ocid="setup.address.input"
                placeholder="e.g. 12, Anna Nagar, Dharmapuri"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-12 rounded-xl bg-muted border-border/60 text-foreground placeholder:text-muted-foreground focus-visible:ring-pink/40"
              />
            </div>

            {/* Location note */}
            <div className="flex items-start gap-2 rounded-xl bg-pink-light/50 p-3 border border-pink/20">
              <MapPin className="w-4 h-4 text-pink mt-0.5 shrink-0" />
              <div>
                <p className="text-pink text-xs font-semibold">
                  Using Dharmapuri, Tamil Nadu
                </p>
                <p className="text-pink/60 text-xs mt-0.5">
                  Students within 5–6 km will see your jobs
                </p>
              </div>
            </div>

            <Button
              type="submit"
              data-ocid="setup.submit_button"
              disabled={createProfile.isPending}
              className="h-14 rounded-2xl bg-gradient-to-r from-pink to-pink-dark text-white font-bold text-base btn-glow-pink transition-all mt-1 hover:opacity-90"
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
