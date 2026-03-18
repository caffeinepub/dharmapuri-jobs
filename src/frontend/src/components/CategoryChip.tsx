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
        "rounded-full font-semibold whitespace-nowrap transition-all duration-150 border",
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-xs",
        active
          ? "border-current opacity-100 scale-105 shadow-md ring-1 ring-current/30"
          : "border-transparent opacity-60 hover:opacity-85 hover:scale-[1.02]",
        chipClass,
      )}
    >
      {showEmoji && <span className="mr-1.5">{emoji}</span>}
      {category}
    </button>
  );
}
