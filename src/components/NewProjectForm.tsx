import { ArrowLeft, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { buildingTypes, stageFrameworks } from "@/data/constants";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NewProjectData {
  name: string;
  buildingType: string;
  buildingSubtype: string;
  location: string;
  address: string;
  gia: string;
  completionDate: string;
  stageFramework: string;
  currentStage: string;
}

interface NewProjectFormProps {
  onBack: () => void;
  onCreate: (data: NewProjectData) => void;
}

export function NewProjectForm({ onBack, onCreate }: NewProjectFormProps) {
  const [formData, setFormData] = useState<NewProjectData>({
    name: '',
    buildingType: '',
    buildingSubtype: '',
    location: '',
    address: '',
    gia: '',
    completionDate: '',
    stageFramework: 'riba',
    currentStage: '',
  });

  const selectedType = buildingTypes.find(t => t.id === formData.buildingType);
  const currentFramework = stageFrameworks[formData.stageFramework];

  const handleSubmit = () => {
    onCreate(formData);
  };

  const isValid = formData.name && formData.buildingType && formData.location;

  return (
    <main className="flex-1 p-8 bg-background overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </button>
        <h1 className="text-2xl font-semibold text-foreground mb-1">
          Create New Project
        </h1>
        <p className="text-sm text-muted-foreground">
          Set up your project details and configuration
        </p>
      </div>

      {/* Form */}
      <div className="max-w-3xl">
        {/* Project Image Upload */}
        <div className="mb-8">
          <Label className="mb-2 block">Project Image</Label>
          <div className="w-48 h-36 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer bg-surface-inset hover:border-primary/50 transition-colors">
            <Camera className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">Upload image</span>
            <span className="text-xs text-muted-foreground/60">or drag and drop</span>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-5 mb-6">
          <div>
            <Label className="mb-2 block">Project Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter project name"
            />
          </div>
          <div>
            <Label className="mb-2 block">Building Type *</Label>
            <Select 
              value={formData.buildingType}
              onValueChange={(value) => setFormData({ ...formData, buildingType: value, buildingSubtype: '' })}
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
                  onClick={() => setFormData({ ...formData, buildingSubtype: sub.id })}
                  className={cn(
                    "px-3 py-2 border rounded-md text-sm transition-colors",
                    formData.buildingSubtype === sub.id
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
            <Label className="mb-2 block">Location (City, Country) *</Label>
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
          <Label className="mb-3 block">Stage Framework *</Label>
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

        {/* Action Buttons */}
        <div className="flex gap-3 mt-10 pt-6 border-t border-border">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            Create Project
          </Button>
        </div>
      </div>
    </main>
  );
}
