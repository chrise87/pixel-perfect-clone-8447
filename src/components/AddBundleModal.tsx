/**
 * AddBundleModal Component (Library Documents in UI)
 * 
 * DEVELOPER NOTES FOR INTEGRATION:
 * - This modal allows users to navigate library folder structure and select documents
 * - Similar UX to ComplianceReview folder picker
 * - Props to wire up:
 *   - open/onClose: modal visibility state
 *   - appliedBundles: array of Bundle objects already applied to the project
 *   - onAdd: callback to add a bundle
 *   - onRemove: callback to remove a bundle from the project
 * 
 * - Backend changes needed:
 *   - Replace mockLibraryFolders with API call to fetch library structure
 *   - Implement add/remove endpoints
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Bundle } from "@/types/project";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Folder, FileText, ChevronRight, ArrowLeft } from "lucide-react";

interface LibraryItem {
  id: string;
  name: string;
  type: 'folder' | 'document';
  parentId: string | null;
  documents?: number;
  country?: string;
  region?: string;
}

// Mock library folder structure - replace with API data
const mockLibraryFolders: LibraryItem[] = [
  // Root folders
  { id: 'uk', name: 'UK Standards', type: 'folder', parentId: null },
  { id: 'usa', name: 'USA Standards', type: 'folder', parentId: null },
  { id: 'eu', name: 'EU Standards', type: 'folder', parentId: null },
  
  // UK subfolders
  { id: 'uk-building-regs', name: 'Building Regulations', type: 'folder', parentId: 'uk' },
  { id: 'uk-fire-safety', name: 'Fire Safety', type: 'folder', parentId: 'uk' },
  { id: 'uk-sustainability', name: 'Sustainability', type: 'folder', parentId: 'uk' },
  
  // UK Building Regulations documents
  { id: 'part-a', name: 'Part A - Structure', type: 'document', parentId: 'uk-building-regs', country: 'UK', region: 'England' },
  { id: 'part-b', name: 'Part B - Fire Safety', type: 'document', parentId: 'uk-building-regs', country: 'UK', region: 'England' },
  { id: 'part-l', name: 'Part L - Conservation of Fuel', type: 'document', parentId: 'uk-building-regs', country: 'UK', region: 'England' },
  { id: 'part-m', name: 'Part M - Access', type: 'document', parentId: 'uk-building-regs', country: 'UK', region: 'England' },
  { id: 'part-o', name: 'Part O - Overheating', type: 'document', parentId: 'uk-building-regs', country: 'UK', region: 'England' },
  
  // UK Fire Safety documents
  { id: 'bs-9991', name: 'BS 9991 - Fire Safety Residential', type: 'document', parentId: 'uk-fire-safety', country: 'UK', region: 'National' },
  { id: 'bs-9999', name: 'BS 9999 - Fire Safety Non-Residential', type: 'document', parentId: 'uk-fire-safety', country: 'UK', region: 'National' },
  
  // UK Sustainability
  { id: 'breeam', name: 'BREEAM New Construction', type: 'document', parentId: 'uk-sustainability', country: 'UK', region: 'National' },
  { id: 'passivhaus', name: 'Passivhaus Standard', type: 'document', parentId: 'uk-sustainability', country: 'UK', region: 'International' },
  
  // USA subfolders
  { id: 'usa-ibc', name: 'International Building Code', type: 'folder', parentId: 'usa' },
  { id: 'usa-ada', name: 'ADA Compliance', type: 'folder', parentId: 'usa' },
  
  // USA IBC documents
  { id: 'ibc-2021', name: 'IBC 2021', type: 'document', parentId: 'usa-ibc', country: 'USA', region: 'National' },
  { id: 'ibc-fire', name: 'IBC Fire Code', type: 'document', parentId: 'usa-ibc', country: 'USA', region: 'National' },
  
  // USA ADA documents
  { id: 'ada-guidelines', name: 'ADA Guidelines', type: 'document', parentId: 'usa-ada', country: 'USA', region: 'National' },
  
  // EU documents
  { id: 'eu-cpd', name: 'Construction Products Directive', type: 'document', parentId: 'eu', country: 'EU', region: 'European' },
  { id: 'eu-epbd', name: 'Energy Performance of Buildings', type: 'document', parentId: 'eu', country: 'EU', region: 'European' },
];

interface AddBundleModalProps {
  open: boolean;
  onClose: () => void;
  appliedBundles: Bundle[];
  onAdd: (bundle: Bundle) => void;
  onRemove?: (bundleId: string) => void;
}

export function AddBundleModal({ open, onClose, appliedBundles, onAdd, onRemove }: AddBundleModalProps) {
  const [search, setSearch] = useState('');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  // Get current folder items
  const currentItems = mockLibraryFolders.filter(item => {
    const matchesParent = item.parentId === currentFolderId;
    const matchesSearch = search === '' || item.name.toLowerCase().includes(search.toLowerCase());
    return matchesParent && matchesSearch;
  });

  // Build breadcrumb path
  const getBreadcrumbs = () => {
    const breadcrumbs: LibraryItem[] = [];
    let current = currentFolderId;
    while (current) {
      const folder = mockLibraryFolders.find(f => f.id === current);
      if (folder) {
        breadcrumbs.unshift(folder);
        current = folder.parentId;
      } else {
        break;
      }
    }
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const handleToggleItem = (item: LibraryItem) => {
    if (item.type === 'folder') {
      // Navigate into folder
      setCurrentFolderId(item.id);
    } else {
      // Toggle document selection
      const isApplied = appliedBundles.some(b => b.id === item.id);
      if (isApplied) {
        onRemove?.(item.id);
      } else {
        onAdd({
          id: item.id,
          name: item.name,
          documents: 1,
          country: item.country || 'Unknown',
          region: item.region || 'Unknown'
        });
      }
    }
  };

  const handleSelectFolder = (item: LibraryItem) => {
    // Get all documents within this folder (recursively)
    const getDocumentsInFolder = (folderId: string): LibraryItem[] => {
      const children = mockLibraryFolders.filter(f => f.parentId === folderId);
      let docs: LibraryItem[] = [];
      children.forEach(child => {
        if (child.type === 'document') {
          docs.push(child);
        } else {
          docs = [...docs, ...getDocumentsInFolder(child.id)];
        }
      });
      return docs;
    };

    const folderDocs = getDocumentsInFolder(item.id);
    const allApplied = folderDocs.every(doc => appliedBundles.some(b => b.id === doc.id));

    if (allApplied) {
      // Remove all
      folderDocs.forEach(doc => onRemove?.(doc.id));
    } else {
      // Add all not yet added
      folderDocs.forEach(doc => {
        if (!appliedBundles.some(b => b.id === doc.id)) {
          onAdd({
            id: doc.id,
            name: doc.name,
            documents: 1,
            country: doc.country || 'Unknown',
            region: doc.region || 'Unknown'
          });
        }
      });
    }
  };

  const isFolderSelected = (folderId: string): boolean | 'partial' => {
    const getDocumentsInFolder = (fId: string): LibraryItem[] => {
      const children = mockLibraryFolders.filter(f => f.parentId === fId);
      let docs: LibraryItem[] = [];
      children.forEach(child => {
        if (child.type === 'document') {
          docs.push(child);
        } else {
          docs = [...docs, ...getDocumentsInFolder(child.id)];
        }
      });
      return docs;
    };

    const folderDocs = getDocumentsInFolder(folderId);
    if (folderDocs.length === 0) return false;
    
    const appliedCount = folderDocs.filter(doc => appliedBundles.some(b => b.id === doc.id)).length;
    if (appliedCount === 0) return false;
    if (appliedCount === folderDocs.length) return true;
    return 'partial';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Library Documents</DialogTitle>
        </DialogHeader>

        <div className="pt-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Navigate through the library and select documents to include in this project.
          </p>

          {/* Search */}
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Breadcrumbs */}
          <div className="flex items-center gap-1 text-sm">
            <button
              onClick={() => setCurrentFolderId(null)}
              className={cn(
                "hover:text-primary transition-colors",
                currentFolderId === null ? "text-foreground font-medium" : "text-muted-foreground"
              )}
            >
              Library
            </button>
            {breadcrumbs.map((crumb, idx) => (
              <div key={crumb.id} className="flex items-center gap-1">
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
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

          {/* Back button when inside a folder */}
          {currentFolderId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const currentFolder = mockLibraryFolders.find(f => f.id === currentFolderId);
                setCurrentFolderId(currentFolder?.parentId || null);
              }}
              className="gap-2 text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}

          {/* Folder/Document List */}
          <div className="flex flex-col gap-2 max-h-[350px] overflow-auto">
            {currentItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                {search ? 'No items match your search' : 'This folder is empty'}
              </p>
            ) : (
              currentItems.map(item => {
                const isDocument = item.type === 'document';
                const isApplied = isDocument && appliedBundles.some(b => b.id === item.id);
                const folderState = !isDocument ? isFolderSelected(item.id) : false;
                
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center gap-3 p-3 border rounded-lg transition-colors",
                      isApplied || folderState === true
                        ? "border-primary bg-primary/5"
                        : folderState === 'partial'
                        ? "border-primary/50 bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {/* Checkbox */}
                    <Checkbox
                      checked={isDocument ? isApplied : folderState === true}
                      className={folderState === 'partial' ? 'opacity-50' : ''}
                      onCheckedChange={() => {
                        if (isDocument) {
                          handleToggleItem(item);
                        } else {
                          handleSelectFolder(item);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />

                    {/* Icon & Name - clicking navigates for folders */}
                    <button
                      onClick={() => !isDocument && setCurrentFolderId(item.id)}
                      className={cn(
                        "flex items-center gap-3 flex-1 text-left",
                        !isDocument && "cursor-pointer hover:text-primary"
                      )}
                      disabled={isDocument}
                    >
                      {isDocument ? (
                        <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <Folder className="h-5 w-5 text-primary flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{item.name}</div>
                        {isDocument && item.country && (
                          <div className="text-xs text-muted-foreground">
                            {item.country} • {item.region}
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Navigate arrow for folders */}
                    {!isDocument && (
                      <button
                        onClick={() => setCurrentFolderId(item.id)}
                        className="p-1 hover:bg-secondary rounded"
                      >
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="flex justify-between items-center pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              {appliedBundles.length} document{appliedBundles.length !== 1 ? 's' : ''} selected
            </p>
            <Button onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
