import { cn } from "@/lib/utils";

const CHIP_MAP: Record<string, string> = {
  "Tea Shop": "chip-tea",
  Bakery: "chip-bakery",
  "Tuition Center": "chip-tuition",
  Supermarket: "chip-supermarket",
  "Courier Office": "chip-courier",
  Clinic: "chip-clinic",
  Others: "chip-others",
  All: "chip-all",
};

const EMOJI_MAP: Record<string, string> = {
  "Tea Shop": "☕",
  Bakery: "🥐",
  "Tuition Center": "📚",
  Supermarket: "🛒",
  "Courier Office": "📦",
  Clinic: "🏥",
  Others: "💼",
  All: "🔍",
};

interface Props {
  category: string;
  active?: boolean;
  onClick?: () => void;
  size?: "sm" | "md";
  showEmoji?: boolean;
}

export default function CategoryChip({
  category,
  active,
  onClick,
  size = "md",
  showEmoji = true,
}: Props) {
  const chipClass = CHIP_MAP[category] ?? "chip-others";
  const emoji = EMOJI_MAP[category] ?? "💼";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full font-medium whitespace-nowrap transition-all duration-150 border-2",
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-xs",
        active
          ? "border-current opacity-100 scale-100 shadow-sm"
          : "border-transparent opacity-75 hover:opacity-90",
        chipClass,
      )}
    >
      {showEmoji && <span className="mr-1">{emoji}</span>}
      {category}
    </button>
  );
}
