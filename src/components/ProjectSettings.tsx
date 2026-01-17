import { ArrowLeft, Camera, UserPlus, MoreVertical, Pause, Trash2, Shield, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/ui/badge";
import { buildingTypes, stageFrameworks, userRoles, permissionLevels } from "@/data/constants";
import { Project, Collaborator } from "@/types/project";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProjectSettingsProps {
  project: Project;
  onBack: () => void;
  onSave: (updatedProject: Partial<Project>) => void;
  onAddCollaborator: () => void;
  onUpdateCollaborator: (collaboratorId: number, updates: Partial<Collaborator>) => void;
  onRemoveCollaborator: (collaboratorId: number) => void;
}

export function ProjectSettings({ 
  project, 
  onBack, 
  onSave, 
  onAddCollaborator,
  onUpdateCollaborator,
  onRemoveCollaborator 
}: ProjectSettingsProps) {
  const [formData, setFormData] = useState({
    name: project.name,
    buildingType: project.buildingType,
    buildingSubtype: project.buildingSubtype,
    location: project.location,
    address: project.address,
    gia: project.gia,
    completionDate: project.completionDate,
    stageFramework: project.stageFramework,
    currentStage: project.currentStage,
  });

  const selectedType = buildingTypes.find(t => t.id === formData.buildingType);
  const currentFramework = stageFrameworks[formData.stageFramework];

  const handleSave = () => {
    onSave(formData);
  };

  const handleTogglePause = (collaborator: Collaborator) => {
    onUpdateCollaborator(collaborator.id, { 
      status: collaborator.status === 'active' ? 'inactive' : 'active' 
    });
  };

  return (
    <main className="flex-1 p-8 bg-background overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-semibold text-foreground mb-1">
          Project Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Configure project details, team, and permissions
        </p>
      </div>

      <div className="max-w-4xl space-y-8">
        {/* Project Details Card */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Project Details</h2>
          
          {/* Project Image Upload */}
          <div className="mb-6">
            <Label className="mb-2 block">Project Image</Label>
            <div className="w-48 h-36 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer bg-surface-inset hover:border-primary/50 transition-colors">
              <Camera className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">Upload image</span>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-5 mb-6">
            <div>
              <Label className="mb-2 block">Project Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name"
              />
            </div>
            <div>
              <Label className="mb-2 block">Building Type</Label>
              <Select 
                value={formData.buildingType}
                onValueChange={(value) => setFormData({ ...formData, buildingType: value, buildingSubtype: [] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select building type" />
                </SelectTrigger>
                <SelectContent>
                  {buildingTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.icon} {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Subcategories */}
          {selectedType && selectedType.subcategories.length > 0 && (
            <div className="mb-6">
              <Label className="mb-2 block">Subcategories</Label>
              <div className="flex flex-wrap gap-2">
                {selectedType.subcategories.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      const isSelected = formData.buildingSubtype.includes(sub.id);
                      setFormData({
                        ...formData,
                        buildingSubtype: isSelected
                          ? formData.buildingSubtype.filter(s => s !== sub.id)
                          : [...formData.buildingSubtype, sub.id]
                      });
                    }}
                    className={cn(
                      "px-3 py-2 border rounded-md text-sm transition-colors",
                      formData.buildingSubtype.includes(sub.id)
                        ? "bg-accent border-primary text-accent-foreground"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          <div className="grid grid-cols-2 gap-5 mb-6">
            <div>
              <Label className="mb-2 block">Location (City, Country)</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., London, UK"
              />
            </div>
            <div>
              <Label className="mb-2 block">Full Address</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter full address"
              />
            </div>
          </div>

          {/* GIA and Completion */}
          <div className="grid grid-cols-2 gap-5 mb-6">
            <div>
              <Label className="mb-2 block">Gross Internal Area (GIA)</Label>
              <Input
                value={formData.gia}
                onChange={(e) => setFormData({ ...formData, gia: e.target.value })}
                placeholder="e.g., 45,000 m²"
              />
            </div>
            <div>
              <Label className="mb-2 block">Target Completion Date</Label>
              <Input
                type="date"
                value={formData.completionDate}
                onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
              />
            </div>
          </div>

          {/* Stage Framework */}
          <div className="mb-6">
            <Label className="mb-3 block">Stage Framework</Label>
            <div className="flex gap-3 mb-4">
              {Object.entries(stageFrameworks).map(([key, framework]) => (
                <button
                  key={key}
                  onClick={() => setFormData({ ...formData, stageFramework: key, currentStage: '' })}
                  className={cn(
                    "px-4 py-3 border rounded-lg text-sm transition-colors",
                    formData.stageFramework === key
                      ? "border-primary bg-accent text-foreground font-medium"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {framework.name}
                </button>
              ))}
            </div>

            <Label className="mb-2 block">Current Stage</Label>
            <Select
              value={formData.currentStage}
              onValueChange={(value) => setFormData({ ...formData, currentStage: value })}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="Select current stage" />
              </SelectTrigger>
              <SelectContent>
                {currentFramework.stages.map(stage => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {formData.stageFramework === 'riba' ? `Stage ${stage.id}: ` : ''}{stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Team & Permissions Card */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Team & Permissions</h2>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {project.collaborators.map((collab) => (
                  <tr 
                    key={collab.id} 
                    className={cn(
                      "border-t border-border",
                      collab.status === 'inactive' && "opacity-50 bg-muted/30"
                    )}
                  >
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
                      <Select 
                        defaultValue={collab.role}
                        onValueChange={(value) => onUpdateCollaborator(collab.id, { role: value })}
                        disabled={collab.status === 'inactive'}
                      >
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
                      <Select 
                        defaultValue={collab.permission}
                        onValueChange={(value) => onUpdateCollaborator(collab.id, { permission: value })}
                        disabled={collab.status === 'inactive' || collab.isOwner}
                      >
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
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-[10px]",
                          collab.status === 'active' ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                        )}
                      >
                        {collab.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleTogglePause(collab)}>
                            <Pause className="h-4 w-4 mr-2" />
                            {collab.status === 'active' ? 'Pause User' : 'Activate User'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="h-4 w-4 mr-2" />
                            Change Permission
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserCog className="h-4 w-4 mr-2" />
                            Change Role
                          </DropdownMenuItem>
                          {!collab.isOwner && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => onRemoveCollaborator(collab.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove from Project
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </main>
  );
}
