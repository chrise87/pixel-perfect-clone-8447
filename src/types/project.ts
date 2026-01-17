export interface Collaborator {
  id: number;
  name: string;
  initials: string;
  color: string;
  role: string;
  permission: string;
  isOwner?: boolean;
  roleFilterEnabled: boolean;
}

export interface ProjectDocument {
  id: number;
  name: string;
  type: string;
  status: string;
  version: string;
  author: string;
}

export interface Bundle {
  id: string;
  name: string;
  documents: number;
  country?: string;
  region?: string;
}

export interface Todo {
  id: number;
  text: string;
  priority: string;
  due: string;
  assignee?: string;
}

export interface Project {
  id: number;
  name: string;
  buildingType: string;
  buildingSubtype: string[];
  location: string;
  address: string;
  gia: string;
  completionDate: string;
  stageFramework: string;
  currentStage: string;
  image: string | null;
  collaborators: Collaborator[];
  projectDocuments: ProjectDocument[];
  appliedBundles: Bundle[];
  personalTodos: Todo[];
  globalTodos: Todo[];
}

export interface BuildingType {
  id: string;
  label: string;
  icon: string;
  subcategories: { id: string; label: string }[];
}

export interface Stage {
  id: string;
  name: string;
}

export interface StageFramework {
  name: string;
  stages: Stage[];
}

export interface UserRole {
  id: string;
  label: string;
  category: string;
}

export interface PermissionLevel {
  id: string;
  label: string;
  description: string;
}

export interface PlatformUser {
  id: number;
  name: string;
  email: string;
  initials: string;
  color: string;
}
