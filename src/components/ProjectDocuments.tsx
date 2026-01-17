/**
 * ProjectDocuments Component
 * 
 * DEVELOPER NOTES FOR INTEGRATION:
 * - This component displays a folder/file browser for project documents
 * - Props to wire up:
 *   - project: Project object with files array (FileItem[])
 *   - onBack: navigation callback
 *   - onUpdateFiles: callback to persist file changes to your backend
 * 
 * - Backend changes needed:
 *   - File upload endpoint to handle actual file uploads
 *   - File/folder CRUD operations
 *   - Replace mock file uploads with actual API calls
 * 
 * - The status column has been removed as requested
 * - Files are now displayed in a cleaner folder-style view
 */

import { ArrowLeft, Folder, File, Upload, FolderPlus, MoreVertical, Trash2, Move, Download, ChevronRight, FileText, FileSpreadsheet, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Project, FileItem } from "@/types/project";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProjectDocumentsProps {
  project: Project;
  onBack: () => void;
  onUpdateFiles: (files: FileItem[]) => void;
}

const getFileIcon = (fileType?: string) => {
  switch (fileType) {
    case 'pdf':
      return <FileText className="h-5 w-5 text-red-500" />;
    case 'docx':
    case 'doc':
      return <FileText className="h-5 w-5 text-blue-500" />;
    case 'xlsx':
    case 'xls':
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
      return <FileImage className="h-5 w-5 text-purple-500" />;
    default:
      return <File className="h-5 w-5 text-muted-foreground" />;
  }
};

export function ProjectDocuments({ project, onBack, onUpdateFiles }: ProjectDocumentsProps) {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);

  // Get breadcrumb path
  const getBreadcrumbs = () => {
    const breadcrumbs: { id: string | null; name: string }[] = [{ id: null, name: 'Root' }];
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

  // Get items in current folder
  const currentItems = project.files.filter(f => f.parentId === currentFolderId);
  const folders = currentItems.filter(f => f.type === 'folder').sort((a, b) => a.name.localeCompare(b.name));
  const files = currentItems.filter(f => f.type === 'file').sort((a, b) => a.name.localeCompare(b.name));

  // Get all folders for move dialog
  const allFolders = project.files.filter(f => f.type === 'folder');

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder: FileItem = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      type: 'folder',
      parentId: currentFolderId,
      modifiedDate: new Date().toISOString().split('T')[0]
    };
    
    onUpdateFiles([...project.files, newFolder]);
    setNewFolderName('');
    setShowNewFolder(false);
  };

  const handleDeleteItem = (item: FileItem) => {
    // Also delete all children if it's a folder
    const idsToDelete = new Set<string>([item.id]);
    
    if (item.type === 'folder') {
      const findChildren = (parentId: string) => {
        project.files.forEach(f => {
          if (f.parentId === parentId) {
            idsToDelete.add(f.id);
            if (f.type === 'folder') {
              findChildren(f.id);
            }
          }
        });
      };
      findChildren(item.id);
    }
    
    onUpdateFiles(project.files.filter(f => !idsToDelete.has(f.id)));
  };

  const handleMoveItem = (targetFolderId: string | null) => {
    if (!selectedItem) return;
    
    const updatedFiles = project.files.map(f => 
      f.id === selectedItem.id ? { ...f, parentId: targetFolderId } : f
    );
    
    onUpdateFiles(updatedFiles);
    setShowMoveDialog(false);
    setSelectedItem(null);
  };

  const handleUploadClick = () => {
    // TODO: Replace with actual file upload API call
    const mockFile: FileItem = {
      id: `file-${Date.now()}`,
      name: `Document-${Date.now()}.pdf`,
      type: 'file',
      fileType: 'pdf',
      parentId: currentFolderId,
      size: '1.2 MB',
      modifiedDate: new Date().toISOString().split('T')[0],
      author: 'You',
      version: 'Rev A'
    };
    onUpdateFiles([...project.files, mockFile]);
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <main className="flex-1 p-8 bg-background overflow-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">
              Project Documents
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage all project files and folders
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowNewFolder(true)} className="gap-1.5">
              <FolderPlus className="h-4 w-4" />
              New Folder
            </Button>
            <Button size="sm" onClick={handleUploadClick} className="gap-1.5">
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1 mb-4 text-sm">
        {breadcrumbs.map((crumb, idx) => (
          <div key={crumb.id ?? 'root'} className="flex items-center gap-1">
            {idx > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            <button
              onClick={() => setCurrentFolderId(crumb.id)}
              className={cn(
                "hover:text-primary transition-colors",
                idx === breadcrumbs.length - 1 ? "text-foreground font-medium" : "text-muted-foreground"
              )}
            >
              {crumb.name}
            </button>
          </div>
        ))}
      </div>

      {/* File List - Simplified folder-style view */}
      <Card className="overflow-hidden">
        <div className="border-b border-border bg-secondary px-4 py-3 grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground">
          <div className="col-span-6">Name</div>
          <div className="col-span-2">Modified</div>
          <div className="col-span-2">Size</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {folders.length === 0 && files.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <Folder className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>This folder is empty</p>
            <p className="text-sm">Upload files or create subfolders</p>
          </div>
        ) : (
          <div>
            {/* Folders */}
            {folders.map(folder => (
              <div
                key={folder.id}
                className="px-4 py-3 grid grid-cols-12 gap-4 items-center border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer"
                onDoubleClick={() => setCurrentFolderId(folder.id)}
              >
                <div className="col-span-6 flex items-center gap-3">
                  <Folder className="h-5 w-5 text-warning" />
                  <span className="text-sm font-medium">{folder.name}</span>
                </div>
                <div className="col-span-2 text-sm text-muted-foreground">{folder.modifiedDate}</div>
                <div className="col-span-2 text-sm text-muted-foreground">—</div>
                <div className="col-span-2 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setCurrentFolderId(folder.id)}>
                        <Folder className="h-4 w-4 mr-2" />
                        Open
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setSelectedItem(folder); setShowMoveDialog(true); }}>
                        <Move className="h-4 w-4 mr-2" />
                        Move
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteItem(folder)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {/* Files */}
            {files.map(file => (
              <div
                key={file.id}
                className="px-4 py-3 grid grid-cols-12 gap-4 items-center border-b border-border hover:bg-secondary/50 transition-colors"
              >
                <div className="col-span-6 flex items-center gap-3">
                  {getFileIcon(file.fileType)}
                  <span className="text-sm">{file.name}</span>
                </div>
                <div className="col-span-2 text-sm text-muted-foreground">{file.modifiedDate}</div>
                <div className="col-span-2 text-sm text-muted-foreground">{file.size || '—'}</div>
                <div className="col-span-2 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setSelectedItem(file); setShowMoveDialog(true); }}>
                        <Move className="h-4 w-4 mr-2" />
                        Move
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteItem(file)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* New Folder Dialog */}
      <Dialog open={showNewFolder} onOpenChange={setShowNewFolder}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label className="mb-2 block">Folder Name</Label>
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolder(false)}>Cancel</Button>
            <Button onClick={handleCreateFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move Dialog */}
      <Dialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Move "{selectedItem?.name}"</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <button
              onClick={() => handleMoveItem(null)}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-secondary transition-colors flex items-center gap-2"
            >
              <Folder className="h-4 w-4 text-warning" />
              Root
            </button>
            {allFolders
              .filter(f => f.id !== selectedItem?.id)
              .map(folder => (
                <button
                  key={folder.id}
                  onClick={() => handleMoveItem(folder.id)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-secondary transition-colors flex items-center gap-2"
                >
                  <Folder className="h-4 w-4 text-warning" />
                  {folder.name}
                </button>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
