import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, ChevronDown, Plus, MoreVertical, Blocks, LogOut, Loader2, AlertCircle } from 'lucide-react';
import { projectsService } from '../services/projects';
import { useAuth } from '../hooks/useAuth';
import type { Project } from '../types/api.types';
import CreateProjectModal from '../components/CreateProjectModal';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ============================================================================
// REUSABLE UI COMPONENTS
// ============================================================================

interface StatusBadgeProps {
  status: Project['status'];
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const baseClasses = 'px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full';
  const statusClasses: Record<Project['status'], string> = {
    'Active': 'bg-green-100 text-green-800',
    'Planning': 'bg-yellow-100 text-yellow-800',
    'On Hold': 'bg-orange-100 text-orange-800',
    'Closed': 'bg-gray-100 text-gray-800',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const SearchInput = ({ value, onChange, placeholder }: SearchInputProps) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pl-9 pr-3 py-2 w-72"
    />
  </div>
);

interface FilterDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const FilterDropdown = ({ label, value, options, onChange }: FilterDropdownProps) => (
  <div className="relative">
    <label className="text-xs font-medium text-gray-500 block mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm text-gray-800 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pl-3 pr-8 py-2 appearance-none bg-white"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-2 top-[60%] h-4 w-4 text-gray-500 pointer-events-none" />
  </div>
);

// ============================================================================
// TABLE COMPONENTS
// ============================================================================

interface ProjectNameCellProps {
  project: Project;
}

const ProjectNameCell = ({ project }: ProjectNameCellProps) => (
  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
    <Link to={`/projects/${project.id}/allocations`} className="text-blue-600 hover:underline">
      {project.code}
    </Link>
    <div className="text-xs text-gray-500 font-normal">{project.name}</div>
  </td>
);

interface ClientCellProps {
  clientName: string;
}

const ClientCell = ({ clientName }: ClientCellProps) => (
  <td className="px-4 py-3 whitespace-nowrap">
    <span className="text-gray-800">{clientName}</span>
  </td>
);

interface ProjectRowProps {
  project: Project;
}

const ProjectRow = ({ project }: ProjectRowProps) => (
  <tr className="hover:bg-gray-50">
    <ProjectNameCell project={project} />
    <ClientCell clientName={project.client || 'N/A'} />
    <td className="px-4 py-3 text-gray-800">{project.sprints}</td>
    <td className="px-4 py-3">
      <StatusBadge status={project.status} />
    </td>
    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(project.start_date)}</td>
    <td className="px-4 py-3">
      <button aria-label="More options" className="hover:bg-gray-100 p-1 rounded">
        <MoreVertical className="h-5 w-5 text-gray-500 hover:text-gray-800" />
      </button>
    </td>
  </tr>
);

interface ProjectTableProps {
  projects: Project[];
}

const ProjectTable = ({ projects }: ProjectTableProps) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No projects found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">Project</th>
            <th scope="col" className="px-4 py-3 font-medium">Client</th>
            <th scope="col" className="px-4 py-3 font-medium">Sprints</th>
            <th scope="col" className="px-4 py-3 font-medium">Status</th>
            <th scope="col" className="px-4 py-3 font-medium">Start Date</th>
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
};

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

const AppHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Blocks className="h-7 w-7 text-blue-600" />
              <h1 className="text-xl font-bold text-blue-600">StaffAlloc</h1>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                Dashboard
              </Link>
              <Link to="/projects" className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1">
                Projects
              </Link>
              <Link to="/employees" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                Employees
              </Link>
              <Link to="/allocations" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                Allocations
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-gray-700">{user?.full_name}</p>
              <p className="text-xs text-gray-500">{user?.system_role}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

interface ProjectsCardHeaderProps {
  onCreateClick: () => void;
}

const ProjectsCardHeader = ({ onCreateClick }: ProjectsCardHeaderProps) => (
  <div className="p-6 border-b border-gray-200">
    <div className="flex items-start justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
        <p className="mt-1 text-sm text-gray-500">Manage and track all project allocations</p>
      </div>
      <button
        onClick={onCreateClick}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Plus className="h-5 w-5" />
        Create New Project
      </button>
    </div>
  </div>
);

interface ProjectsToolbarProps {
  projectCount: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

const ProjectsToolbar = ({
  projectCount,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: ProjectsToolbarProps) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-4">
      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search projects..."
      />
      <FilterDropdown
        label="Status"
        value={statusFilter}
        options={['All', 'Active', 'Planning', 'On Hold', 'Closed']}
        onChange={onStatusFilterChange}
      />
    </div>
    <span className="text-sm text-gray-600">Showing {projectCount} projects</span>
  </div>
);

// ============================================================================
// LOADING & ERROR COMPONENTS
// ============================================================================

const LoadingState = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
      <p className="text-gray-600">Loading projects...</p>
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <p className="text-red-600 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Try Again
      </button>
    </div>
  </div>
);

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch projects from API
  const { data: projects, isLoading, error, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsService.getProjects(),
  });

  // Filter projects based on search and status
  const filteredProjects = projects
    ? projects.filter((project) => {
        const matchesSearch =
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (project.client?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === 'All' || project.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
    : [];

  const handleCreateProject = () => {
    setIsModalOpen(true);
  };

  const handleProjectCreated = () => {
    // Invalidate and refetch projects to show the new project
    queryClient.invalidateQueries({ queryKey: ['projects'] });
    setIsModalOpen(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <AppHeader />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md">
          <ProjectsCardHeader onCreateClick={handleCreateProject} />
          <div className="p-6">
            <ProjectsToolbar
              projectCount={filteredProjects.length}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />

            {isLoading && <LoadingState />}

            {error && (
              <ErrorState
                error={error instanceof Error ? error.message : 'Failed to load projects'}
                onRetry={() => refetch()}
              />
            )}

            {!isLoading && !error && <ProjectTable projects={filteredProjects} />}
          </div>
        </div>
      </main>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleProjectCreated}
      />
    </div>
  );
}