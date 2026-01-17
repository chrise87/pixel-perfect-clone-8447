import { ArrowLeft, Settings, Plus, UserPlus, Upload, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar } from "@/components/Avatar";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Project } from "@/types/project";
import { buildingTypes, stageFrameworks, userRoles, permissionLevels } from "@/data/constants";
import { cn } from "@/lib/utils";

interface ProjectDashboardProps {
  project: Project;
  onBack: () => void;
  onAddCollaborator: () => void;
  onAddTask: (type: 'personal' | 'global') => void;
  onAddBundle: () => void;
}

export function ProjectDashboard({ project, onBack, onAddCollaborator, onAddTask, onAddBundle }: ProjectDashboardProps) {
  const framework = stageFrameworks[project.stageFramework];
  const currentStageIndex = framework.stages.findIndex(s => s.id === project.currentStage);
  const stageName = framework.stages.find(s => s.id === project.currentStage)?.name || 'Not set';

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

      {/* Project Header */}
      <Card className="p-6 mb-6">
        <div className="flex gap-6">
          {/* Project Image */}
          <div className="w-36 h-28 bg-secondary rounded-lg flex items-center justify-center text-5xl flex-shrink-0">
            {project.image ? (
              <img src={project.image} alt={project.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              buildingTypes.find(t => t.id === project.buildingType)?.icon || '🏢'
            )}
          </div>

          {/* Project Info */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h1 className="text-xl font-semibold text-foreground mb-1">{project.name}</h1>
                <p className="text-sm text-muted-foreground">{project.address || project.location}</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                Project Settings
              </Button>
            </div>

            <div className="grid grid-cols-5 gap-6 mt-4">
              <div>
                <div className="text-[11px] text-muted-foreground uppercase mb-1">Building Type</div>
                <div className="text-sm font-medium">{buildingTypes.find(t => t.id === project.buildingType)?.label}</div>
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground uppercase mb-1">Location</div>
                <div className="text-sm font-medium">{project.location}</div>
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground uppercase mb-1">GIA</div>
                <div className="text-sm font-medium">{project.gia}</div>
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground uppercase mb-1">Completion</div>
                <div className="text-sm font-medium">
                  {project.completionDate 
                    ? new Date(project.completionDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
                    : 'TBD'}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground uppercase mb-1">Current Stage</div>
                <div className="text-sm font-medium">
                  {project.stageFramework === 'riba' ? `Stage ${project.currentStage}: ` : ''}{stageName}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stage Progress */}
      <Card className="p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold">{framework.name}</h2>
          <Button variant="secondary" size="sm">Edit Stage</Button>
        </div>
        <div className="flex gap-1.5">
          {framework.stages.map((stage, idx) => {
            const isComplete = idx < currentStageIndex;
            const isActive = stage.id === project.currentStage;
            
            return (
              <div
                key={stage.id}
                className={cn(
                  "flex-1 p-2.5 rounded-md text-center transition-colors",
                  isComplete && "bg-success/10",
                  isActive && "bg-accent border-2 border-primary",
                  !isComplete && !isActive && "bg-secondary"
                )}
              >
                <div className={cn(
                  "text-sm font-semibold mb-0.5",
                  isComplete && "text-success",
                  isActive && "text-primary",
                  !isComplete && !isActive && "text-muted-foreground"
                )}>
                  {project.stageFramework === 'riba' ? stage.id : stage.id.toUpperCase()}
                </div>
                <div className={cn(
                  "text-[9px] leading-tight",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {stage.name}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Team & Collaborators */}
      <Card className="p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold">Team & Collaborators ({project.collaborators.length})</h2>
          <Button size="sm" onClick={onAddCollaborator} className="gap-1.5">
            <UserPlus className="h-4 w-4" />
            Add Member
          </Button>
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Member</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Permission</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Role Filter</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {project.collaborators.map((collab) => (
                <tr key={collab.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar initials={collab.initials} color={collab.color} size="md" />
                      <div>
                        <div className="text-sm font-medium flex items-center gap-2">
                          {collab.name}
                          {collab.isOwner && (
                            <Badge variant="secondary" className="text-[10px] bg-warning/10 text-warning">
                              Owner
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Select defaultValue={collab.role}>
                      <SelectTrigger className="w-[180px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {userRoles.map(role => (
                          <SelectItem key={role.id} value={role.id} className="text-xs">{role.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3">
                    <Select defaultValue={collab.permission}>
                      <SelectTrigger className="w-[120px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {permissionLevels.map(perm => (
                          <SelectItem key={perm.id} value={perm.id} className="text-xs">{perm.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3">
                    <Switch checked={collab.roleFilterEnabled} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Documents Section - Two Panels */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Project Documents */}
        <Card className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold">Project Documents</h2>
            <Button size="sm" className="gap-1.5">
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Documents produced by the design team
          </p>

          <div className="flex flex-col gap-2">
            {project.projectDocuments.map(doc => (
              <div
                key={doc.id}
                className="p-3 border border-border rounded-lg flex justify-between items-center hover:bg-secondary/50 transition-colors"
              >
                <div>
                  <div className="text-sm text-foreground mb-1">{doc.name}</div>
                  <div className="flex gap-2 items-center">
                    <Badge variant="secondary" className="text-[10px] bg-warning/10 text-warning">
                      {doc.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{doc.version}</span>
                    <span className="text-xs text-muted-foreground/60">• {doc.author}</span>
                  </div>
                </div>
                <StatusBadge status={doc.status} />
              </div>
            ))}
            {project.projectDocuments.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No documents yet</p>
            )}
          </div>
        </Card>

        {/* Library Bundles */}
        <Card className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold">Library Bundles</h2>
            <Button size="sm" onClick={onAddBundle} className="gap-1.5">
              <Plus className="h-4 w-4" />
              Add Bundle
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Relevant standards from Nomon libraries
          </p>

          <div className="flex flex-col gap-2">
            {project.appliedBundles.map(bundle => (
              <div
                key={bundle.id}
                className="p-3 border border-border rounded-lg flex justify-between items-center"
              >
                <div>
                  <div className="text-sm font-medium text-foreground">{bundle.name}</div>
                  <div className="text-xs text-muted-foreground">{bundle.documents} documents</div>
                </div>
                <Badge variant="secondary" className="text-[10px] bg-success/10 text-success">
                  Applied
                </Badge>
              </div>
            ))}
            {project.appliedBundles.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No bundles applied</p>
            )}
          </div>
        </Card>
      </div>

      {/* To-Do Panels */}
      <div className="grid grid-cols-2 gap-6">
        {/* Personal To-Do */}
        <Card className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold">My To-Do</h2>
          </div>

          <div className="flex flex-col gap-2">
            {project.personalTodos.map(todo => (
              <div key={todo.id} className="p-3 border border-border rounded-lg">
                <div className="flex items-start gap-2 mb-2">
                  <PriorityBadge priority={todo.priority} />
                </div>
                <div className="text-sm text-foreground mb-1">{todo.text}</div>
                <div className="text-xs text-muted-foreground">Due: {todo.due}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onAddTask('personal')}
            className="w-full mt-3 p-2.5 bg-transparent border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            + Add Task
          </button>
        </Card>

        {/* Project To-Do */}
        <Card className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold">Project To-Do</h2>
          </div>

          <div className="flex flex-col gap-2">
            {project.globalTodos.map(todo => (
              <div key={todo.id} className="p-3 border border-border rounded-lg">
                <div className="text-sm text-foreground mb-1">{todo.text}</div>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span>👤 {todo.assignee}</span>
                  <span>Due: {todo.due}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onAddTask('global')}
            className="w-full mt-3 p-2.5 bg-transparent border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            + Add Task
          </button>
        </Card>
      </div>
    </main>
  );
}
