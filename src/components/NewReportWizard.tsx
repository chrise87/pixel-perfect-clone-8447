import { ArrowLeft, FileText, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Project } from "@/types/project";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NewReportWizardProps {
  project: Project;
  onBack: () => void;
  onCreate: (report: { name: string; type: string; template: string; description: string }) => void;
}

const reportTypes = [
  { id: 'design-report', label: 'Design Report', description: 'Comprehensive design documentation' },
  { id: 'fire-strategy', label: 'Fire Strategy', description: 'Fire safety strategy document' },
  { id: 'technical-spec', label: 'Technical Specification', description: 'Detailed technical specifications' },
  { id: 'compliance-report', label: 'Compliance Report', description: 'Regulatory compliance documentation' },
  { id: 'progress-report', label: 'Progress Report', description: 'Project status and progress update' },
  { id: 'custom', label: 'Custom Document', description: 'Start from scratch' },
];

const templates = [
  { id: 'blank', label: 'Blank Document', description: 'Start with an empty document' },
  { id: 'riba-stage-3', label: 'RIBA Stage 3 Report', description: 'Standard Stage 3 template' },
  { id: 'fire-strategy-uk', label: 'UK Fire Strategy', description: 'BS 9999 aligned template' },
  { id: 'das', label: 'Design & Access Statement', description: 'Planning application template' },
];

export function NewReportWizard({ project, onBack, onCreate }: NewReportWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    template: '',
    description: ''
  });

  const selectedType = reportTypes.find(t => t.id === formData.type);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onCreate(formData);
    }
  };

  const canProceed = () => {
    if (step === 1) return formData.type !== '';
    if (step === 2) return formData.name !== '';
    return true;
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <FileText className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              New Report / Document
            </h1>
            <p className="text-sm text-muted-foreground">
              Create a new document for {project.name}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step >= s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              )}>
                {s}
              </div>
              {s < 3 && (
                <ChevronRight className={cn(
                  "h-5 w-5 mx-2",
                  step > s ? "text-primary" : "text-muted-foreground/30"
                )} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-16 mt-2 text-xs text-muted-foreground">
          <span>Select Type</span>
          <span>Details</span>
          <span>Template</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Step 1: Select Type */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">What type of document?</h2>
            <div className="grid grid-cols-2 gap-4">
              {reportTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setFormData({ ...formData, type: type.id })}
                  className={cn(
                    "p-4 rounded-xl border text-left transition-all",
                    formData.type === type.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <p className="font-medium mb-1">{type.label}</p>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Document Details */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Document Details</h2>
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Document Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={`e.g., ${selectedType?.label} - ${project.name}`}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Description (Optional)</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this document..."
                    rows={3}
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Step 3: Select Template */}
        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Choose a Template</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => setFormData({ ...formData, template: template.id })}
                  className={cn(
                    "p-4 rounded-xl border text-left transition-all",
                    formData.template === template.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <p className="font-medium mb-1">{template.label}</p>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </button>
              ))}
            </div>

            {/* AI Suggestion */}
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">AI-Assisted Start</p>
                  <p className="text-xs text-muted-foreground">
                    After creating, use Copilot to help draft content based on your project data and selected libraries.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <Button 
            variant="outline" 
            onClick={() => step > 1 ? setStep(step - 1) : onBack()}
          >
            {step > 1 ? 'Back' : 'Cancel'}
          </Button>
          <Button onClick={handleNext} disabled={!canProceed()}>
            {step === 3 ? 'Create Document' : 'Next'}
          </Button>
        </div>
      </div>
    </main>
  );
}
