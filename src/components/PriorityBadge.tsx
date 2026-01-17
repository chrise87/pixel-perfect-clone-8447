import { cn } from "@/lib/utils";

interface PriorityBadgeProps {
  priority: string;
  className?: string;
}

const priorityStyles: Record<string, string> = {
  'high': 'bg-destructive/10 text-destructive',
  'medium': 'bg-warning/10 text-warning',
  'low': 'bg-secondary text-muted-foreground',
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <span
      className={cn(
        "text-[10px] px-2 py-0.5 rounded font-medium uppercase",
        priorityStyles[priority] || 'bg-secondary text-muted-foreground',
        className
      )}
    >
      {priority}
    </span>
  );
}
