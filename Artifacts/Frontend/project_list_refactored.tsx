import React, { useState } from 'react';
import type { FC } from 'react';
import { CalendarDays, ChevronDown, MoreHorizontal, Search, ChevronsLeft, ChevronsRight } from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ProjectStatus = 'Planning' | 'Active' | 'Completed' | 'On Hold';

export interface Project {
  id: string;
  code: string;
  name: string;
  client: string;
  sprints: number;
  teamSize: number;
  status: ProjectStatus;
}

// Mock Data for the Project List
const mockProjects: Project[] = [
  { id: 'proj_001', code: 'PROJ-2025-001', name: 'Customer Portal Redesign', client: 'GechStart Inc', sprints: 18, teamSize: 8, status: 'Active' },
  { id: 'proj_002', code: 'PROJ-2025-002', name: 'Mobile App Development', client: 'TechStart Inc', sprints: 12, teamSize: 6, status: 'Planning' },
  { id: 'proj_003', code: 'PROJ-2025-003', name: 'Website Revamp', client: 'Innovate Solutions', sprints: 10, teamSize: 6, status: 'Completed' },
  { id: 'proj_004', code: 'PROJ-2025-004', name: 'New Warehouse Upgrade', client: 'DataCorp Ltd', sprints: 15, teamSize: 7, status: 'Completed' },
  { id: 'proj_005', code: 'PROJ-2025-005', name: 'Data Warehouse Upgrade', client: 'TetaCorp Ltd', sprints: 8, teamSize: 7, status: 'Planning' },
  { id: 'proj_006', code: 'PROJ-2025-006', name: 'Internal Tooling Project', client: 'Global Solutions', sprints: 8, teamSize: 9, status: 'On Hold' },
  { id: 'proj_007', code: 'PROJ-2025-007', name: 'AI/ML Research Initiative', client: 'Innovate Labs', sprints: 14, teamSize: 5, status: 'Active' },
  { id: 'proj_008', code: 'PROJ-2025-008', name: 'Security Audit & Upgrade', client: 'CyberSec Inc.', sprints: 6, teamSize: 12, status: 'Planning' },
  { id: 'proj_009', code: 'PROJ-2024-045', name: 'Cloud Migration', client: 'SkyHigh Tech', sprints: 20, teamSize: 10, status: 'Active' },
  { id: 'proj_010', code: 'PROJ-2024-041', name: 'E-commerce Platform', client: 'Shopify Plus', sprints: 24, teamSize: 15, status: 'Completed' },
];


// ============================================================================
// UI HELPER & LAYOUT COMPONENTS
// ============================================================================

// --- StatusBadge Component ---
interface StatusBadgeProps {
  status: ProjectStatus;
}

const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const statusClasses: Record<ProjectStatus, string> = {
    Planning: "bg-amber-100 text-amber-800",
    Active: "bg-green-100 text-green-800",
    Completed: "bg-blue-100 text-blue-800",
    On Hold: "bg-gray-100 text-gray-700",
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

// --- AppHeader Component ---
const AppHeader: FC = () => (
  <header className="px-6 py-4 border-b border-gray-200">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-x-8">
        <div className="flex items-center gap-x-2">
          <CalendarDays className="h-7 w-7 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">StaffAlloc</span>
        </div>
        <nav className="hidden md:flex items-center gap-x-6">
          <a href="#" className="text-sm font-semibold text-gray-600 hover:text-blue-600">Dashboard</a>
          <a href="#" className="text-sm font-semibold text-blue-600 border-b-2 border-blue-600 pb-1">Projects</a>
          <a href="#" className="text-sm font-semibold text-gray-600 hover:text-blue-600">Settings</a>
        </nav>
      </div>
      <div className="flex items-center gap-x-4">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold text-sm">
          PM
        </div>
        <div className="flex items-center gap-x-1 cursor-pointer">
          <span className="text-sm font-semibold text-gray-700">Priya Patel</span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>
      </div>
    </div>
  </header>
);

// --- PageHeader Component ---
interface PageHeaderProps {
  title: string;
  subtitle: string;
  buttonText: string;
  onButtonClick: () => void;
}

const PageHeader: FC<PageHeaderProps> = ({ title, subtitle, buttonText, onButtonClick }) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
    </div>
    <button
      type="button"
      onClick={onButtonClick}
      className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      {buttonText}
    </button>
  </div>
);

// --- SearchAndFilters Component ---
interface SearchAndFiltersProps {
  onClearFilters: () => void;
}

const SearchAndFilters: FC<SearchAndFiltersProps> = ({ onClearFilters }) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex-1 flex items-center border border-gray-300 rounded-lg bg-white">
      <div className="pl-3 pr-2 border-r border-gray-300">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search projects by name, or client..."
        className="w-full pl-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none rounded-r-lg"
      />
    </div>
    <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white cursor-pointer">
      <div>
        <span className="text-sm font-medium text-gray-800">All Status</span>
        <p className="text-xs text-gray-500">Planning</p>
      </div>
      <ChevronDown className="h-5 w-5 text-gray-400 ml-4" />
    </div>
    <div className="flex items-center gap-x-4">
      <span className="text-sm text-gray-600">Sort by: Recently Updated</span>
      <button type="button" onClick={onClearFilters} className="text-sm font-medium text-blue-600 hover:text-blue-800">
        Clear filters
      </button>
    </div>
  </div>
);

// --- ProjectTableRow Component ---
interface ProjectTableRowProps {
  project: Project;
}

const ProjectTableRow: FC<ProjectTableRowProps> = ({ project }) => (
  <tr className="hover:bg-gray-50 transition-colors duration-150">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-gray-900">{project.name}</div>
      <div className="text-xs text-gray-500">{project.code}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <a href="#" className="text-sm text-blue-600 hover:underline">{project.client}</a>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{project.sprints}</td>
    <td className="px-6 py-4 whitespace-nowrap">
      <StatusBadge status={project.status} />
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
        {project.teamSize} members
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <button type="button" className="text-gray-500 hover:text-gray-700" aria-label={`Actions for ${project.name}`}>
        <MoreHorizontal className="h-5 w-5" />
      </button>
    </td>
  </tr>
);

// --- ProjectsTable Component ---
interface ProjectsTableProps {
  projects: Project[];
}

const ProjectsTable: FC<ProjectsTableProps> = ({ projects }) => (
  <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sprints</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Size</th>
          <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {projects.map((project) => (
          <ProjectTableRow key={project.id} project={project} />
        ))}
      </tbody>
    </table>
  </div>
);

// --- Pagination Component ---
const Pagination: FC = () => (
  <nav className="mt-4 px-4 py-3 flex items-center justify-between sm:px-6" aria-label="Pagination">
    <div className="text-sm text-gray-700">
      Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of <span className="font-medium">47</span> projects
    </div>
    <div className="flex-1 flex justify-end items-center gap-x-2">
      <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
        <ChevronsLeft className="h-4 w-4 mr-1"/> Previous
      </a>
      <a href="#" aria-current="page" className="relative z-10 inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-white bg-blue-600">1</a>
      <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">2</a>
      <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">3</a>
      <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">...</span>
      <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">5</a>
      <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
        Next <ChevronsRight className="h-4 w-4 ml-1"/>
      </a>
    </div>
  </nav>
);


// ============================================================================
// MAIN VIEW COMPONENT
// ============================================================================

export default function ProjectListView() {
  const [projects] = useState<Project[]>(mockProjects);

  const handleCreateProject = () => {
    console.log("Create New Project button clicked");
  };

  const handleClearFilters = () => {
    console.log("Clear filters clicked");
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="p-4 sm:p-6 lg:p-8 max-w-screen-xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm">
          <AppHeader />
          <main className="p-6">
            <PageHeader
              title="Projects"
              subtitle="Manage project staffing plans and allocations"
              buttonText="Create New Project"
              onButtonClick={handleCreateProject}
            />
            <SearchAndFilters onClearFilters={handleClearFilters} />
            <ProjectsTable projects={projects} />
            <Pagination />
          </main>
        </div>
      </div>
    </div>
  );
}