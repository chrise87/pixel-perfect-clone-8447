import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { availableBundles } from "@/data/constants";
import { Bundle } from "@/types/project";
import { useState } from "react";

interface AddBundleModalProps {
  open: boolean;
  onClose: () => void;
  appliedBundles: Bundle[];
  onAdd: (bundle: Bundle) => void;
}

export function AddBundleModal({ open, onClose, appliedBundles, onAdd }: AddBundleModalProps) {
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');

  const filteredBundles = availableBundles.filter(bundle => {
    const matchesSearch = bundle.name.toLowerCase().includes(search.toLowerCase());
    const matchesCountry = countryFilter === 'all' || bundle.country === countryFilter;
    return matchesSearch && matchesCountry;
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Add Library Bundles</DialogTitle>
        </DialogHeader>

        <div className="pt-4 space-y-4">
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
              placeholder="Search bundles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
          </div>

          {/* Bundle List */}
          <div className="flex flex-col gap-2 max-h-[400px] overflow-auto">
            {filteredBundles.map(bundle => {
              const isApplied = appliedBundles.some(b => b.id === bundle.id);
              return (
                <div
                  key={bundle.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div>
                    <div className="text-sm font-medium text-foreground">{bundle.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {bundle.documents} documents • {bundle.country} • {bundle.region}
                    </div>
                  </div>
                  <Button
                    variant={isApplied ? "secondary" : "secondary"}
                    size="sm"
                    onClick={() => !isApplied && onAdd(bundle)}
                    disabled={isApplied}
                    className={isApplied ? "bg-success/10 text-success" : "bg-accent text-primary hover:bg-accent/80"}
                  >
                    {isApplied ? '✓ Applied' : '+ Add'}
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
