/**
 * CollapsibleSection Component
 * 
 * DEVELOPER NOTES FOR INTEGRATION:
 * - Uses useUserPreferences hook for persistence
 * - Section state is saved per user
 */

import { ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  id: string;
  title: string;
  count?: number;
  isCollapsed: boolean;
  onToggle: () => void;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
  density?: 'compact' | 'comfortable';
}

export function CollapsibleSection({
  id,
  title,
  count,
  isCollapsed,
  onToggle,
  children,
  actions,
  className,
  density = 'comfortable'
}: CollapsibleSectionProps) {
  const padding = density === 'compact' ? 'p-3' : 'p-5';
  const titleSize = density === 'compact' ? 'text-sm' : 'text-base';
  const marginBottom = density === 'compact' ? 'mb-2' : 'mb-4';

  return (
    <Card className={cn(padding, className)}>
      <div className={cn("flex justify-between items-center", !isCollapsed && marginBottom)}>
        <button
          onClick={onToggle}
          className="flex items-center gap-2 hover:text-primary transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
          <h2 className={cn(titleSize, "font-semibold")}>
            {title}
            {count !== undefined && (
              <span className="text-muted-foreground font-normal ml-1">({count})</span>
            )}
          </h2>
        </button>
        {actions && !isCollapsed && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
      
      {!isCollapsed && (
        <div className="animate-fade-in">
          {children}
        </div>
      )}
    </Card>
  );
}
