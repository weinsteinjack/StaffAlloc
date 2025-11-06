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

// Mock data based on the image
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

const StatusBadge: React.FC<{ status: ProjectStatus }> = ({ status }) => {
  const baseClasses = 'px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full';
  
  const statusClasses: Record<ProjectStatus, string> = {
    'Active': 'bg-green-100 text-green-800',
    'Planning': 'bg-yellow-100 text-yellow-800',
    'On Hold': 'bg-yellow-100 text-yellow-800',
    'Closed': 'bg-green-100 text-green-800', // As per image, 'Closed' uses green badge
  };

  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const FilterDropdown: React.FC<{ label: string; value: string; hasChevron?: boolean }> = ({ label, value, hasChevron = true }) => (
    <div>
        <label className="text-xs font-medium text-gray-500">{label}</label>
        <div className="flex items-center gap-1">
            <span className="text-sm text-gray-800">{value}</span>
            {hasChevron && <ChevronDown className="h-4 w-4 text-gray-500" />}
        </div>
    </div>
);

export default function ProjectsView() {
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md w-64 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <img className="h-8 w-8 rounded-full" src="https://i.pravatar.cc/150?u=jane" alt="Jane Doe" />
                <span className="text-sm font-medium text-gray-700">Jane Doe</span>
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
                        <p className="mt-1 text-sm text-gray-500">Manage and track all project allocations</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <Plus className="h-5 w-5" />
                        Create New Project
                    </button>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                            type="text"
                            placeholder="Search projects..."
                            className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md w-72 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <FilterDropdown label="Status" value="All Active" />
                        <FilterDropdown label="Manager" value="All Select Manager" />
                        <FilterDropdown label="Date Range" value="On Hold" hasChevron={false} />
                    </div>
                    <span className="text-sm text-gray-600">Showing 12 projects</span>
                </div>
                
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
                            {projectsData.map((project, index) => (
                                <tr key={project.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                                        {project.isLink ? (
                                            <a href="#" className="text-blue-600 hover:underline">{project.name}</a>
                                        ) : (
                                            project.name
                                        )}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <img className="h-6 w-6 rounded-full" src={project.manager.avatarUrl} alt={project.manager.name} />
                                            <span className="text-gray-800">{project.manager.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-800">{project.sprints}</td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={project.status} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                                                {project.actionsCount}
                                            </div>
                                            <button aria-label="More options">
                                                <MoreVertical className="h-5 w-5 text-gray-500 hover:text-gray-800" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <nav className="flex items-center justify-end pt-6">
                    <ul className="flex items-center -space-x-px h-8 text-sm">
                        <li>
                            <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-900 font-bold bg-white rounded-md">1</a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white rounded-md hover:bg-gray-100 hover:text-gray-700">2</a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white rounded-md hover:bg-gray-100 hover:text-gray-700">3</a>
                        </li>
                        <li>
                            <span className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white">...</span>
                        </li>
                        <li>
                            <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-blue-600 bg-white rounded-md hover:bg-gray-100">Next &gt;</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
      </main>
    </div>
  );
}