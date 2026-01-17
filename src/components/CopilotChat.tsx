import { ArrowLeft, Send, Sparkles, Database, Library, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Project } from "@/types/project";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface CopilotChatProps {
  project: Project;
  onBack: () => void;
}

export function CopilotChat({ project, onBack }: CopilotChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: `Hello! I'm your project Copilot for **${project.name}**. I have access to your project documents and the applied library bundles. How can I help you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [roleFilterEnabled, setRoleFilterEnabled] = useState(true);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputValue('');

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I'm currently in demo mode. In the full version, I would analyze your project documents and library bundles to provide relevant answers based on your role filter settings.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

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
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Project Copilot
              </h1>
              <p className="text-sm text-muted-foreground">
                AI assistant with access to project data
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
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
                      "max-w-[80%] rounded-xl px-4 py-3",
                      message.role === 'user'
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={cn(
                      "text-[10px] mt-1",
                      message.role === 'user' ? "text-primary-foreground/60" : "text-muted-foreground"
                    )}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="max-w-3xl mx-auto">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about your project documents or standards..."
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button onClick={handleSend} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Data Sources */}
        <div className="w-72 border-l border-border p-4 overflow-auto">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Data Sources
          </h3>

          {/* Role Filter Toggle */}
          <Card className="p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <p className="font-medium">Role Filter</p>
                <p className="text-xs text-muted-foreground">Filter by your role</p>
              </div>
              <Switch checked={roleFilterEnabled} onCheckedChange={setRoleFilterEnabled} />
            </div>
          </Card>

          {/* Project Documents */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
              <Database className="h-3.5 w-3.5" />
              PROJECT DOCUMENTS
            </div>
            <Card className="p-3">
              <p className="text-sm font-medium">{project.projectDocuments.length} documents</p>
              <p className="text-xs text-muted-foreground">Auto-linked from project</p>
            </Card>
          </div>

          {/* Library Bundles */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
              <Library className="h-3.5 w-3.5" />
              LIBRARY BUNDLES
            </div>
            <div className="space-y-2">
              {project.appliedBundles.map(bundle => (
                <Card key={bundle.id} className="p-3">
                  <p className="text-sm font-medium">{bundle.name}</p>
                  <p className="text-xs text-muted-foreground">{bundle.documents} documents</p>
                </Card>
              ))}
              {project.appliedBundles.length === 0 && (
                <p className="text-xs text-muted-foreground">No bundles applied</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
