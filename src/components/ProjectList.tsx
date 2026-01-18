/**
 * ProjectList Component
 * 
 * DEVELOPER NOTES FOR INTEGRATION:
 * - Pinned projects are stored via useUserPreferences hook
 * - View density toggle persists user preference
 * - Replace localStorage with API calls for production
 */

import { Plus, Search, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectCard } from "./ProjectCard";
import { ViewDensityToggle } from "./ViewDensityToggle";
import { Project } from "@/types/project";
import { buildingTypes } from "@/data/constants";
import { ViewDensity } from "@/hooks/useUserPreferences";

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onNewProject: () => void;
  pinnedProjects: number[];
  onTogglePin: (projectId: number) => void;
  viewDensity: ViewDensity;
  onDensityChange: (density: ViewDensity) => void;
}

export function ProjectList({ 
  projects, 
  onSelectProject, 
  onNewProject,
  pinnedProjects,
  onTogglePin,
  viewDensity,
  onDensityChange
}: ProjectListProps) {
  // Sort projects: pinned first, then by name
  const sortedProjects = [...projects].sort((a, b) => {
    const aPinned = pinnedProjects.includes(a.id);
    const bPinned = pinnedProjects.includes(b.id);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return a.name.localeCompare(b.name);
  });

  const pinnedCount = pinnedProjects.length;

  return (
    <main className="flex-1 p-4 md:p-8 bg-background overflow-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-foreground mb-1">
            Projects
          </h1>
          <p className="text-sm text-muted-foreground hidden sm:block">
            Manage your AEC projects and collaborate with your team
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
          <ViewDensityToggle 
            density={viewDensity} 
            onDensityChange={onDensityChange} 
          />
          <Button onClick={onNewProject} className="gap-2 flex-1 sm:flex-none">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Project</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search projects..."
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all-types">
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-types">All Types</SelectItem>
              {buildingTypes.map(type => (
                <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue="all-stages">
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-stages">All Stages</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="construction">Construction</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pinned Section */}
      {pinnedCount > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Pin className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-medium text-muted-foreground">
              Pinned Projects ({pinnedCount})
            </h2>
          </div>
        </div>
      )}

      {/* Projects Grid/List */}
      <div className={
        viewDensity === 'compact' 
          ? "flex flex-col gap-2" 
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      }>
        {sortedProjects.map(project => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onClick={() => onSelectProject(project)}
            isPinned={pinnedProjects.includes(project.id)}
            onTogglePin={() => onTogglePin(project.id)}
            density={viewDensity}
          />
        ))}
      </div>
    </main>
  );
}
