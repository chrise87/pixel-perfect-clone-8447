import { Search, Bell, HelpCircle, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const NomonLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-foreground">
    <path 
      d="M12 2L12 22M2 12L22 12M4.93 4.93L19.07 19.07M19.07 4.93L4.93 19.07" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
    />
  </svg>
);

interface AppHeaderProps {
  onMenuToggle?: () => void;
}

export function AppHeader({ onMenuToggle }: AppHeaderProps) {
  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-3 md:px-4">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 md:hidden"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <NomonLogo />
          <span className="text-lg font-semibold text-foreground">Nomon</span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Search - hidden on mobile, visible on tablet+ */}
        <div className="relative w-48 md:w-64 hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search..." 
            className="pl-9 h-9 bg-secondary border-0"
          />
        </div>
        
        {/* Search icon on mobile */}
        <Button variant="ghost" size="icon" className="h-9 w-9 sm:hidden">
          <Search className="h-4 w-4 text-muted-foreground" />
        </Button>
        
        <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:flex">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Bell className="h-4 w-4 text-muted-foreground" />
        </Button>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-primary-foreground">
          CE
        </div>
      </div>
    </header>
  );
}
