import { BuildingType, StageFramework, UserRole, PermissionLevel, Bundle, PlatformUser } from "@/types/project";

export const buildingTypes: BuildingType[] = [
  { id: 'residential', label: 'Residential', icon: '🏠', subcategories: [] },
  { 
    id: 'commercial', 
    label: 'Commercial', 
    icon: '🏢',
    subcategories: [
      { id: 'office', label: 'Office Buildings' },
      { id: 'retail', label: 'Retail' },
      { id: 'industrial', label: 'Industrial' },
      { id: 'healthcare', label: 'Healthcare' },
      { id: 'hospitality', label: 'Hospitality' },
      { id: 'leisure', label: 'Leisure' },
    ]
  },
  { 
    id: 'mixed', 
    label: 'Mixed Use', 
    icon: '🏙️',
    subcategories: [
      { id: 'residential', label: 'Residential' },
      { id: 'office', label: 'Office Buildings' },
      { id: 'retail', label: 'Retail' },
      { id: 'industrial', label: 'Industrial' },
      { id: 'healthcare', label: 'Healthcare' },
      { id: 'hospitality', label: 'Hospitality' },
      { id: 'leisure', label: 'Leisure' },
    ]
  },
  { id: 'datacentre', label: 'Data Centres', icon: '🖥️', subcategories: [] },
];

export const stageFrameworks: Record<string, StageFramework> = {
  riba: {
    name: 'RIBA Plan of Work (UK)',
    stages: [
      { id: '0', name: 'Strategic Definition' },
      { id: '1', name: 'Preparation & Briefing' },
      { id: '2', name: 'Concept Design' },
      { id: '3', name: 'Spatial Coordination' },
      { id: '4', name: 'Technical Design' },
      { id: '5', name: 'Manufacturing & Construction' },
      { id: '6', name: 'Handover' },
      { id: '7', name: 'Use' },
    ]
  },
  aia: {
    name: 'AIA Phases (US)',
    stages: [
      { id: 'pre', name: 'Pre-Design' },
      { id: 'sd', name: 'Schematic Design' },
      { id: 'dd', name: 'Design Development' },
      { id: 'cd', name: 'Construction Documents' },
      { id: 'bid', name: 'Bidding & Negotiation' },
      { id: 'ca', name: 'Construction Administration' },
      { id: 'post', name: 'Post-Occupancy' },
    ]
  }
};

export const userRoles: UserRole[] = [
  { id: 'architect', label: 'Architect', category: 'Design Team' },
  { id: 'structural', label: 'Structural Engineer', category: 'Design Team' },
  { id: 'mep', label: 'M&E Engineer', category: 'Design Team' },
  { id: 'fire', label: 'Fire Engineer', category: 'Design Team' },
  { id: 'planning', label: 'Planning Consultant', category: 'Design Team' },
  { id: 'interior', label: 'Interior Designer', category: 'Design Team' },
  { id: 'landscape', label: 'Landscape Architect', category: 'Design Team' },
  { id: 'acoustic', label: 'Acoustic Consultant', category: 'Design Team' },
  { id: 'precon', label: 'Pre-construction Manager', category: 'Contractor' },
  { id: 'pm_contractor', label: 'Project Manager (Contractor)', category: 'Contractor' },
  { id: 'subcontractor', label: 'Subcontractor', category: 'Contractor' },
  { id: 'pm', label: 'Project Manager', category: 'Management' },
  { id: 'director', label: 'Project Director', category: 'Management' },
  { id: 'client', label: 'Client Representative', category: 'Client' },
];

export const permissionLevels: PermissionLevel[] = [
  { id: 'view', label: 'View', description: 'Can view project content' },
  { id: 'edit', label: 'Edit', description: 'Can edit documents and data' },
  { id: 'full', label: 'Full', description: 'Full access except admin functions' },
  { id: 'admin', label: 'Admin', description: 'Full access including user management' },
];

export const availableBundles: Bundle[] = [
  { id: 'ukad', name: 'UK Approved Documents', documents: 25, country: 'UK', region: 'Europe' },
  { id: 'adb', name: 'Approved Document B & Referenced Standards', documents: 95, country: 'UK', region: 'Europe' },
  { id: 'adc', name: 'Approved Document C & Referenced Standards', documents: 34, country: 'UK', region: 'Europe' },
  { id: 'adm', name: 'Approved Document M & Referenced Standards', documents: 17, country: 'UK', region: 'Europe' },
  { id: 'cibse', name: 'CIBSE Guides', documents: 33, country: 'UK', region: 'Europe' },
  { id: 'bsria', name: 'BSRIA Rule of Thumb', documents: 4, country: 'UK', region: 'Europe' },
  { id: 'fire', name: 'Fire Safety Engineering Solution Pack', documents: 7, country: 'UK', region: 'Europe' },
  { id: 'htm', name: 'Health Technical Memoranda (HTM) Suite', documents: 45, country: 'UK', region: 'Europe' },
  { id: 'ibc', name: 'International Building Code', documents: 12, country: 'USA', region: 'North America' },
  { id: 'nfpa', name: 'NFPA Standards', documents: 28, country: 'USA', region: 'North America' },
  { id: 'ashrae', name: 'ASHRAE Standards', documents: 15, country: 'USA', region: 'North America' },
];

export const platformUsers: PlatformUser[] = [
  { id: 101, name: 'David Park', email: 'david.park@example.com', initials: 'DP', color: '#8B5CF6' },
  { id: 102, name: 'Lisa Wong', email: 'lisa.wong@example.com', initials: 'LW', color: '#F59E0B' },
  { id: 103, name: 'James Taylor', email: 'james.taylor@example.com', initials: 'JT', color: '#10B981' },
  { id: 104, name: 'Emma Wilson', email: 'emma.wilson@example.com', initials: 'EW', color: '#EC4899' },
];

export const navItems = [
  { id: 'home', label: 'Home', icon: 'Home' },
  { id: 'copilot', label: 'Copilot', icon: 'MessageSquare' },
  { id: 'libraries', label: 'Libraries', icon: 'Library' },
  { id: 'projects', label: 'Projects', icon: 'FolderKanban' },
  { id: 'controls', label: 'Controls', icon: 'Settings2' },
  { id: 'admin', label: 'Admin', icon: 'UserCog' },
];
