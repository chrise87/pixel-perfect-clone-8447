import { Project } from "@/types/project";

export const sampleProjects: Project[] = [
  {
    id: 1,
    name: 'Riverside Tower',
    buildingType: 'mixed',
    buildingSubtype: ['residential', 'office', 'retail'],
    location: 'London, UK',
    address: '123 Thames Street, London, EC2A 1AB',
    gia: '45,000 m²',
    completionDate: '2026-12-31',
    stageFramework: 'riba',
    currentStage: '3',
    image: null,
    collaborators: [
      { id: 1, name: 'Chris Eliades', initials: 'CE', color: '#3B82F6', role: 'architect', permission: 'admin', isOwner: true, roleFilterEnabled: true },
      { id: 2, name: 'Panos Veranoudis', initials: 'PV', color: '#D97706', role: 'structural', permission: 'full', roleFilterEnabled: true },
      { id: 3, name: 'Sarah Chen', initials: 'SC', color: '#EC4899', role: 'fire', permission: 'edit', roleFilterEnabled: true },
      { id: 4, name: 'Mike Roberts', initials: 'MR', color: '#22C55E', role: 'mep', permission: 'edit', roleFilterEnabled: false },
    ],
    projectDocuments: [
      { id: 1, name: 'Design & Access Statement', type: 'Report', status: 'Current', version: 'Rev D', author: 'Design Team' },
      { id: 2, name: 'GA Drawings - All Levels', type: 'Drawing', status: 'In Review', version: 'Rev C', author: 'Architect' },
      { id: 3, name: 'Fire Strategy Report', type: 'Technical Report', status: 'Current', version: 'Rev B', author: 'Fire Engineer' },
      { id: 4, name: 'Structural Calculations', type: 'Calculations', status: 'Approved', version: 'Rev E', author: 'Structural' },
      { id: 5, name: 'M&E Specifications', type: 'Specification', status: 'Draft', version: 'Rev A', author: 'M&E' },
    ],
    appliedBundles: [
      { id: 'ukad', name: 'UK Approved Documents', documents: 25 },
      { id: 'adb', name: 'Approved Document B & Referenced Standards', documents: 95 },
      { id: 'cibse', name: 'CIBSE Guides', documents: 33 },
    ],
    personalTodos: [
      { id: 1, text: 'Review updated fire strategy section 4.2', priority: 'high', due: 'Today' },
      { id: 2, text: 'Approve material submittal - cladding', priority: 'medium', due: 'Tomorrow' },
    ],
    globalTodos: [
      { id: 1, text: 'Stage 3 report due for client review', assignee: 'Team', due: 'Fri', priority: 'high' },
      { id: 2, text: 'Planning condition 7 discharge', assignee: 'Planning', due: 'Mon', priority: 'medium' },
    ]
  },
  {
    id: 2,
    name: 'Canada Life Building',
    buildingType: 'commercial',
    buildingSubtype: ['office'],
    location: 'Manchester, UK',
    address: '45 Deansgate, Manchester, M3 2BA',
    gia: '28,500 m²',
    completionDate: '2025-06-30',
    stageFramework: 'riba',
    currentStage: '4',
    image: null,
    collaborators: [
      { id: 1, name: 'Alex Morgan', initials: 'AM', color: '#6366F1', role: 'architect', permission: 'admin', isOwner: true, roleFilterEnabled: true },
    ],
    projectDocuments: [],
    appliedBundles: [],
    personalTodos: [],
    globalTodos: []
  },
  {
    id: 3,
    name: 'CISCO Innovation Hub',
    buildingType: 'commercial',
    buildingSubtype: ['office'],
    location: 'San Jose, USA',
    address: '170 West Tasman Drive, San Jose, CA 95134',
    gia: '15,000 m²',
    completionDate: '2025-09-15',
    stageFramework: 'aia',
    currentStage: 'dd',
    image: null,
    collaborators: [
      { id: 1, name: 'Jordan Smith', initials: 'JS', color: '#0EA5E9', role: 'architect', permission: 'admin', isOwner: true, roleFilterEnabled: true },
    ],
    projectDocuments: [],
    appliedBundles: [],
    personalTodos: [],
    globalTodos: []
  },
];
