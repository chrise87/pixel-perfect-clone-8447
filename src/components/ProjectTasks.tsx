import { ArrowLeft, Plus, Check, Clock, MoreVertical, MessageSquare, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Project, Todo } from "@/types/project";
import { PriorityBadge } from "@/components/PriorityBadge";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProjectTasksProps {
  project: Project;
  onBack: () => void;
  onAddTask: (type: 'personal' | 'global') => void;
  onUpdateTask: (taskId: number, type: 'personal' | 'global', updates: Partial<Todo>) => void;
}

export function ProjectTasks({ project, onBack, onAddTask, onUpdateTask }: ProjectTasksProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'personal' | 'project'>('all');
  const [expandedNote, setExpandedNote] = useState<number | null>(null);
  const [noteText, setNoteText] = useState('');

  // Combine and sort all todos
  const allTodos = [
    ...project.personalTodos.map(t => ({ ...t, source: 'personal' as const })),
    ...project.globalTodos.map(t => ({ ...t, source: 'global' as const })),
  ];

  const getFilteredTasks = () => {
    let tasks = allTodos;
    if (activeTab === 'personal') {
      tasks = allTodos.filter(t => t.source === 'personal');
    } else if (activeTab === 'project') {
      tasks = allTodos.filter(t => t.source === 'global');
    }
    return tasks;
  };

  const filteredTasks = getFilteredTasks();
  const pendingTasks = filteredTasks.filter(t => t.status !== 'completed');
  const completedTasks = filteredTasks.filter(t => t.status === 'completed');

  const handleToggleComplete = (task: typeof allTodos[0]) => {
    onUpdateTask(task.id, task.source, { 
      status: task.status === 'completed' ? 'pending' : 'completed' 
    });
  };

  const handleSaveNote = (task: typeof allTodos[0]) => {
    onUpdateTask(task.id, task.source, { notes: noteText });
    setExpandedNote(null);
    setNoteText('');
  };

  const TaskRow = ({ task }: { task: typeof allTodos[0] }) => (
    <div 
      className={cn(
        "border-b border-border last:border-0",
        task.status === 'completed' && "opacity-60"
      )}
    >
      <div className="px-4 py-3 grid grid-cols-12 gap-4 items-center">
        {/* Checkbox + Task */}
        <div className="col-span-5 flex items-start gap-3">
          <Checkbox 
            checked={task.status === 'completed'}
            onCheckedChange={() => handleToggleComplete(task)}
            className="mt-0.5"
          />
          <div>
            <p className={cn(
              "text-sm",
              task.status === 'completed' && "line-through text-muted-foreground"
            )}>
              {task.text}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <PriorityBadge priority={task.priority} />
              <Badge variant="outline" className="text-[10px]">
                {task.source === 'personal' ? 'Personal' : 'Project'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Due Date */}
        <div className="col-span-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {task.due}
        </div>

        {/* Assignee */}
        <div className="col-span-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <User className="h-3.5 w-3.5" />
          {task.assignee || 'You'}
        </div>

        {/* Notes indicator */}
        <div className="col-span-2">
          {task.notes && (
            <button 
              onClick={() => {
                setExpandedNote(expandedNote === task.id ? null : task.id);
                setNoteText(task.notes || '');
              }}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              View note
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="col-span-1 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                setExpandedNote(task.id);
                setNoteText(task.notes || '');
              }}>
                <MessageSquare className="h-4 w-4 mr-2" />
                {task.notes ? 'Edit Note' : 'Add Note'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleToggleComplete(task)}>
                {task.status === 'completed' ? (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Mark Pending
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Mark Complete
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Expanded Note Section */}
      {expandedNote === task.id && (
        <div className="px-4 pb-4 pl-12">
          <div className="bg-secondary/50 rounded-lg p-3">
            <Textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a note or comment..."
              className="min-h-[80px] text-sm"
            />
            <div className="flex gap-2 mt-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setExpandedNote(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => handleSaveNote(task)}>
                Save Note
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

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
              Tasks
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage all project and personal tasks
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onAddTask('personal')} className="gap-1.5">
              <Plus className="h-4 w-4" />
              Personal Task
            </Button>
            <Button size="sm" onClick={() => onAddTask('global')} className="gap-1.5">
              <Plus className="h-4 w-4" />
              Project Task
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Tasks ({allTodos.length})</TabsTrigger>
          <TabsTrigger value="personal">Personal ({project.personalTodos.length})</TabsTrigger>
          <TabsTrigger value="project">Project ({project.globalTodos.length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Pending Tasks */}
      <Card className="mb-6 overflow-hidden">
        <div className="px-4 py-3 bg-secondary flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-warning" />
            <h2 className="text-sm font-semibold">Pending ({pendingTasks.length})</h2>
          </div>
        </div>
        
        {/* Table Header */}
        <div className="px-4 py-2 bg-muted/30 grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground border-b border-border">
          <div className="col-span-5">Task</div>
          <div className="col-span-2">Due Date</div>
          <div className="col-span-2">Assigned To</div>
          <div className="col-span-2">Notes</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {pendingTasks.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Check className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No pending tasks</p>
          </div>
        ) : (
          pendingTasks.map(task => <TaskRow key={`${task.source}-${task.id}`} task={task} />)
        )}
      </Card>

      {/* Completed Tasks */}
      <Card className="overflow-hidden">
        <div className="px-4 py-3 bg-secondary flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-success" />
            <h2 className="text-sm font-semibold">Completed ({completedTasks.length})</h2>
          </div>
        </div>

        {/* Table Header */}
        <div className="px-4 py-2 bg-muted/30 grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground border-b border-border">
          <div className="col-span-5">Task</div>
          <div className="col-span-2">Due Date</div>
          <div className="col-span-2">Assigned To</div>
          <div className="col-span-2">Notes</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {completedTasks.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p className="text-sm">No completed tasks yet</p>
          </div>
        ) : (
          completedTasks.map(task => <TaskRow key={`${task.source}-${task.id}`} task={task} />)
        )}
      </Card>
    </main>
  );
}
