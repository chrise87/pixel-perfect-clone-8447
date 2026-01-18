import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AppSidebar } from "@/components/AppSidebar";
import { ProjectList } from "@/components/ProjectList";
import { ProjectDashboard } from "@/components/ProjectDashboard";
import { NewProjectForm } from "@/components/NewProjectForm";
import { ProjectSettings } from "@/components/ProjectSettings";
import { ProjectDocuments } from "@/components/ProjectDocuments";
import { ProjectTasks } from "@/components/ProjectTasks";
import { CopilotChat } from "@/components/CopilotChat";
import { ComplianceReview } from "@/components/ComplianceReview";
import { NewReportWizard } from "@/components/NewReportWizard";
import { AddTaskModal } from "@/components/AddTaskModal";
import { AddCollaboratorModal } from "@/components/AddCollaboratorModal";
import { AddBundleModal } from "@/components/AddBundleModal";
import { Project, Collaborator, Bundle, Todo, FileItem } from "@/types/project";
import { sampleProjects } from "@/data/sampleProjects";
import { platformUsers } from "@/data/constants";
import { useUserPreferences } from "@/hooks/useUserPreferences";

type ViewType = 'list' | 'dashboard' | 'newProject' | 'settings' | 'documents' | 'tasks' | 'copilot' | 'complianceReview' | 'newReport';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeNav, setActiveNav] = useState('projects');
  const [projects, setProjects] = useState<Project[]>(sampleProjects);

  // User preferences for pins, collapsed sections, density
  const { 
    preferences, 
    togglePinProject, 
    toggleSection, 
    isSectionCollapsed, 
    setViewDensity 
  } = useUserPreferences();

  // Modal states
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskType, setTaskType] = useState<'personal' | 'global'>('personal');
  const [showAddCollaborator, setShowAddCollaborator] = useState(false);
  const [showAddBundle, setShowAddBundle] = useState(false);

  const handleNavChange = (nav: string) => {
    setActiveNav(nav);
    if (nav === 'projects') {
      setCurrentView('list');
    }
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('dashboard');
  };

  const handleCreateProject = (data: any) => {
    const newProject: Project = {
      id: Date.now(),
      name: data.name,
      buildingType: data.buildingType,
      buildingSubtype: data.buildingSubtype ? [data.buildingSubtype] : [],
      location: data.location,
      address: data.address,
      gia: data.gia,
      completionDate: data.completionDate,
      stageFramework: data.stageFramework,
      currentStage: data.currentStage,
      image: null,
      collaborators: [
        { id: 1, name: 'Chris Eliades', initials: 'CE', color: '#3B82F6', role: 'architect', permission: 'admin', isOwner: true, roleFilterEnabled: true, status: 'active' }
      ],
      projectDocuments: [],
      appliedBundles: [],
      personalTodos: [],
      globalTodos: [],
      files: [
        { id: 'drawings', name: 'Drawings', type: 'folder', parentId: null, modifiedDate: new Date().toISOString().split('T')[0] },
        { id: 'reports', name: 'Reports', type: 'folder', parentId: null, modifiedDate: new Date().toISOString().split('T')[0] },
        { id: 'reviews', name: 'Reviews', type: 'folder', parentId: null, modifiedDate: new Date().toISOString().split('T')[0] },
      ]
    };
    setProjects([...projects, newProject]);
    setCurrentView('list');
  };

  const updateSelectedProject = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
  };

  const handleAddTask = (task: { text: string; priority: string; due: string; assignee?: string }) => {
    if (!selectedProject) return;
    
    const updatedProjects = projects.map(p => {
      if (p.id === selectedProject.id) {
        if (taskType === 'personal') {
          return {
            ...p,
            personalTodos: [...p.personalTodos, { id: Date.now(), ...task, status: 'pending' as const }]
          };
        } else {
          return {
            ...p,
            globalTodos: [...p.globalTodos, { id: Date.now(), ...task, status: 'pending' as const }]
          };
        }
      }
      return p;
    });
    
    setProjects(updatedProjects);
    const updated = updatedProjects.find(p => p.id === selectedProject.id);
    if (updated) setSelectedProject(updated);
  };

  const handleUpdateTask = (taskId: number, type: 'personal' | 'global', updates: Partial<Todo>) => {
    if (!selectedProject) return;

    const updatedProjects = projects.map(p => {
      if (p.id === selectedProject.id) {
        if (type === 'personal') {
          return {
            ...p,
            personalTodos: p.personalTodos.map(t => t.id === taskId ? { ...t, ...updates } : t)
          };
        } else {
          return {
            ...p,
            globalTodos: p.globalTodos.map(t => t.id === taskId ? { ...t, ...updates } : t)
          };
        }
      }
      return p;
    });

    setProjects(updatedProjects);
    const updated = updatedProjects.find(p => p.id === selectedProject.id);
    if (updated) setSelectedProject(updated);
  };

  const handleAddCollaborator = (user: typeof platformUsers[0]) => {
    if (!selectedProject) return;
    
    const newCollaborator: Collaborator = {
      id: user.id,
      name: user.name,
      initials: user.initials,
      color: user.color,
      role: 'architect',
      permission: 'view',
      roleFilterEnabled: true,
      status: 'active'
    };

    const updatedProjects = projects.map(p => {
      if (p.id === selectedProject.id) {
        return {
          ...p,
          collaborators: [...p.collaborators, newCollaborator]
        };
      }
      return p;
    });
    
    setProjects(updatedProjects);
    const updated = updatedProjects.find(p => p.id === selectedProject.id);
    if (updated) setSelectedProject(updated);
  };

  const handleUpdateCollaborator = (collaboratorId: number, updates: Partial<Collaborator>) => {
    if (!selectedProject) return;

    const updatedProjects = projects.map(p => {
      if (p.id === selectedProject.id) {
        return {
          ...p,
          collaborators: p.collaborators.map(c => 
            c.id === collaboratorId ? { ...c, ...updates } : c
          )
        };
      }
      return p;
    });

    setProjects(updatedProjects);
    const updated = updatedProjects.find(p => p.id === selectedProject.id);
    if (updated) setSelectedProject(updated);
  };

  const handleRemoveCollaborator = (collaboratorId: number) => {
    if (!selectedProject) return;

    const updatedProjects = projects.map(p => {
      if (p.id === selectedProject.id) {
        return {
          ...p,
          collaborators: p.collaborators.filter(c => c.id !== collaboratorId)
        };
      }
      return p;
    });

    setProjects(updatedProjects);
    const updated = updatedProjects.find(p => p.id === selectedProject.id);
    if (updated) setSelectedProject(updated);
  };

const handleAddBundle = (bundle: Bundle) => {
    if (!selectedProject) return;
    
    const updatedProjects = projects.map(p => {
      if (p.id === selectedProject.id) {
        return {
          ...p,
          appliedBundles: [...p.appliedBundles, bundle]
        };
      }
      return p;
    });
    
    setProjects(updatedProjects);
    const updated = updatedProjects.find(p => p.id === selectedProject.id);
    if (updated) setSelectedProject(updated);
  };

  const handleRemoveBundle = (bundleId: string) => {
    if (!selectedProject) return;
    
    const updatedProjects = projects.map(p => {
      if (p.id === selectedProject.id) {
        return {
          ...p,
          appliedBundles: p.appliedBundles.filter(b => b.id !== bundleId)
        };
      }
      return p;
    });
    
    setProjects(updatedProjects);
    const updated = updatedProjects.find(p => p.id === selectedProject.id);
    if (updated) setSelectedProject(updated);
  };

  const handleUpdateFiles = (files: FileItem[]) => {
    if (!selectedProject) return;

    const updatedProjects = projects.map(p => {
      if (p.id === selectedProject.id) {
        return { ...p, files };
      }
      return p;
    });

    setProjects(updatedProjects);
    const updated = updatedProjects.find(p => p.id === selectedProject.id);
    if (updated) setSelectedProject(updated);
  };

  const handleSaveSettings = (updates: Partial<Project>) => {
    if (!selectedProject) return;

    const updatedProject = { ...selectedProject, ...updates };
    updateSelectedProject(updatedProject);
    setCurrentView('dashboard');
  };

  const openAddTask = (type: 'personal' | 'global') => {
    setTaskType(type);
    setShowAddTask(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <div className="flex flex-1">
        <AppSidebar activeNav={activeNav} onNavChange={handleNavChange} />
        
        {currentView === 'list' && (
          <ProjectList
            projects={projects}
            onSelectProject={handleSelectProject}
            onNewProject={() => setCurrentView('newProject')}
            pinnedProjects={preferences.pinnedProjects}
            onTogglePin={togglePinProject}
            viewDensity={preferences.viewDensity}
            onDensityChange={setViewDensity}
          />
        )}

        {currentView === 'newProject' && (
          <NewProjectForm
            onBack={() => setCurrentView('list')}
            onCreate={handleCreateProject}
          />
        )}

        {currentView === 'dashboard' && selectedProject && (
          <ProjectDashboard
            project={selectedProject}
            onBack={() => setCurrentView('list')}
            onAddCollaborator={() => setShowAddCollaborator(true)}
            onAddTask={openAddTask}
            onAddBundle={() => setShowAddBundle(true)}
            onOpenSettings={() => setCurrentView('settings')}
            onOpenDocuments={() => setCurrentView('documents')}
            onOpenTasks={() => setCurrentView('tasks')}
            onOpenCopilot={() => setCurrentView('copilot')}
            onOpenComplianceReview={() => setCurrentView('complianceReview')}
            onOpenNewReport={() => setCurrentView('newReport')}
            viewDensity={preferences.viewDensity}
            onDensityChange={setViewDensity}
            isSectionCollapsed={isSectionCollapsed}
            onToggleSection={toggleSection}
          />
        )}

        {currentView === 'settings' && selectedProject && (
          <ProjectSettings
            project={selectedProject}
            onBack={() => setCurrentView('dashboard')}
            onSave={handleSaveSettings}
            onAddCollaborator={() => setShowAddCollaborator(true)}
            onUpdateCollaborator={handleUpdateCollaborator}
            onRemoveCollaborator={handleRemoveCollaborator}
          />
        )}

        {currentView === 'documents' && selectedProject && (
          <ProjectDocuments
            project={selectedProject}
            onBack={() => setCurrentView('dashboard')}
            onUpdateFiles={handleUpdateFiles}
          />
        )}

        {currentView === 'tasks' && selectedProject && (
          <ProjectTasks
            project={selectedProject}
            onBack={() => setCurrentView('dashboard')}
            onAddTask={openAddTask}
            onUpdateTask={handleUpdateTask}
          />
        )}

        {currentView === 'copilot' && selectedProject && (
          <CopilotChat
            project={selectedProject}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'complianceReview' && selectedProject && (
          <ComplianceReview
            project={selectedProject}
            onBack={() => setCurrentView('dashboard')}
            onSaveToReviews={() => {}}
          />
        )}

        {currentView === 'newReport' && selectedProject && (
          <NewReportWizard
            project={selectedProject}
            onBack={() => setCurrentView('dashboard')}
            onCreate={(report) => {
              console.log('New report created:', report);
              setCurrentView('dashboard');
            }}
          />
        )}
      </div>

      {/* Modals */}
      {selectedProject && (
        <>
          <AddTaskModal
            open={showAddTask}
            onClose={() => setShowAddTask(false)}
            taskType={taskType}
            project={selectedProject}
            onAdd={handleAddTask}
          />
          <AddCollaboratorModal
            open={showAddCollaborator}
            onClose={() => setShowAddCollaborator(false)}
            onAdd={handleAddCollaborator}
          />
          <AddBundleModal
            open={showAddBundle}
            onClose={() => setShowAddBundle(false)}
            appliedBundles={selectedProject.appliedBundles}
            onAdd={handleAddBundle}
            onRemove={handleRemoveBundle}
          />
        </>
      )}
    </div>
  );
};

export default Index;
