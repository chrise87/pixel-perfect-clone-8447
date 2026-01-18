import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/Avatar";
import { Project } from "@/types/project";
import { buildingTypes, stageFrameworks } from "@/data/constants";
import { Pin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  isPinned?: boolean;
  onTogglePin?: () => void;
  density?: 'compact' | 'comfortable';
}

const getBuildingIcon = (typeId: string) => {
  const type = buildingTypes.find(t => t.id === typeId);
  return type?.icon || '🏢';
};

const getStageInfo = (project: Project) => {
  const framework = stageFrameworks[project.stageFramework];
  const stage = framework.stages.find(s => s.id === project.currentStage);
  return { framework: framework.name, stage: stage?.name || 'Not set', stageId: project.currentStage };
};

export function ProjectCard({ project, onClick, isPinned, onTogglePin, density = 'comfortable' }: ProjectCardProps) {
  const stageInfo = getStageInfo(project);
  const isCompact = density === 'compact';
  
  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTogglePin?.();
  };

  if (isCompact) {
    return (
      <Card 
        onClick={onClick}
        className={cn(
          "overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary group p-3",
          isPinned && "ring-2 ring-primary/20"
        )}
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-xl flex-shrink-0">
            {project.image ? (
              <img src={project.image} alt={project.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              getBuildingIcon(project.buildingType)
            )}
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              {isPinned && <Pin className="h-3 w-3 text-primary flex-shrink-0" />}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {project.location}
            </p>
          </div>
          
          {/* Stage & Actions */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px]">
              Stage {stageInfo.stageId}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity",
                isPinned && "opacity-100 text-primary"
              )}
              onClick={handlePinClick}
            >
              <Pin className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card 
      onClick={onClick}
      className={cn(
        "overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary group relative",
        isPinned && "ring-2 ring-primary/20"
      )}
    >
      {/* Pin Button */}
      {onTogglePin && (
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "absolute top-2 right-2 h-7 w-7 p-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10",
            isPinned && "opacity-100 text-primary"
          )}
          onClick={handlePinClick}
        >
          <Pin className="h-3.5 w-3.5" />
        </Button>
      )}

      {/* Project Image/Icon */}
      <div className="h-28 bg-secondary flex items-center justify-center text-5xl relative">
        {project.image ? (
          <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
        ) : (
          getBuildingIcon(project.buildingType)
        )}
        {isPinned && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
            <Pin className="h-2.5 w-2.5" /> Pinned
          </div>
        )}
      </div>
      
      {/* Project Info */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
          {project.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          {project.location}
        </p>
        
        <div className="flex gap-2 flex-wrap mb-3">
          <Badge variant="secondary" className="bg-accent text-accent-foreground text-[11px]">
            {buildingTypes.find(t => t.id === project.buildingType)?.label}
          </Badge>
          <Badge variant="secondary" className="text-[11px]">
            Stage {stageInfo.stageId}
          </Badge>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {project.collaborators.slice(0, 3).map((collab, idx) => (
              <Avatar
                key={collab.id}
                initials={collab.initials}
                color={collab.color}
                size="sm"
                showBorder
                className={idx > 0 ? "-ml-2" : ""}
              />
            ))}
            {project.collaborators.length > 3 && (
              <div className="w-7 h-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-medium text-muted-foreground -ml-2">
                +{project.collaborators.length - 3}
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {project.gia}
          </span>
        </div>
      </div>
    </Card>
  );
}
