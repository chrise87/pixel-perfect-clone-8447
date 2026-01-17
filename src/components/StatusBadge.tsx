import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  'Approved': 'bg-success/10 text-success',
  'Current': 'bg-accent text-accent-foreground',
  'In Review': 'bg-warning/10 text-warning',
  'Draft': 'bg-secondary text-secondary-foreground',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "text-xs px-2.5 py-1 rounded-full font-medium",
        statusStyles[status] || 'bg-secondary text-secondary-foreground',
        className
      )}
    >
      {status}
    </span>
  );
}
