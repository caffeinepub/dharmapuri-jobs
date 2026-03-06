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
    <div className="app-shell flex flex-col min-h-dvh">
      {/* Header */}
      <div className="saffron-hero px-6 pt-10 pb-8">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/70 text-xs font-medium">Step 1 of 1</p>
              <h1 className="text-white text-xl font-bold">Business Profile</h1>
            </div>
          </div>
          <p className="text-white/75 text-sm">
            Tell students about your business
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
            <Label htmlFor="bname" className="text-sm font-semibold">
              Business Name *
            </Label>
            <Input
              id="bname"
              placeholder="e.g. Sri Murugan Tea Stall"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              className="h-12 rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="btype" className="text-sm font-semibold">
              Business Type *
            </Label>
            <Select value={businessType} onValueChange={setBusinessType}>
              <SelectTrigger id="btype" className="h-12 rounded-xl">
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="contact" className="text-sm font-semibold">
              Contact Number *
            </Label>
            <Input
              id="contact"
              type="tel"
              placeholder="e.g. 9876543210"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
              className="h-12 rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="address" className="text-sm font-semibold">
              Address
            </Label>
            <Input
              id="address"
              placeholder="e.g. 12, Anna Nagar, Dharmapuri"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          {/* Location note */}
          <div className="flex items-start gap-2 rounded-xl bg-saffron-light p-3">
            <MapPin className="w-4 h-4 text-saffron-dark mt-0.5 shrink-0" />
            <div>
              <p className="text-saffron-dark text-xs font-semibold">
                Using Dharmapuri, Tamil Nadu
              </p>
              <p className="text-saffron-dark/80 text-xs mt-0.5">
                Students within 5–6 km will see your jobs
              </p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={createProfile.isPending}
            className="h-13 rounded-xl bg-saffron text-white font-semibold text-base hover:bg-saffron-dark transition-colors mt-2"
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
