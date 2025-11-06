typescript
// Define possible status values for type safety
type ProjectStatus = 'Planning' | 'Active' | 'Completed' | 'On Hold' | 'Canceled';

interface Client {
  id: string;
  name: string;
}

interface Project {
  id: string; // e.g., 'proj_12345' (UUID)
  projectCode: string; // e.g., 'PROJ-2025-001'
  name: string; // e.g., 'Customer Portal Redesign'
  client: Client;
  startDate: string; // ISO 8601 format: '2025-03-10T00:00:00Z'
  sprints: number;
  teamSize: number;
  status: ProjectStatus;
  lastUpdatedAt: string; // ISO 8601 format
}

// Sample Data
const sampleProject: Project = {
  id: 'proj_abcde',
  projectCode: 'PROJ-2025-002',
  name: 'Mobile App Development',
  client: { id: 'client_xyz', name: 'TechStart Inc' },
  startDate: '2025-01-20T00:00:00Z',
  sprints: 12,
  teamSize: 6,
  status: 'Planning',
  lastUpdatedAt: '2024-10-15T14:30:00Z',
};