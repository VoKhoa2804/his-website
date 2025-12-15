import { cn } from "@/shared/utils/cn"
import { LucideIcon } from "lucide-react";

interface SectionTitleWithIconProps {
  label: string;
  icon: LucideIcon;        // icon truyền vào
  dotColor?: string;       // màu chấm
  iconColor?: string;      // màu icon
  className?: string;
}

export function SectionTitle({
  label,
  icon: Icon,
  dotColor = "bg-blue-600",
  iconColor = "text-blue-600",
  className,
}: SectionTitleWithIconProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 py-1 select-none",
        className
      )}
    >
      {/* Dot marker */}
      {/* <span className={cn("w-1.5 h-1.5 rounded-full", dotColor)} /> */}

      {/* Icon */}
      <Icon className={cn("w-4.5 h-4.5", iconColor)} />

      {/* Label */}
      <span className="text-lg font-semibold text-gray-700 tracking-wide">
        {label}
      </span>

      {/* Line filler (optional, cho đẹp) */}
      <div className="flex-1 border-t border-gray-200 ml-1" />
    </div>
  );
}
