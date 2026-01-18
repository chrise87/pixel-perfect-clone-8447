/**
 * ProjectDashboard Component
 * 
 * DEVELOPER NOTES FOR INTEGRATION:
 * - This is the main project dashboard showing overview of all project data
 * - Props to wire up:
 *   - project: Project object from your backend
 *   - onBack/onOpen*: navigation callbacks
 *   - onAddCollaborator/onAddTask/onAddBundle: modal triggers
 * 
 * - Backend connections needed:
 *   - Fetch project data from your API
 *   - Wire up stage progress to actual project stages
 *   - Connect team management to user service
 * 
 * - UI Features:
 *   - Collapsible sections (persisted via useUserPreferences)
 *   - View density toggle (compact/comfortable)
 *   - Project To-Do has "View All" button
 *   - Library Bundles renamed to Library Documents
 */

import { ArrowLeft, Settings, Plus, UserPlus, ChevronDown, ChevronUp, Sparkles, CheckCircle, FileText, FolderOpen, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar } from "@/components/Avatar";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { QuickAccessCard } from "@/components/QuickAccessCard";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { ViewDensityToggle } from "@/components/ViewDensityToggle";
import { Project } from "@/types/project";
import { buildingTypes, stageFrameworks, userRoles } from "@/data/constants";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ViewDensity } from "@/hooks/useUserPreferences";

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
  viewDensity: ViewDensity;
  onDensityChange: (density: ViewDensity) => void;
  isSectionCollapsed: (sectionId: string) => boolean;
  onToggleSection: (sectionId: string) => void;
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
  onOpenNewReport,
  viewDensity,
  onDensityChange,
  isSectionCollapsed,
  onToggleSection
}: ProjectDashboardProps) {
  const [showAllTeam, setShowAllTeam] = useState(false);
  const framework = stageFrameworks[project.stageFramework];
  const currentStageIndex = framework.stages.findIndex(s => s.id === project.currentStage);
  const stageName = framework.stages.find(s => s.id === project.currentStage)?.name || 'Not set';
  
  const currentUser = project.collaborators.find(c => c.isOwner);
  const otherCollaborators = project.collaborators.filter(c => !c.isOwner);
  
  const isCompact = viewDensity === 'compact';
  const gridGap = isCompact ? 'gap-4' : 'gap-6';

  return (
    <main className={cn("flex-1 bg-background overflow-auto", isCompact ? "p-4 md:p-6" : "p-4 md:p-8")}>
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Projects</span>
          <span className="sm:hidden">Back</span>
        </button>
        <ViewDensityToggle density={viewDensity} onDensityChange={onDensityChange} />
      </div>

      {/* Project Header */}
      <Card className={cn("mb-4 md:mb-6", isCompact ? "p-3 md:p-4" : "p-4 md:p-6")}>
        <div className={cn("flex flex-col sm:flex-row mb-4 md:mb-6", isCompact ? "gap-3 md:gap-4" : "gap-4 md:gap-6")}>
          <div className={cn(
            "bg-secondary rounded-lg flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0",
            isCompact ? "w-16 h-14 md:w-20 md:h-16 text-2xl md:text-3xl" : "w-20 h-16 md:w-28 md:h-24 text-3xl md:text-4xl"
          )}>
            {project.image ? (
              <img src={project.image} alt={project.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              buildingTypes.find(t => t.id === project.buildingType)?.icon || '🏢'
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-2 mb-2">
              <div>
                <h1 className={cn("font-semibold text-foreground", isCompact ? "text-base md:text-lg" : "text-lg md:text-xl")}>{project.name}</h1>
                <p className="text-xs md:text-sm text-muted-foreground">{project.address || project.location}</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2" onClick={onOpenSettings}>
                <Settings className="h-4 w-4" />
                <span className="hidden md:inline">{!isCompact && "Project Settings"}</span>
              </Button>
            </div>

            <div className={cn("grid gap-2 md:gap-4 text-xs md:text-sm", isCompact ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4")}>
              <div>
                <span className="text-muted-foreground">Type: </span>
                <span className="font-medium">{buildingTypes.find(t => t.id === project.buildingType)?.label}</span>
              </div>
              <div>
                <span className="text-muted-foreground">GIA: </span>
                <span className="font-medium">{project.gia}</span>
              </div>
              {!isCompact && (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-1">
          {framework.stages.map((stage, idx) => {
            const isComplete = idx < currentStageIndex;
            const isActive = stage.id === project.currentStage;
            
            return (
              <div
                key={stage.id}
                className={cn(
                  "flex-1 rounded text-center text-xs transition-colors",
                  isCompact ? "py-1 px-1" : "py-1.5 px-2",
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
      <CollapsibleSection
        id="quick-access"
        title="Quick Access"
        isCollapsed={isSectionCollapsed('quick-access')}
        onToggle={() => onToggleSection('quick-access')}
        density={viewDensity}
        className="mb-4 md:mb-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <QuickAccessCard
            icon={Sparkles}
            title="Copilot"
            description={isCompact ? "" : "AI assistant with project data"}
            onClick={onOpenCopilot}
            variant="primary"
          />
          <QuickAccessCard
            icon={CheckCircle}
            title="Compliance Review"
            description={isCompact ? "" : "Check documents against standards"}
            onClick={onOpenComplianceReview}
            variant="default"
          />
          <QuickAccessCard
            icon={FileText}
            title="New Report"
            description={isCompact ? "" : "Create a new document"}
            onClick={onOpenNewReport}
            variant="default"
          />
        </div>
      </CollapsibleSection>

      {/* Team Section */}
      <CollapsibleSection
        id="team"
        title="Team"
        count={project.collaborators.length}
        isCollapsed={isSectionCollapsed('team')}
        onToggle={() => onToggleSection('team')}
        density={viewDensity}
        className="mb-6"
        actions={
          <Button size="sm" variant="outline" onClick={onAddCollaborator} className="gap-1.5">
            <UserPlus className="h-4 w-4" />
            Add
          </Button>
        }
      >
        {currentUser && (
          <div className={cn(
            "flex items-center justify-between bg-secondary/50 rounded-lg mb-2",
            isCompact ? "p-2" : "p-3"
          )}>
            <div className="flex items-center gap-3">
              <Avatar initials={currentUser.initials} color={currentUser.color} size={isCompact ? "sm" : "md"} />
              <div>
                <span className="text-sm font-medium">{currentUser.name}</span>
                <Badge variant="secondary" className="ml-2 text-[10px] bg-warning/10 text-warning">Owner</Badge>
              </div>
            </div>
            {!isCompact && (
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">
                  {userRoles.find(r => r.id === currentUser.role)?.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Role Filter</span>
                  <Switch checked={currentUser.roleFilterEnabled} />
                </div>
              </div>
            )}
          </div>
        )}

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
                  "flex items-center justify-between rounded-lg border border-border",
                  isCompact ? "p-2" : "p-3",
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
      </CollapsibleSection>

      {/* Documents & Bundles Row */}
      <div className={cn("grid grid-cols-1 md:grid-cols-2 mb-4 md:mb-6", gridGap)}>
        <CollapsibleSection
          id="project-documents"
          title="Project Documents"
          isCollapsed={isSectionCollapsed('project-documents')}
          onToggle={() => onToggleSection('project-documents')}
          density={viewDensity}
          actions={
            <Button size="sm" variant="ghost" onClick={onOpenDocuments} className="gap-1.5 text-primary">
              <FolderOpen className="h-4 w-4" />
              View All
            </Button>
          }
        >
          <div className="flex flex-col gap-2">
            {project.projectDocuments.slice(0, 3).map(doc => (
              <div key={doc.id} className={cn(
                "border border-border rounded-lg flex justify-between items-center",
                isCompact ? "p-2" : "p-2.5"
              )}>
                <div className="text-sm">{doc.name}</div>
                <StatusBadge status={doc.status} />
              </div>
            ))}
            {project.projectDocuments.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No documents yet</p>
            )}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          id="library-documents"
          title="Library Documents"
          isCollapsed={isSectionCollapsed('library-documents')}
          onToggle={() => onToggleSection('library-documents')}
          density={viewDensity}
          actions={
            <Button size="sm" onClick={onAddBundle} className="gap-1.5">
              <Plus className="h-4 w-4" />
              Manage
            </Button>
          }
        >
          <div className="flex flex-col gap-2">
            {project.appliedBundles.map(bundle => (
              <div key={bundle.id} className={cn(
                "border border-border rounded-lg flex justify-between items-center",
                isCompact ? "p-2" : "p-2.5"
              )}>
                <div className="text-sm">{bundle.name}</div>
                <Badge variant="secondary" className="text-[10px] bg-success/10 text-success">Applied</Badge>
              </div>
            ))}
            {project.appliedBundles.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No documents applied</p>
            )}
          </div>
        </CollapsibleSection>
      </div>

      {/* Tasks Row */}
      <div className={cn("grid grid-cols-1 md:grid-cols-2", gridGap)}>
        <CollapsibleSection
          id="my-todo"
          title="My To-Do"
          isCollapsed={isSectionCollapsed('my-todo')}
          onToggle={() => onToggleSection('my-todo')}
          density={viewDensity}
          actions={
            <Button size="sm" variant="ghost" onClick={onOpenTasks} className="gap-1.5 text-primary">
              <ListTodo className="h-4 w-4" />
              View All
            </Button>
          }
        >
          <div className="flex flex-col gap-2">
            {project.personalTodos.filter(t => t.status !== 'completed').slice(0, 3).map(todo => (
              <div key={todo.id} className={cn(
                "border border-border rounded-lg",
                isCompact ? "p-2" : "p-2.5"
              )}>
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
            className={cn(
              "w-full mt-3 bg-transparent border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary",
              isCompact ? "p-1.5" : "p-2"
            )}
          >
            + Add Task
          </button>
        </CollapsibleSection>

        <CollapsibleSection
          id="project-todo"
          title="Project To-Do"
          isCollapsed={isSectionCollapsed('project-todo')}
          onToggle={() => onToggleSection('project-todo')}
          density={viewDensity}
          actions={
            <Button size="sm" variant="ghost" onClick={onOpenTasks} className="gap-1.5 text-primary">
              <ListTodo className="h-4 w-4" />
              View All
            </Button>
          }
        >
          <div className="flex flex-col gap-2">
            {project.globalTodos.filter(t => t.status !== 'completed').slice(0, 3).map(todo => (
              <div key={todo.id} className={cn(
                "border border-border rounded-lg",
                isCompact ? "p-2" : "p-2.5"
              )}>
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
            className={cn(
              "w-full mt-3 bg-transparent border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary",
              isCompact ? "p-1.5" : "p-2"
            )}
          >
            + Add Task
          </button>
        </CollapsibleSection>
      </div>
    </main>
  );
}
