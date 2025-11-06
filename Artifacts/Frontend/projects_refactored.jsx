typescript
import React from 'react';
import { Search, ChevronDown, Plus, MoreVertical } from 'lucide-react';

// TypeScript types for our project data
type ProjectStatus = 'Active' | 'Planning' | 'On Hold' | 'Closed';

interface Project {
  id: string;
  name: string;
  isLink: boolean;
  manager: {
    name: string;
    avatarUrl: string;
  };
  sprints: number;
  status: ProjectStatus;
  actionsCount: number;
}

// Mock data
const projectsData: Project[] = [
  { id: 'PROJ-2024-001', name: 'PROJ-2024-001', isLink: true, manager: { name: 'Acme Corp', avatarUrl: 'https://i.pravatar.cc/150?u=acme' }, sprints: 5, status: 'Active', actionsCount: 2 },
  { id: '2', name: 'Customer Portal Redesign', isLink: false, manager: { name: 'John Smith', avatarUrl: 'https://i.pravatar.cc/150?u=john' }, sprints: 8, status: 'Active', actionsCount: 8 },
  { id: '3', name: 'Mobile App Development', isLink: false, manager: { name: 'Beta Solutions', avatarUrl: 'https://i.pravatar.cc/150?u=beta' }, sprints: 3, status: 'Planning', actionsCount: 10 },
  { id: '4', name: 'Website Revvap', isLink: false, manager: { name: 'Garma Tech', avatarUrl: 'https://i.pravatar.cc/150?u=garma' }, sprints: 3, status: 'Active', actionsCount: 4 },
  { id: '5', name: 'Website Revnap', isLink: false, manager: { name: 'Peter Chan', avatarUrl: 'https://i.pravatar.cc/150?u=peter' }, sprints: 5, status: 'Closed', actionsCount: 6 },
  { id: 'PROJ-2023-010', name: 'PROJ-2023-010', isLink: true, manager: { name: 'Amy Liu', avatarUrl: 'https://i.pravatar.cc/150?u=amy' }, sprints: 4, status: 'Closed', actionsCount: 7 },
  { id: '7', name: 'Internal Tool Upgrade', isLink: false, manager: { name: 'Innovate Inc', avatarUrl: 'https://i.pravatar.cc/150?u=innovate' }, sprints: 6, status: 'Closed', actionsCount: 6 },
  { id: '8', name: 'API Integration', isLink: false, manager: { name: 'Global Corp', avatarUrl: 'https://i.pravatar.cc/150?u=global' }, sprints: 6, status: 'On Hold', actionsCount: 9 },
  { id: 'PROJ-2023-015', name: 'PROJ-2023-015', isLink: true, manager: { name: 'Sarah Brown', avatarUrl: 'https://i.pravatar.cc/150?u=sarah' }, sprints: 7, status: 'Active', actionsCount: 5 },
  { id: '10', name: 'Data Analytics Platform', isLink: false, manager: { name: 'Data Driven LLC', avatarUrl: 'https://i.pravatar.cc/150?u=data' }, sprints: 6, status: 'Planning', actionsCount: 6 },
  { id: 'PROJ-2022-040', name: 'PROJ-2022-040', isLink: true, manager: { name: 'Tom Green', avatarUrl: 'https://i.pravatar.cc/150?u=tom' }, sprints: 2, status: 'Active', actionsCount: 2 },
  { id: '12', name: 'Legacy System Sunset', isLink: false, manager: { name: 'Old School Co', avatarUrl: 'https://i.pravatar.cc/150?u=old' }, sprints: 2, status: 'Closed', actionsCount: 3 },
];

// --- Reusable UI Components ---

const StatusBadge: React.FC<{ status: ProjectStatus }> = ({ status }) => {
  const baseClasses = 'px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full';
  const statusClasses: Record<ProjectStatus, string> = {
    'Active': 'bg-green-100 text-green-800',
    'Planning': 'bg-yellow-100 text-yellow-800',
    'On Hold': 'bg-yellow-100 text-yellow-800',
    'Closed': 'bg-green-100 text-green-800',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

interface FilterDropdownProps {
  label: string;
  value: string;
  hasChevron?: boolean;
}
const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, value, hasChevron = true }) => (
    <div>
        <label className="text-xs font-medium text-gray-500">{label}</label>
        <div className="flex items-center gap-1">
            <span className="text-sm text-gray-800">{value}</span>
            {hasChevron && <ChevronDown className="h-4 w-4 text-gray-500" />}
        </div>
    </div>
);

interface SearchInputProps {
  placeholder: string;
  variant: 'header' | 'toolbar';
}
const SearchInput: React.FC<SearchInputProps> = ({ placeholder, variant }) => {
    const isHeader = variant === 'header';
    return (
        <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ${isHeader ? 'h-5 w-5' : 'h-4 w-4'}`} />
            <input
                type="text"
                placeholder={placeholder}
                className={`text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${isHeader ? 'pl-10 pr-4 py-2 w-64' : 'pl-9 pr-3 py-2 w-72'}`}
            />
        </div>
    );
};

interface UserProfileProps {
    name: string;
    avatarUrl: string;
}
const UserProfile: React.FC<UserProfileProps> = ({ name, avatarUrl }) => (
    <div className="flex items-center space-x-2">
        <img className="h-8 w-8 rounded-full" src={avatarUrl} alt={name} />
        <span className="text-sm font-medium text-gray-700">{name}</span>
        <ChevronDown className="h-5 w-5 text-gray-500" />
    </div>
);

interface PrimaryButtonProps {
    children: React.ReactNode;
    icon: React.ElementType;
}
const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, icon: Icon }) => (
    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        <Icon className="h-5 w-5" />
        {children}
    </button>
);

// --- Table Cell Components ---

interface ProjectNameCellProps { name: string; isLink: boolean; }
const ProjectNameCell: React.FC<ProjectNameCellProps> = ({ name, isLink }) => (
    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
        {isLink ? (
            <a href="#" className="text-blue-600 hover:underline">{name}</a>
        ) : (
            name
        )}
    </td>
);

interface ManagerCellProps { manager: Project['manager']; }
const ManagerCell: React.FC<ManagerCellProps> = ({ manager }) => (
    <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-2">
            <img className="h-6 w-6 rounded-full" src={manager.avatarUrl} alt={manager.name} />
            <span className="text-gray-800">{manager.name}</span>
        </div>
    </td>
);

interface ActionsCellProps { count: number; }
const ActionsCell: React.FC<ActionsCellProps> = ({ count }) => (
    <td className="px-4 py-3">
        <div className="flex items-center gap-3">
            <div className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                {count}
            </div>
            <button aria-label="More options">
                <MoreVertical className="h-5 w-5 text-gray-500 hover:text-gray-800" />
            </button>
        </div>
    </td>
);

// --- Table Row Component ---

interface ProjectRowProps { project: Project; }
const ProjectRow: React.FC<ProjectRowProps> = ({ project }) => (
    <tr className="hover:bg-gray-50">
        <ProjectNameCell name={project.name} isLink={project.isLink} />
        <ManagerCell manager={project.manager} />
        <td className="px-4 py-3 text-gray-800">{project.sprints}</td>
        <td className="px-4 py-3"><StatusBadge status={project.status} /></td>
        <ActionsCell count={project.actionsCount} />
    </tr>
);

// --- Larger Layout Components ---

const AppHeader: React.FC = () => (
    <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-8">
                    <h1 className="text-xl font-bold text-blue-600">StaffAlloc</h1>
                    <nav className="hidden md:flex space-x-6">
                        <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-700">Dashboard</a>
                        <a href="#" className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1">Projects</a>
                        <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-700">Employees</a>
                        <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-700">Reports</a>
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                    <SearchInput placeholder="Search projects..." variant="header" />
                    <UserProfile name="Jane Doe" avatarUrl="https://i.pravatar.cc/150?u=jane" />
                </div>
            </div>
        </div>
    </header>
);

const ProjectsCardHeader: React.FC = () => (
    <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
                <p className="mt-1 text-sm text-gray-500">Manage and track all project allocations</p>
            </div>
            <PrimaryButton icon={Plus}>Create New Project</PrimaryButton>
        </div>
    </div>
);

interface ProjectsToolbarProps { projectCount: number; }
const ProjectsToolbar: React.FC<ProjectsToolbarProps> = ({ projectCount }) => (
    <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
            <SearchInput placeholder="Search projects..." variant="toolbar" />
            <FilterDropdown label="Status" value="All Active" />
            <FilterDropdown label="Manager" value="All Select Manager" />
            <FilterDropdown label="Date Range" value="On Hold" hasChevron={false} />
        </div>
        <span className="text-sm text-gray-600">Showing {projectCount} projects</span>
    </div>
);

interface ProjectTableProps { projects: Project[]; }
const ProjectTable: React.FC<ProjectTableProps> = ({ projects }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
            <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                <tr>
                    <th scope="col" className="px-4 py-3 font-medium">Project Name</th>
                    <th scope="col" className="px-4 py-3 font-medium">Manager</th>
                    <th scope="col" className="px-4 py-3 font-medium">Sprints</th>
                    <th scope="col" className="px-4 py-3 font-medium">Status</th>
                    <th scope="col" className="px-4 py-3 font-medium">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {projects.map((project) => (
                    <ProjectRow key={project.id} project={project} />
                ))}
            </tbody>
        </table>
    </div>
);

const Pagination: React.FC = () => (
    <nav className="flex items-center justify-end pt-6">
        <ul className="flex items-center -space-x-px h-8 text-sm">
            <li><a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-900 font-bold bg-white rounded-md">1</a></li>
            <li><a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white rounded-md hover:bg-gray-100 hover:text-gray-700">2</a></li>
            <li><a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white rounded-md hover:bg-gray-100 hover:text-gray-700">3</a></li>
            <li><span className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white">...</span></li>
            <li><a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-blue-600 bg-white rounded-md hover:bg-gray-100">Next &gt;</a></li>
        </ul>
    </nav>
);

// --- Main Page Component ---

export default function ProjectsView() {
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <AppHeader />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md">
            <ProjectsCardHeader />
            <div className="p-6">
                <ProjectsToolbar projectCount={projectsData.length} />
                <ProjectTable projects={projectsData} />
                <Pagination />
            </div>
        </div>
      </main>
    </div>
  );
}