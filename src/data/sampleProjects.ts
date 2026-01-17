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
      { id: 1, name: 'Chris Eliades', initials: 'CE', color: '#3B82F6', role: 'architect', permission: 'admin', isOwner: true, roleFilterEnabled: true, status: 'active' },
      { id: 2, name: 'Panos Veranoudis', initials: 'PV', color: '#D97706', role: 'structural', permission: 'full', roleFilterEnabled: true, status: 'active' },
      { id: 3, name: 'Sarah Chen', initials: 'SC', color: '#EC4899', role: 'fire', permission: 'edit', roleFilterEnabled: true, status: 'active' },
      { id: 4, name: 'Mike Roberts', initials: 'MR', color: '#22C55E', role: 'mep', permission: 'edit', roleFilterEnabled: false, status: 'active' },
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
      { id: 1, text: 'Review updated fire strategy section 4.2', priority: 'high', due: 'Today', status: 'pending', notes: 'Check section 4.2.3 for sprinkler coverage' },
      { id: 2, text: 'Approve material submittal - cladding', priority: 'medium', due: 'Tomorrow', status: 'pending' },
      { id: 3, text: 'Submit initial design review comments', priority: 'low', due: '2024-01-10', status: 'completed', notes: 'Completed on Jan 8' },
    ],
    globalTodos: [
      { id: 1, text: 'Stage 3 report due for client review', assignee: 'Team', due: 'Fri', priority: 'high', status: 'pending', notes: 'Client meeting scheduled for Monday' },
      { id: 2, text: 'Planning condition 7 discharge', assignee: 'Planning', due: 'Mon', priority: 'medium', status: 'pending' },
      { id: 3, text: 'Acoustic report submission', assignee: 'Acoustic', due: 'Wed', priority: 'low', status: 'completed' },
    ],
    files: [
      // Root folders
      { id: 'drawings', name: 'Drawings', type: 'folder', parentId: null, modifiedDate: '2024-01-15' },
      { id: 'reports', name: 'Reports', type: 'folder', parentId: null, modifiedDate: '2024-01-14' },
      { id: 'specifications', name: 'Specifications', type: 'folder', parentId: null, modifiedDate: '2024-01-10' },
      { id: 'correspondence', name: 'Correspondence', type: 'folder', parentId: null, modifiedDate: '2024-01-12' },
      { id: 'reviews', name: 'Reviews', type: 'folder', parentId: null, modifiedDate: '2024-01-16' },
      
      // Drawings subfolder and files
      { id: 'arch-drawings', name: 'Architectural', type: 'folder', parentId: 'drawings', modifiedDate: '2024-01-15' },
      { id: 'struct-drawings', name: 'Structural', type: 'folder', parentId: 'drawings', modifiedDate: '2024-01-14' },
      { id: 'ga-level-0', name: 'GA-Level-00.pdf', type: 'file', fileType: 'pdf', parentId: 'arch-drawings', size: '2.4 MB', modifiedDate: '2024-01-15', author: 'CE', status: 'Current', version: 'Rev C' },
      { id: 'ga-level-1', name: 'GA-Level-01.pdf', type: 'file', fileType: 'pdf', parentId: 'arch-drawings', size: '2.1 MB', modifiedDate: '2024-01-15', author: 'CE', status: 'Current', version: 'Rev C' },
      { id: 'sections', name: 'Sections-01.pdf', type: 'file', fileType: 'pdf', parentId: 'arch-drawings', size: '1.8 MB', modifiedDate: '2024-01-14', author: 'CE', status: 'In Review', version: 'Rev B' },
      { id: 'struct-calc', name: 'Structural-Calc.xlsx', type: 'file', fileType: 'xlsx', parentId: 'struct-drawings', size: '4.5 MB', modifiedDate: '2024-01-14', author: 'PV', status: 'Current', version: 'Rev E' },
      
      // Reports folder files
      { id: 'fire-strategy', name: 'Fire-Strategy-Report.pdf', type: 'file', fileType: 'pdf', parentId: 'reports', size: '8.2 MB', modifiedDate: '2024-01-14', author: 'SC', status: 'Current', version: 'Rev B' },
      { id: 'das-report', name: 'Design-Access-Statement.docx', type: 'file', fileType: 'docx', parentId: 'reports', size: '15.3 MB', modifiedDate: '2024-01-13', author: 'CE', status: 'Current', version: 'Rev D' },
      
      // Specifications
      { id: 'mep-spec', name: 'MEP-Specification.pdf', type: 'file', fileType: 'pdf', parentId: 'specifications', size: '3.2 MB', modifiedDate: '2024-01-10', author: 'MR', status: 'Draft', version: 'Rev A' },
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
      { id: 1, name: 'Alex Morgan', initials: 'AM', color: '#6366F1', role: 'architect', permission: 'admin', isOwner: true, roleFilterEnabled: true, status: 'active' },
    ],
    projectDocuments: [],
    appliedBundles: [],
    personalTodos: [],
    globalTodos: [],
    files: [
      { id: 'drawings', name: 'Drawings', type: 'folder', parentId: null, modifiedDate: '2024-01-10' },
      { id: 'reports', name: 'Reports', type: 'folder', parentId: null, modifiedDate: '2024-01-10' },
      { id: 'reviews', name: 'Reviews', type: 'folder', parentId: null, modifiedDate: '2024-01-10' },
    ]
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
      { id: 1, name: 'Jordan Smith', initials: 'JS', color: '#0EA5E9', role: 'architect', permission: 'admin', isOwner: true, roleFilterEnabled: true, status: 'active' },
    ],
    projectDocuments: [],
    appliedBundles: [],
    personalTodos: [],
    globalTodos: [],
    files: [
      { id: 'drawings', name: 'Drawings', type: 'folder', parentId: null, modifiedDate: '2024-01-08' },
      { id: 'reports', name: 'Reports', type: 'folder', parentId: null, modifiedDate: '2024-01-08' },
      { id: 'reviews', name: 'Reviews', type: 'folder', parentId: null, modifiedDate: '2024-01-08' },
    ]
  },
];
