import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/Avatar";
import { Project } from "@/types/project";
import { buildingTypes, stageFrameworks } from "@/data/constants";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
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

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const stageInfo = getStageInfo(project);
  
  return (
    <Card 
      onClick={onClick}
      className="overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary group"
    >
      {/* Project Image/Icon */}
      <div className="h-28 bg-secondary flex items-center justify-center text-5xl">
        {project.image ? (
          <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
        ) : (
          getBuildingIcon(project.buildingType)
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
