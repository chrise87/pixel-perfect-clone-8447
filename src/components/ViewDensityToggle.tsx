/**
 * ViewDensityToggle Component
 * 
 * DEVELOPER NOTES FOR INTEGRATION:
 * - Toggle between compact and comfortable view densities
 * - State is persisted via useUserPreferences
 */

import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ViewDensity } from "@/hooks/useUserPreferences";

interface ViewDensityToggleProps {
  density: ViewDensity;
  onDensityChange: (density: ViewDensity) => void;
  className?: string;
}

export function ViewDensityToggle({ density, onDensityChange, className }: ViewDensityToggleProps) {
  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-1 bg-secondary rounded-lg p-1", className)}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 w-7 p-0",
                density === 'comfortable' && "bg-background shadow-sm"
              )}
              onClick={() => onDensityChange('comfortable')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Comfortable view</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 w-7 p-0",
                density === 'compact' && "bg-background shadow-sm"
              )}
              onClick={() => onDensityChange('compact')}
            >
              <List className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Compact view</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
