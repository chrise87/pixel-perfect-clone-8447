import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Project } from "@/types/project";
import { useState } from "react";

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  taskType: 'personal' | 'global';
  project: Project;
  onAdd: (task: { text: string; priority: string; due: string; assignee?: string }) => void;
}

export function AddTaskModal({ open, onClose, taskType, project, onAdd }: AddTaskModalProps) {
  const [task, setTask] = useState({ text: '', priority: 'medium', due: '', assignee: '' });

  const handleSubmit = () => {
    if (!task.text) return;
    onAdd(task);
    setTask({ text: '', priority: 'medium', due: '', assignee: '' });
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

          {taskType === 'global' && (
            <div>
              <Label className="mb-2 block">Assignee</Label>
              <Select value={task.assignee} onValueChange={(v) => setTask({ ...task, assignee: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Team">Team</SelectItem>
                  {project.collaborators.map(c => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
