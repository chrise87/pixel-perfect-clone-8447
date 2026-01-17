/**
 * ComplianceReview Component
 * 
 * DEVELOPER NOTES FOR INTEGRATION:
 * - This component handles document compliance review with AI
 * - Props to wire up:
 *   - project: Project object with files and appliedBundles
 *   - onBack: navigation callback
 *   - onSaveToReviews: callback to save review results to project
 * 
 * - Backend changes needed:
 *   - File upload endpoint for documents to review
 *   - AI/LLM integration for actual compliance checking
 *   - Chat endpoint for follow-up questions after initial review
 *   - Replace mock responses with actual API calls
 * 
 * - After initial review, component switches to chat mode for refinement
 * - Folder navigation allows selecting specific project folders as context
 */

import { ArrowLeft, Upload, Send, Library, FileText, X, Check, Folder, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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
  const [chatInput, setChatInput] = useState('');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  // Get folders for navigation
  const getFolderContents = (parentId: string | null) => {
    return project.files.filter(f => f.parentId === parentId && f.type === 'folder');
  };

  // Get breadcrumb path for folder navigation
  const getFolderBreadcrumbs = () => {
    const breadcrumbs: { id: string | null; name: string }[] = [{ id: null, name: 'Project Root' }];
    let currentId = currentFolderId;
    
    while (currentId) {
      const folder = project.files.find(f => f.id === currentId);
      if (folder) {
        breadcrumbs.splice(1, 0, { id: folder.id, name: folder.name });
        currentId = folder.parentId;
      } else {
        break;
      }
    }
    
    return breadcrumbs;
  };

  const currentFolders = getFolderContents(currentFolderId);
  const folderBreadcrumbs = getFolderBreadcrumbs();

  const handleUploadFiles = () => {
    // TODO: Replace with actual file upload
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
      content: `Reviewing against: ${selectedBundles.length} library documents, ${selectedFolders.length} project folders`,
      timestamp: new Date()
    };

    setMessages([userMessage, systemMessage]);

    // Simulate review response - TODO: Replace with actual AI call
    setTimeout(() => {
      const assistantMessage: ReviewMessage = {
        id: Date.now() + 2,
        role: 'assistant',
        content: `## Compliance Review Summary\n\n**Documents Reviewed:** ${uploadedFiles.length}\n\n### Findings:\n\n1. **Section 4.2 - Fire Compartmentation**\n   - ⚠️ Missing reference to BS 9991 clause 6.4\n   - Recommendation: Add explicit reference to travel distance calculations\n\n2. **Section 5.1 - Smoke Control**\n   - ✅ Compliant with ADB Volume 2\n   - Note: Consider adding CIBSE Guide E reference\n\n3. **General**\n   - Document version control: Current\n   - Cross-references: 85% complete\n\n*Feel free to ask follow-up questions to refine this review.*`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: ReviewMessage = {
      id: Date.now(),
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Simulate AI response - TODO: Replace with actual chat API call
    setTimeout(() => {
      const assistantMessage: ReviewMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Thanks for your question about "${chatInput.slice(0, 30)}..."\n\nBased on my review of the documents, here's additional context:\n\n- The relevant section references BS EN 1991-1-2 for fire loading calculations\n- Cross-referencing with your project specifications, I recommend reviewing Section 3.4\n- For detailed guidance, consider consulting CIBSE TM19\n\nWould you like me to elaborate on any specific aspect?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1500);
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
            <div className="flex-1 p-6 overflow-auto">
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

                {/* Select Project Folder with Navigation */}
                <Card className="p-6 mb-6">
                  <h2 className="text-base font-semibold mb-3">Reference Project Folders (Optional)</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Navigate and select project folders to include as context
                  </p>
                  
                  {/* Folder Breadcrumb Navigation */}
                  <div className="flex items-center gap-1 mb-3 text-xs">
                    {folderBreadcrumbs.map((crumb, idx) => (
                      <div key={crumb.id ?? 'root'} className="flex items-center gap-1">
                        {idx > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                        <button
                          onClick={() => setCurrentFolderId(crumb.id)}
                          className={cn(
                            "hover:text-primary transition-colors",
                            idx === folderBreadcrumbs.length - 1 ? "text-foreground font-medium" : "text-muted-foreground"
                          )}
                        >
                          {crumb.name}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Folder List */}
                  <div className="border border-border rounded-lg max-h-[200px] overflow-auto">
                    {currentFolders.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No subfolders in this location
                      </div>
                    ) : (
                      currentFolders.map(folder => (
                        <div
                          key={folder.id}
                          className="flex items-center gap-3 p-3 border-b border-border last:border-0 hover:bg-secondary/50"
                        >
                          <Checkbox 
                            checked={selectedFolders.includes(folder.id)}
                            onCheckedChange={() => toggleFolder(folder.id)}
                          />
                          <button 
                            className="flex items-center gap-2 flex-1 text-left"
                            onDoubleClick={() => setCurrentFolderId(folder.id)}
                          >
                            <Folder className="h-4 w-4 text-warning" />
                            <span className="text-sm">{folder.name}</span>
                          </button>
                          <button 
                            onClick={() => setCurrentFolderId(folder.id)}
                            className="text-xs text-muted-foreground hover:text-primary"
                          >
                            Open →
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {selectedFolders.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {selectedFolders.length} folder{selectedFolders.length !== 1 ? 's' : ''} selected
                    </p>
                  )}
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
            // Chat Review Mode
            <div className="flex-1 flex flex-col">
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

              {/* Chat Input */}
              <div className="p-4 border-t border-border">
                <div className="max-w-3xl mx-auto flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask a follow-up question to refine the review..."
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!chatInput.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Library Documents */}
        <div className="w-72 border-l border-border p-4 overflow-auto">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Library className="h-4 w-4" />
            Library Documents
          </h3>

          <p className="text-xs text-muted-foreground mb-3">
            Select library documents to check compliance against
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
              <p className="text-xs text-muted-foreground">No library documents applied to this project</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
