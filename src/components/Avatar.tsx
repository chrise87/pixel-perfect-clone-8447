import { cn } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  color: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showBorder?: boolean;
}

const sizes = {
  sm: "w-7 h-7 text-[10px]",
  md: "w-9 h-9 text-xs",
  lg: "w-11 h-11 text-sm",
};

export function Avatar({ initials, color, size = "md", className, showBorder = false }: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-medium text-primary-foreground",
        sizes[size],
        showBorder && "border-2 border-background",
        className
      )}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}
