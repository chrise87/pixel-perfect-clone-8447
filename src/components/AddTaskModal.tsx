/**
 * AddTaskModal Component
 * 
 * DEVELOPER NOTES FOR INTEGRATION:
 * - This modal handles adding both personal and project tasks
 * - Props to wire up:
 *   - open/onClose: modal visibility state
 *   - taskType: 'personal' | 'global' - determines if this is a personal or project-wide task
 *   - project: Project data for accessing collaborators list
 *   - onAdd: callback to persist the task to your backend
 * 
 * - Multi-select assignees: The `assignees` field is now an array of strings
 * - Your backend should handle storing multiple assignees per task
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Project } from "@/types/project";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  taskType: 'personal' | 'global';
  project: Project;
  onAdd: (task: { text: string; priority: string; due: string; assignee?: string; assignees?: string[] }) => void;
}

export function AddTaskModal({ open, onClose, taskType, project, onAdd }: AddTaskModalProps) {
  const [task, setTask] = useState({ text: '', priority: 'medium', due: '' });
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);

  const toggleAssignee = (name: string) => {
    setSelectedAssignees(prev =>
      prev.includes(name)
        ? prev.filter(a => a !== name)
        : [...prev, name]
    );
  };

  const handleSubmit = () => {
    if (!task.text) return;
    onAdd({
      ...task,
      assignee: selectedAssignees.join(', ') || undefined,
      assignees: selectedAssignees.length > 0 ? selectedAssignees : undefined
    });
    setTask({ text: '', priority: 'medium', due: '' });
    setSelectedAssignees([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add {taskType === 'personal' ? 'Personal' : 'Project'} Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div>
            <Label className="mb-2 block">Task Description *</Label>
            <Textarea
              value={task.text}
              onChange={(e) => setTask({ ...task, text: e.target.value })}
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Priority</Label>
              <Select value={task.priority} onValueChange={(v) => setTask({ ...task, priority: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">Due Date</Label>
              <Input
                value={task.due}
                onChange={(e) => setTask({ ...task, due: e.target.value })}
                placeholder="e.g., Today, Tomorrow"
              />
            </div>
          </div>

          {/* Multi-select assignees for project tasks */}
          {taskType === 'global' && (
            <div>
              <Label className="mb-2 block">Assignees (select multiple)</Label>
              <div className="border border-border rounded-lg max-h-[200px] overflow-auto">
                {/* Team option */}
                <label className="flex items-center gap-3 p-3 hover:bg-secondary cursor-pointer border-b border-border">
                  <Checkbox
                    checked={selectedAssignees.includes('Team')}
                    onCheckedChange={() => toggleAssignee('Team')}
                  />
                  <span className="text-sm">Entire Team</span>
                </label>
                
                {/* Individual collaborators */}
                {project.collaborators.map(c => (
                  <label
                    key={c.id}
                    className="flex items-center gap-3 p-3 hover:bg-secondary cursor-pointer border-b border-border last:border-0"
                  >
                    <Checkbox
                      checked={selectedAssignees.includes(c.name)}
                      onCheckedChange={() => toggleAssignee(c.name)}
                    />
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white"
                      style={{ backgroundColor: c.color }}
                    >
                      {c.initials}
                    </div>
                    <span className="text-sm">{c.name}</span>
                  </label>
                ))}
              </div>
              {selectedAssignees.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Selected: {selectedAssignees.join(', ')}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!task.text}>
              Add Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
