import { Home, MessageSquare, Library, FolderKanban, Settings2, UserCog, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'copilot', label: 'Copilot', icon: MessageSquare },
  { id: 'libraries', label: 'Libraries', icon: Library },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'controls', label: 'Controls', icon: Settings2 },
  { id: 'admin', label: 'Admin', icon: UserCog },
];

export function AppSidebar({ activeNav, onNavChange, isOpen, onClose }: AppSidebarProps) {
  const handleNavClick = (nav: string) => {
    onNavChange(nav);
    onClose?.();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={cn(
        "bg-sidebar border-r border-sidebar-border flex flex-col py-3 z-50",
        // Desktop: always visible
        "hidden md:flex md:w-[180px] md:min-h-[calc(100vh-56px)] md:relative",
        // Mobile: slide-in drawer
        isOpen && "fixed inset-y-0 left-0 w-[240px] flex md:hidden animate-slide-in-left"
      )}>
        {/* Mobile close button */}
        <div className="flex items-center justify-between px-3 mb-4 md:hidden">
          <span className="text-lg font-semibold">Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-col gap-0.5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left w-full",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex-1" />

        <nav className="px-2">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 w-full">
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </nav>
      </aside>
    </>
  );
}
