/**
 * AddBundleModal Component (renamed to Library Documents in UI)
 * 
 * DEVELOPER NOTES FOR INTEGRATION:
 * - This modal allows users to toggle library bundles (documents) on/off for a project
 * - Props to wire up:
 *   - open/onClose: modal visibility state
 *   - appliedBundles: array of Bundle objects already applied to the project
 *   - onAdd: callback to add a bundle (your backend should add to project.appliedBundles)
 *   - onRemove: NEW callback to remove a bundle from the project
 * 
 * - Backend changes needed:
 *   - Implement bundle removal endpoint
 *   - The availableBundles list should come from your backend library service
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { availableBundles } from "@/data/constants";
import { Bundle } from "@/types/project";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AddBundleModalProps {
  open: boolean;
  onClose: () => void;
  appliedBundles: Bundle[];
  onAdd: (bundle: Bundle) => void;
  onRemove?: (bundleId: string) => void;
}

export function AddBundleModal({ open, onClose, appliedBundles, onAdd, onRemove }: AddBundleModalProps) {
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');

  const filteredBundles = availableBundles.filter(bundle => {
    const matchesSearch = bundle.name.toLowerCase().includes(search.toLowerCase());
    const matchesCountry = countryFilter === 'all' || bundle.country === countryFilter;
    return matchesSearch && matchesCountry;
  });

  const handleToggleBundle = (bundle: Bundle) => {
    const isApplied = appliedBundles.some(b => b.id === bundle.id);
    if (isApplied) {
      onRemove?.(bundle.id);
    } else {
      onAdd(bundle);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Library Documents</DialogTitle>
        </DialogHeader>

        <div className="pt-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Select the library documents to include in this project. Check to add, uncheck to remove.
          </p>

          {/* Filters */}
          <div className="flex gap-3">
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="UK">UK</SelectItem>
                <SelectItem value="USA">USA</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Search library documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
          </div>

          {/* Bundle List with Checkboxes */}
          <div className="flex flex-col gap-2 max-h-[400px] overflow-auto">
            {filteredBundles.map(bundle => {
              const isApplied = appliedBundles.some(b => b.id === bundle.id);
              return (
                <label
                  key={bundle.id}
                  className={cn(
                    "flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors",
                    isApplied
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <Checkbox
                    checked={isApplied}
                    onCheckedChange={() => handleToggleBundle(bundle)}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">{bundle.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {bundle.documents} documents • {bundle.country} • {bundle.region}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-2">
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
