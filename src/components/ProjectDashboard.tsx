import { ArrowLeft, Settings, Plus, UserPlus, Upload, MoreVertical, ChevronDown, ChevronUp, Sparkles, CheckCircle, FileText, FolderOpen, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar } from "@/components/Avatar";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { QuickAccessCard } from "@/components/QuickAccessCard";
import { Project } from "@/types/project";
import { buildingTypes, stageFrameworks, userRoles } from "@/data/constants";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ProjectDashboardProps {
  project: Project;
  onBack: () => void;
  onAddCollaborator: () => void;
  onAddTask: (type: 'personal' | 'global') => void;
  onAddBundle: () => void;
  onOpenSettings: () => void;
  onOpenDocuments: () => void;
  onOpenTasks: () => void;
  onOpenCopilot: () => void;
  onOpenComplianceReview: () => void;
  onOpenNewReport: () => void;
}

export function ProjectDashboard({ 
  project, 
  onBack, 
  onAddCollaborator, 
  onAddTask, 
  onAddBundle,
  onOpenSettings,
  onOpenDocuments,
  onOpenTasks,
  onOpenCopilot,
  onOpenComplianceReview,
  onOpenNewReport
}: ProjectDashboardProps) {
  const [showAllTeam, setShowAllTeam] = useState(false);
  const framework = stageFrameworks[project.stageFramework];
  const currentStageIndex = framework.stages.findIndex(s => s.id === project.currentStage);
  const stageName = framework.stages.find(s => s.id === project.currentStage)?.name || 'Not set';
  
  // Current user (owner) and other collaborators
  const currentUser = project.collaborators.find(c => c.isOwner);
  const otherCollaborators = project.collaborators.filter(c => !c.isOwner);

  return (
    <main className="flex-1 p-8 bg-background overflow-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </button>

      {/* Project Header with merged info + stages */}
      <Card className="p-6 mb-6">
        <div className="flex gap-6 mb-6">
          {/* Project Image */}
          <div className="w-28 h-24 bg-secondary rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
            {project.image ? (
              <img src={project.image} alt={project.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              buildingTypes.find(t => t.id === project.buildingType)?.icon || '🏢'
            )}
          </div>

          {/* Project Info */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h1 className="text-xl font-semibold text-foreground">{project.name}</h1>
                <p className="text-sm text-muted-foreground">{project.address || project.location}</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2" onClick={onOpenSettings}>
                <Settings className="h-4 w-4" />
                Project Settings
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Type: </span>
                <span className="font-medium">{buildingTypes.find(t => t.id === project.buildingType)?.label}</span>
              </div>
              <div>
                <span className="text-muted-foreground">GIA: </span>
                <span className="font-medium">{project.gia}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Completion: </span>
                <span className="font-medium">
                  {project.completionDate 
                    ? new Date(project.completionDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
                    : 'TBD'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Stage: </span>
                <span className="font-medium">{stageName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Stage Progress */}
        <div className="flex gap-1">
          {framework.stages.map((stage, idx) => {
            const isComplete = idx < currentStageIndex;
            const isActive = stage.id === project.currentStage;
            
            return (
              <div
                key={stage.id}
                className={cn(
                  "flex-1 py-1.5 px-2 rounded text-center text-xs transition-colors",
                  isComplete && "bg-success/10 text-success",
                  isActive && "bg-primary text-primary-foreground font-medium",
                  !isComplete && !isActive && "bg-secondary text-muted-foreground"
                )}
              >
                {project.stageFramework === 'riba' ? stage.id : stage.id.toUpperCase()}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Quick Access */}
      <div className="mb-6">
        <h2 className="text-base font-semibold mb-3">Quick Access</h2>
        <div className="grid grid-cols-3 gap-4">
          <QuickAccessCard
            icon={Sparkles}
            title="Copilot"
            description="AI assistant with project data"
            onClick={onOpenCopilot}
            variant="primary"
          />
          <QuickAccessCard
            icon={CheckCircle}
            title="Compliance Review"
            description="Check documents against standards"
            onClick={onOpenComplianceReview}
            variant="default"
          />
          <QuickAccessCard
            icon={FileText}
            title="New Report"
            description="Create a new document"
            onClick={onOpenNewReport}
            variant="default"
          />
        </div>
      </div>

      {/* Team Section - Compact */}
      <Card className="p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold">Team ({project.collaborators.length})</h2>
          <Button size="sm" variant="outline" onClick={onAddCollaborator} className="gap-1.5">
            <UserPlus className="h-4 w-4" />
            Add
          </Button>
        </div>

        {/* Current User Row */}
        {currentUser && (
          <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg mb-2">
            <div className="flex items-center gap-3">
              <Avatar initials={currentUser.initials} color={currentUser.color} size="md" />
              <div>
                <span className="text-sm font-medium">{currentUser.name}</span>
                <Badge variant="secondary" className="ml-2 text-[10px] bg-warning/10 text-warning">Owner</Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                {userRoles.find(r => r.id === currentUser.role)?.label}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Role Filter</span>
                <Switch checked={currentUser.roleFilterEnabled} />
              </div>
            </div>
          </div>
        )}

        {/* Other Collaborators */}
        {otherCollaborators.length > 0 && (
          <button
            onClick={() => setShowAllTeam(!showAllTeam)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <span>{otherCollaborators.length} other team members</span>
            {showAllTeam ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        )}

        {showAllTeam && (
          <div className="space-y-2 mt-2">
            {otherCollaborators.map(collab => (
              <div 
                key={collab.id} 
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border border-border",
                  collab.status === 'inactive' && "opacity-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <Avatar initials={collab.initials} color={collab.color} size="sm" />
                  <span className="text-sm">{collab.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {userRoles.find(r => r.id === collab.role)?.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Documents & Bundles Row */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold">Project Documents</h2>
            <Button size="sm" variant="ghost" onClick={onOpenDocuments} className="gap-1.5 text-primary">
              <FolderOpen className="h-4 w-4" />
              View All
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {project.projectDocuments.slice(0, 3).map(doc => (
              <div key={doc.id} className="p-2.5 border border-border rounded-lg flex justify-between items-center">
                <div className="text-sm">{doc.name}</div>
                <StatusBadge status={doc.status} />
              </div>
            ))}
            {project.projectDocuments.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No documents yet</p>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold">Library Bundles</h2>
            <Button size="sm" onClick={onAddBundle} className="gap-1.5">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {project.appliedBundles.map(bundle => (
              <div key={bundle.id} className="p-2.5 border border-border rounded-lg flex justify-between items-center">
                <div className="text-sm">{bundle.name}</div>
                <Badge variant="secondary" className="text-[10px] bg-success/10 text-success">Applied</Badge>
              </div>
            ))}
            {project.appliedBundles.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No bundles applied</p>
            )}
          </div>
        </Card>
      </div>

      {/* Tasks Row */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold">My To-Do</h2>
            <Button size="sm" variant="ghost" onClick={onOpenTasks} className="gap-1.5 text-primary">
              <ListTodo className="h-4 w-4" />
              View All
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {project.personalTodos.filter(t => t.status !== 'completed').slice(0, 3).map(todo => (
              <div key={todo.id} className="p-2.5 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <PriorityBadge priority={todo.priority} />
                </div>
                <div className="text-sm">{todo.text}</div>
                <div className="text-xs text-muted-foreground mt-1">Due: {todo.due}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => onAddTask('personal')}
            className="w-full mt-3 p-2 bg-transparent border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary"
          >
            + Add Task
          </button>
        </Card>

        <Card className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold">Project To-Do</h2>
          </div>
          <div className="flex flex-col gap-2">
            {project.globalTodos.filter(t => t.status !== 'completed').slice(0, 3).map(todo => (
              <div key={todo.id} className="p-2.5 border border-border rounded-lg">
                <div className="text-sm">{todo.text}</div>
                <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                  <span>👤 {todo.assignee}</span>
                  <span>Due: {todo.due}</span>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => onAddTask('global')}
            className="w-full mt-3 p-2 bg-transparent border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary"
          >
            + Add Task
          </button>
        </Card>
      </div>
    </main>
  );
}
