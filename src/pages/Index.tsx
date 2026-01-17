import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AppSidebar } from "@/components/AppSidebar";
import { ProjectList } from "@/components/ProjectList";
import { ProjectDashboard } from "@/components/ProjectDashboard";
import { NewProjectForm } from "@/components/NewProjectForm";
import { AddTaskModal } from "@/components/AddTaskModal";
import { AddCollaboratorModal } from "@/components/AddCollaboratorModal";
import { AddBundleModal } from "@/components/AddBundleModal";
import { Project, Collaborator, Bundle } from "@/types/project";
import { sampleProjects } from "@/data/sampleProjects";
import { platformUsers } from "@/data/constants";

type ViewType = 'list' | 'dashboard' | 'newProject';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeNav, setActiveNav] = useState('projects');
  const [projects, setProjects] = useState<Project[]>(sampleProjects);

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
        { id: 1, name: 'Chris Eliades', initials: 'CE', color: '#3B82F6', role: 'architect', permission: 'admin', isOwner: true, roleFilterEnabled: true }
      ],
      projectDocuments: [],
      appliedBundles: [],
      personalTodos: [],
      globalTodos: []
    };
    setProjects([...projects, newProject]);
    setCurrentView('list');
  };

  const handleAddTask = (task: { text: string; priority: string; due: string; assignee?: string }) => {
    if (!selectedProject) return;
    
    const updatedProjects = projects.map(p => {
      if (p.id === selectedProject.id) {
        if (taskType === 'personal') {
          return {
            ...p,
            personalTodos: [...p.personalTodos, { id: Date.now(), ...task }]
          };
        } else {
          return {
            ...p,
            globalTodos: [...p.globalTodos, { id: Date.now(), ...task }]
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
      roleFilterEnabled: true
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
          />
        </>
      )}
    </div>
  );
};

export default Index;
