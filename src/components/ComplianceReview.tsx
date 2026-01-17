import { ArrowLeft, Upload, Send, Library, FileText, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Project, FileItem } from "@/types/project";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ReviewMessage {
  id: number;
  role: 'user' | 'system' | 'assistant';
  content: string;
  timestamp: Date;
  files?: string[];
}

interface ComplianceReviewProps {
  project: Project;
  onBack: () => void;
  onSaveToReviews: (files: FileItem[]) => void;
}

export function ComplianceReview({ project, onBack, onSaveToReviews }: ComplianceReviewProps) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [selectedBundles, setSelectedBundles] = useState<string[]>([]);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [isReviewing, setIsReviewing] = useState(false);
  const [messages, setMessages] = useState<ReviewMessage[]>([]);

  // Get root folders from project
  const projectFolders = project.files.filter(f => f.type === 'folder' && f.parentId === null);

  const handleUploadFiles = () => {
    // Simulate file upload
    const mockFiles = [
      `Document-${Date.now()}.pdf`,
      `Report-${Date.now() + 1}.pdf`
    ];
    setUploadedFiles([...uploadedFiles, ...mockFiles]);
  };

  const handleRemoveFile = (fileName: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f !== fileName));
  };

  const toggleBundle = (bundleId: string) => {
    setSelectedBundles(prev => 
      prev.includes(bundleId) 
        ? prev.filter(id => id !== bundleId)
        : [...prev, bundleId]
    );
  };

  const toggleFolder = (folderId: string) => {
    setSelectedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const handleStartReview = () => {
    if (uploadedFiles.length === 0) return;

    setIsReviewing(true);

    // Add user message showing what's being reviewed
    const userMessage: ReviewMessage = {
      id: Date.now(),
      role: 'user',
      content: 'Starting compliance review',
      timestamp: new Date(),
      files: uploadedFiles
    };

    const systemMessage: ReviewMessage = {
      id: Date.now() + 1,
      role: 'system',
      content: `Reviewing against: ${selectedBundles.length} library bundles, ${selectedFolders.length} project folders`,
      timestamp: new Date()
    };

    setMessages([userMessage, systemMessage]);

    // Simulate review response
    setTimeout(() => {
      const assistantMessage: ReviewMessage = {
        id: Date.now() + 2,
        role: 'assistant',
        content: `## Compliance Review Summary\n\n**Documents Reviewed:** ${uploadedFiles.length}\n\n### Findings:\n\n1. **Section 4.2 - Fire Compartmentation**\n   - ⚠️ Missing reference to BS 9991 clause 6.4\n   - Recommendation: Add explicit reference to travel distance calculations\n\n2. **Section 5.1 - Smoke Control**\n   - ✅ Compliant with ADB Volume 2\n   - Note: Consider adding CIBSE Guide E reference\n\n3. **General**\n   - Document version control: Current\n   - Cross-references: 85% complete\n\n*This is a demo review. Full AI analysis would provide detailed compliance checking.*`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 2000);
  };

  const canStartReview = uploadedFiles.length > 0;

  return (
    <main className="flex-1 flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Check className="h-5 w-5 text-success" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Compliance Review
              </h1>
              <p className="text-sm text-muted-foreground">
                Review documents against standards and regulations
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {!isReviewing ? (
            // Upload Phase
            <div className="flex-1 p-6">
              <div className="max-w-2xl mx-auto">
                {/* Upload Area */}
                <Card className="p-6 mb-6">
                  <h2 className="text-lg font-semibold mb-4">Upload Documents for Review</h2>
                  
                  <button
                    onClick={handleUploadFiles}
                    className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center hover:border-primary/50 transition-colors"
                  >
                    <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-sm font-medium">Click to upload files</p>
                    <p className="text-xs text-muted-foreground">PDF, DOCX, XLSX supported</p>
                  </button>

                  {/* Uploaded Files List */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map(file => (
                        <div 
                          key={file} 
                          className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{file}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => handleRemoveFile(file)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Select Project Folder */}
                <Card className="p-6 mb-6">
                  <h2 className="text-base font-semibold mb-3">Reference Project Folders (Optional)</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select project folders to include as context
                  </p>
                  <div className="space-y-2">
                    {projectFolders.map(folder => (
                      <label
                        key={folder.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary cursor-pointer"
                      >
                        <Checkbox 
                          checked={selectedFolders.includes(folder.id)}
                          onCheckedChange={() => toggleFolder(folder.id)}
                        />
                        <span className="text-sm">{folder.name}</span>
                      </label>
                    ))}
                  </div>
                </Card>

                {/* Start Review Button */}
                <Button 
                  size="lg" 
                  className="w-full gap-2"
                  onClick={handleStartReview}
                  disabled={!canStartReview}
                >
                  <Send className="h-4 w-4" />
                  Start Compliance Review
                </Button>
              </div>
            </div>
          ) : (
            // Review Results
            <ScrollArea className="flex-1 p-6">
              <div className="max-w-3xl mx-auto space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-xl px-4 py-3",
                        message.role === 'user' && "bg-primary text-primary-foreground",
                        message.role === 'system' && "bg-muted text-muted-foreground text-xs",
                        message.role === 'assistant' && "bg-secondary text-foreground"
                      )}
                    >
                      {message.files && (
                        <div className="mb-2 space-y-1">
                          {message.files.map(file => (
                            <Badge key={file} variant="secondary" className="text-xs mr-1">
                              {file}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="text-sm whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Right Sidebar - Library Bundles */}
        <div className="w-72 border-l border-border p-4 overflow-auto">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Library className="h-4 w-4" />
            Review Against
          </h3>

          <p className="text-xs text-muted-foreground mb-3">
            Select library bundles to check compliance against
          </p>

          <div className="space-y-2">
            {project.appliedBundles.map(bundle => (
              <label
                key={bundle.id}
                className={cn(
                  "block p-3 rounded-lg border cursor-pointer transition-colors",
                  selectedBundles.includes(bundle.id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-start gap-2">
                  <Checkbox 
                    checked={selectedBundles.includes(bundle.id)}
                    onCheckedChange={() => toggleBundle(bundle.id)}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium">{bundle.name}</p>
                    <p className="text-xs text-muted-foreground">{bundle.documents} documents</p>
                  </div>
                </div>
              </label>
            ))}
            {project.appliedBundles.length === 0 && (
              <p className="text-xs text-muted-foreground">No bundles applied to this project</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
