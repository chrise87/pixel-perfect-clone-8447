import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAccessCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'accent';
}

export function QuickAccessCard({ icon: Icon, title, description, onClick, variant = 'default' }: QuickAccessCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-5 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-lg group",
        variant === 'default' && "border-border bg-card hover:border-primary/50",
        variant === 'primary' && "border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary",
        variant === 'accent' && "border-accent/30 bg-accent/5 hover:bg-accent/10 hover:border-accent"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors",
        variant === 'default' && "bg-secondary text-foreground group-hover:bg-primary/10 group-hover:text-primary",
        variant === 'primary' && "bg-primary/10 text-primary group-hover:bg-primary/20",
        variant === 'accent' && "bg-accent/10 text-accent-foreground group-hover:bg-accent/20"
      )}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </button>
  );
}
