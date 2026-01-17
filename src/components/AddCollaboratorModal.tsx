import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/Avatar";
import { platformUsers } from "@/data/constants";

interface AddCollaboratorModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (user: typeof platformUsers[0]) => void;
}

export function AddCollaboratorModal({ open, onClose, onAdd }: AddCollaboratorModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>

        <div className="pt-4 space-y-5">
          {/* Platform Users */}
          <div>
            <Label className="mb-2 block">Select from Platform</Label>
            <div className="flex flex-col gap-2 max-h-[200px] overflow-auto">
              {platformUsers.map(user => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar initials={user.initials} color={user.color} size="md" />
                    <div>
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => onAdd(user)}
                    className="bg-accent text-primary hover:bg-accent/80"
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Invite by Email */}
          <div>
            <Label className="mb-2 block">Or Invite by Email</Label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email address"
                className="flex-1"
              />
              <Button variant="outline">
                Send Invite
              </Button>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
