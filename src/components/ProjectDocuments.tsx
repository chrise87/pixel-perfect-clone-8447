/**
 * ProjectDocuments Component
 * 
 * DEVELOPER NOTES FOR INTEGRATION:
 * - This component displays a folder/file browser for project documents
 * - Now includes checkbox selection for folders/files
 * - Props to wire up:
 *   - project: Project object with files array (FileItem[])
 *   - onBack: navigation callback
 *   - onUpdateFiles: callback to persist file changes to your backend
 * 
 * - Backend changes needed:
 *   - File upload endpoint to handle actual file uploads
 *   - File/folder CRUD operations
 *   - Replace mock file uploads with actual API calls
 */

import { ArrowLeft, Folder, File, Upload, FolderPlus, MoreVertical, Trash2, Move, Download, ChevronRight, FileText, FileSpreadsheet, FileImage, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Project, FileItem, ProjectDocument } from "@/types/project";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProjectDocumentsProps {
  project: Project;
  onBack: () => void;
  onUpdateFiles: (files: FileItem[]) => void;
  onAddToProjectDocuments?: (docs: ProjectDocument[]) => void;
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

export function ProjectDocuments({ project, onBack, onUpdateFiles, onAddToProjectDocuments }: ProjectDocumentsProps) {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);

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

  // Toggle item selection
  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // Select all in current folder
  const selectAllInFolder = () => {
    const allIds = currentItems.map(item => item.id);
    const allSelected = allIds.every(id => selectedIds.has(id));
    
    if (allSelected) {
      // Deselect all in folder
      const newSelected = new Set(selectedIds);
      allIds.forEach(id => newSelected.delete(id));
      setSelectedIds(newSelected);
    } else {
      // Select all in folder
      const newSelected = new Set(selectedIds);
      allIds.forEach(id => newSelected.add(id));
      setSelectedIds(newSelected);
    }
  };

  // Check if all items in current folder are selected
  const allInFolderSelected = currentItems.length > 0 && currentItems.every(item => selectedIds.has(item.id));
  const someInFolderSelected = currentItems.some(item => selectedIds.has(item.id));

  // Get all items in a folder recursively
  const getAllItemsInFolder = (folderId: string): string[] => {
    const items: string[] = [folderId];
    project.files.forEach(f => {
      if (f.parentId === folderId) {
        if (f.type === 'folder') {
          items.push(...getAllItemsInFolder(f.id));
        } else {
          items.push(f.id);
        }
      }
    });
    return items;
  };

  // Toggle folder with all its contents
  const toggleFolderWithContents = (folderId: string) => {
    const allItems = getAllItemsInFolder(folderId);
    const allSelected = allItems.every(id => selectedIds.has(id));
    
    const newSelected = new Set(selectedIds);
    if (allSelected) {
      allItems.forEach(id => newSelected.delete(id));
    } else {
      allItems.forEach(id => newSelected.add(id));
    }
    setSelectedIds(newSelected);
  };

  // Check folder selection state
  const getFolderSelectionState = (folderId: string): 'none' | 'partial' | 'all' => {
    const allItems = getAllItemsInFolder(folderId);
    const selectedCount = allItems.filter(id => selectedIds.has(id)).length;
    if (selectedCount === 0) return 'none';
    if (selectedCount === allItems.length) return 'all';
    return 'partial';
  };

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
    
    // Also remove from selection
    const newSelected = new Set(selectedIds);
    idsToDelete.forEach(id => newSelected.delete(id));
    setSelectedIds(newSelected);
  };

  const handleDeleteSelected = () => {
    const idsToDelete = new Set<string>();
    
    selectedIds.forEach(id => {
      idsToDelete.add(id);
      const item = project.files.find(f => f.id === id);
      if (item?.type === 'folder') {
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
        findChildren(id);
      }
    });
    
    onUpdateFiles(project.files.filter(f => !idsToDelete.has(f.id)));
    setSelectedIds(new Set());
    setSelectionMode(false);
  };

  const handleAddToProject = () => {
    if (!onAddToProjectDocuments) return;
    
    // Add selected items (files and folders) to projectDocuments
    const docsToAdd: ProjectDocument[] = [];
    
    selectedIds.forEach(id => {
      const item = project.files.find(f => f.id === id);
      if (item) {
        // Check if already in projectDocuments
        const alreadyAdded = project.projectDocuments.some(d => d.name === item.name);
        if (!alreadyAdded) {
          docsToAdd.push({
            id: Date.now() + Math.random(),
            name: item.name,
            type: item.type === 'folder' ? 'folder' : (item.fileType || 'document'),
            status: 'current',
            version: item.version || 'Rev A',
            author: item.author || 'Unknown'
          });
        }
      }
    });
    
    if (docsToAdd.length > 0) {
      onAddToProjectDocuments(docsToAdd);
    }
    
    setSelectedIds(new Set());
    setSelectionMode(false);
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
    <main className="flex-1 p-4 md:p-8 bg-background overflow-auto">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Dashboard</span>
          <span className="sm:hidden">Back</span>
        </button>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-foreground mb-1">
              Project Documents
            </h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Manage all project files and folders
            </p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button 
              variant={selectionMode ? "secondary" : "outline"} 
              size="sm" 
              onClick={() => {
                setSelectionMode(!selectionMode);
                if (selectionMode) setSelectedIds(new Set());
              }} 
              className="gap-1.5"
            >
              <CheckSquare className="h-4 w-4" />
              <span className="hidden sm:inline">{selectionMode ? 'Cancel' : 'Select'}</span>
            </Button>
            {selectionMode && selectedIds.size > 0 && (
              <>
                <Button 
                  size="sm" 
                  onClick={handleAddToProject}
                  className="gap-1.5"
                >
                  <FolderPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add to Project</span>
                  <span className="sm:hidden">Add</span>
                  ({selectedIds.size})
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleDeleteSelected}
                  className="gap-1.5"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            {!selectionMode && (
              <>
                <Button variant="outline" size="sm" onClick={() => setShowNewFolder(true)} className="gap-1.5">
                  <FolderPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">New Folder</span>
                </Button>
                <Button size="sm" onClick={handleUploadClick} className="gap-1.5">
                  <Upload className="h-4 w-4" />
                  <span className="hidden sm:inline">Upload</span>
                </Button>
              </>
            )}
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

      {/* File List */}
      <Card className="overflow-hidden">
        {/* Desktop header */}
        <div className="border-b border-border bg-secondary px-3 md:px-4 py-3 hidden sm:grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground">
          {selectionMode && (
            <div className="col-span-1 flex items-center">
              <Checkbox
                checked={allInFolderSelected}
                className={someInFolderSelected && !allInFolderSelected ? 'opacity-50' : ''}
                onCheckedChange={selectAllInFolder}
              />
            </div>
          )}
          <div className={selectionMode ? "col-span-5" : "col-span-6"}>Name</div>
          <div className="col-span-2 hidden md:block">Modified</div>
          <div className="col-span-2 hidden md:block">Size</div>
          <div className="col-span-2 md:col-span-2 text-right">Actions</div>
        </div>

        {/* Mobile header */}
        <div className="border-b border-border bg-secondary px-3 py-3 sm:hidden flex items-center justify-between text-xs font-medium text-muted-foreground">
          {selectionMode && (
            <Checkbox
              checked={allInFolderSelected}
              className={someInFolderSelected && !allInFolderSelected ? 'opacity-50' : ''}
              onCheckedChange={selectAllInFolder}
            />
          )}
          <span>Name</span>
          <span>Actions</span>
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
            {folders.map(folder => {
              const folderState = getFolderSelectionState(folder.id);
              return (
                <div
                  key={folder.id}
                  className={cn(
                    "px-3 md:px-4 py-3 flex sm:grid sm:grid-cols-12 gap-2 md:gap-4 items-center border-b border-border hover:bg-secondary/50 transition-colors",
                    selectedIds.has(folder.id) && "bg-primary/5"
                  )}
                >
                  {selectionMode && (
                    <div className="sm:col-span-1 flex-shrink-0">
                      <Checkbox
                        checked={folderState === 'all'}
                        className={folderState === 'partial' ? 'opacity-50' : ''}
                        onCheckedChange={() => toggleFolderWithContents(folder.id)}
                      />
                    </div>
                  )}
                  <div 
                    className={cn(
                      "flex items-center gap-2 md:gap-3 cursor-pointer flex-1 min-w-0",
                      selectionMode ? "sm:col-span-5" : "sm:col-span-6"
                    )}
                    onClick={() => !selectionMode && setCurrentFolderId(folder.id)}
                  >
                    <Folder className="h-5 w-5 text-warning flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{folder.name}</span>
                  </div>
                  <div className="col-span-2 text-sm text-muted-foreground hidden md:block">{folder.modifiedDate}</div>
                  <div className="col-span-2 text-sm text-muted-foreground hidden md:block">—</div>
                  <div className="sm:col-span-2 text-right flex-shrink-0">
                    {!selectionMode && (
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
                    )}
                  </div>
                </div>
              );
            })}

            {/* Files */}
            {files.map(file => (
              <div
                key={file.id}
                className={cn(
                  "px-3 md:px-4 py-3 flex sm:grid sm:grid-cols-12 gap-2 md:gap-4 items-center border-b border-border hover:bg-secondary/50 transition-colors",
                  selectedIds.has(file.id) && "bg-primary/5"
                )}
              >
                {selectionMode && (
                  <div className="sm:col-span-1 flex-shrink-0">
                    <Checkbox
                      checked={selectedIds.has(file.id)}
                      onCheckedChange={() => toggleSelection(file.id)}
                    />
                  </div>
                )}
                <div className={cn(
                  "flex items-center gap-2 md:gap-3 flex-1 min-w-0",
                  selectionMode ? "sm:col-span-5" : "sm:col-span-6"
                )}>
                  {getFileIcon(file.fileType)}
                  <span className="text-sm truncate">{file.name}</span>
                </div>
                <div className="col-span-2 text-sm text-muted-foreground hidden md:block">{file.modifiedDate}</div>
                <div className="col-span-2 text-sm text-muted-foreground hidden md:block">{file.size || '—'}</div>
                <div className="sm:col-span-2 text-right flex-shrink-0">
                  {!selectionMode && (
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
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Selection Summary */}
      {selectionMode && selectedIds.size > 0 && (
        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg flex items-center justify-between">
          <span className="text-sm">
            <strong>{selectedIds.size}</strong> item{selectedIds.size !== 1 ? 's' : ''} selected
          </span>
          <Button size="sm" variant="outline" onClick={() => setSelectedIds(new Set())}>
            Clear Selection
          </Button>
        </div>
      )}

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
