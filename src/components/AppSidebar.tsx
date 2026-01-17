import { Home, MessageSquare, Library, FolderKanban, Settings2, UserCog, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'copilot', label: 'Copilot', icon: MessageSquare },
  { id: 'libraries', label: 'Libraries', icon: Library },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'controls', label: 'Controls', icon: Settings2 },
  { id: 'admin', label: 'Admin', icon: UserCog },
];

export function AppSidebar({ activeNav, onNavChange }: AppSidebarProps) {
  return (
    <aside className="w-[180px] bg-sidebar min-h-[calc(100vh-56px)] border-r border-sidebar-border flex flex-col py-3">
      <Button variant="ghost" size="icon" className="h-10 w-10 mx-3 mb-2">
        <Menu className="h-5 w-5 text-muted-foreground" />
      </Button>

      <nav className="flex flex-col gap-0.5 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavChange(item.id)}
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
  );
}
