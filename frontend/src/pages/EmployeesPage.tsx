import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Blocks, Plus, Search, SlidersHorizontal, LogOut, Loader2, AlertCircle } from 'lucide-react';
import { employeesService } from '../services/employees';
import { useAuth } from '../hooks/useAuth';
import type { Employee as APIEmployee } from '../types/api.types';

// ============================================================================
// TYPES - Extended for UI display
// ============================================================================

interface EmployeeDisplay extends APIEmployee {
  avatar?: string;
  isInitials?: boolean;
  progress?: number;
  status?: 'Available' | 'On Leave';
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate initials from full name
 */
function getInitials(fullName: string): string {
  const names = fullName.split(' ');
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return fullName.substring(0, 2).toUpperCase();
}

/**
 * Transform API Employee to Display Employee
 * Adds UI-specific properties
 */
function transformEmployee(employee: APIEmployee): EmployeeDisplay {
  return {
    ...employee,
    avatar: getInitials(employee.full_name),
    isInitials: true,
    progress: 75, // Default progress, would come from allocations in real app
    status: employee.is_active ? 'Available' : 'On Leave',
  };
}

// ============================================================================
// ATOMIC & REUSABLE COMPONENTS
// ============================================================================

interface PillButtonProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
  onClick?: () => void;
}

const PillButton = ({ children, active = false, className = '', onClick }: PillButtonProps) => {
  const baseClasses = 'px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200';
  const activeClasses = 'bg-blue-600 text-white';
  const inactiveClasses = 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100';
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses} ${className}`}
    >
      {children}
    </button>
  );
};

const StatCard = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
    <h3 className="font-semibold text-slate-800">{title}</h3>
    {children}
  </div>
);

interface AvatarProps {
  avatar: string;
  isInitials: boolean;
  name: string;
}

const Avatar = ({ avatar, isInitials, name }: AvatarProps) => {
  if (isInitials) {
    return (
      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
        {avatar}
      </div>
    );
  }
  return <img className="w-12 h-12 rounded-full object-cover" src={avatar} alt={`Photo of ${name}`} />;
};

interface StatusIndicatorProps {
  status: 'Available' | 'On Leave';
}

const StatusIndicator = ({ status }: StatusIndicatorProps) => (
  <div className="flex items-center gap-2">
    <div className={`w-2.5 h-2.5 rounded-full ${status === 'Available' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
    <span className="text-slate-600">{status}</span>
  </div>
);

interface ProgressBarProps {
  progress: number;
}

const ProgressBar = ({ progress }: ProgressBarProps) => (
  <>
    <div className="w-full bg-slate-200 rounded-full h-1.5">
      <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
    </div>
    <div className="flex justify-end">
      <span className="text-slate-800 font-medium">{progress}%</span>
    </div>
  </>
);

// ============================================================================
// COMPOSITE COMPONENTS
// ============================================================================

const EmployeeCard = ({ employee }: { employee: EmployeeDisplay }) => (
  <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center gap-4">
      <Avatar
        avatar={employee.avatar || getInitials(employee.full_name)}
        isInitials={employee.isInitials || true}
        name={employee.full_name}
      />
      <div>
        <h3 className="font-semibold text-slate-800 text-lg">{employee.full_name}</h3>
        <p className="text-sm text-slate-500">{employee.username}</p>
        <p className="text-xs text-slate-400 mt-1">{employee.email}</p>
      </div>
    </div>
    <div className="mt-4 space-y-3 text-sm">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-slate-800 font-medium">Utilization</span>
          <span className="text-slate-400 text-xs">Current allocation</span>
        </div>
        <StatusIndicator status={employee.status || 'Available'} />
      </div>
      <ProgressBar progress={employee.progress || 0} />
    </div>
    <div className="mt-auto pt-4 border-t border-slate-200 flex justify-between items-center text-sm font-medium">
      <button className="text-blue-600 hover:underline">View Details</button>
      <button className="text-blue-600 hover:underline">Edit</button>
    </div>
  </div>
);

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

const DashboardHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-3">
              <Blocks className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-slate-800">StaffAlloc</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard" className="text-sm font-medium text-slate-500 hover:text-slate-800">
              Dashboard
            </Link>
            <Link to="/projects" className="text-sm font-medium text-slate-500 hover:text-slate-800">
              Projects
            </Link>
            <Link to="/allocations" className="text-sm font-medium text-slate-500 hover:text-slate-800">
              Allocations
            </Link>
            <Link
              to="/employees"
              className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1"
            >
              Employees
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-slate-700">{user?.full_name}</p>
              <p className="text-xs text-slate-500">{user?.system_role}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
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

const TeamPageHeader = ({ count }: { count: number }) => (
  <div className="mb-6">
    <h1 className="text-3xl font-bold text-slate-800">Team Members</h1>
    <p className="text-slate-500 mt-1">
      Manage employee profiles, skills, and availability. {count} employees total.
    </p>
  </div>
);

interface TeamFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const TeamFilters = ({ searchTerm, onSearchChange }: TeamFiltersProps) => (
  <div className="space-y-4 mb-6">
    <div className="flex flex-wrap items-center gap-2">
      <PillButton active>All</PillButton>
      <PillButton>Engineers</PillButton>
      <PillButton>Designers</PillButton>
      <PillButton>Managers</PillButton>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>
      <button className="bg-white border border-slate-300 text-slate-700 px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-100">
        <SlidersHorizontal size={16} />
        Additional Filters
        <div className="bg-slate-100 rounded-md p-1 -mr-2">
          <Plus size={14} className="text-slate-500" />
        </div>
      </button>
    </div>
  </div>
);

const EmployeeGrid = ({ employees }: { employees: EmployeeDisplay[] }) => {
  if (employees.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-slate-600">No employees found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {employees.map((employee) => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}
    </div>
  );
};

// ============================================================================
// SIDEBAR COMPONENTS
// ============================================================================

const TeamOverviewCard = ({ count }: { count: number }) => (
  <StatCard title="Team Overview">
    <p className="text-sm text-slate-500 mt-2">Total Employees: {count}</p>
    <div className="mt-4 space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-slate-600">Active:</span>
        <span className="font-semibold text-slate-800">{count}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-600">Avg. Utilization:</span>
        <span className="font-semibold text-slate-800">75%</span>
      </div>
    </div>
  </StatCard>
);

const TeamStatsCard = () => (
  <StatCard title="Team Stats">
    <h4 className="font-medium text-slate-700 text-sm mt-4">Utilization by Role</h4>
    <div className="flex items-end justify-between h-32 mt-2 gap-2">
      <div className="w-full h-[60%] bg-blue-600 rounded-t-md"></div>
      <div className="w-full h-[90%] bg-blue-600 rounded-t-md"></div>
      <div className="w-full h-[30%] bg-blue-600 rounded-t-md"></div>
      <div className="w-full h-[75%] bg-blue-600 rounded-t-md"></div>
      <div className="w-full h-[50%] bg-blue-600 rounded-t-md"></div>
    </div>
    <div className="flex justify-between text-xs text-slate-500 border-t mt-1 pt-1">
      <span>Eng</span>
      <span>PM</span>
      <span>Design</span>
      <span>Data</span>
      <span>Ops</span>
    </div>
  </StatCard>
);

const DashboardSidebar = ({ count }: { count: number }) => (
  <aside className="w-full lg:w-[350px] flex-shrink-0">
    <div className="space-y-6 sticky top-24">
      <TeamOverviewCard count={count} />
      <TeamStatsCard />
    </div>
  </aside>
);

// ============================================================================
// LOADING & ERROR COMPONENTS
// ============================================================================

const LoadingState = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
      <p className="text-slate-600">Loading employees...</p>
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
// PAGE COMPONENT
// ============================================================================

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch employees from API using React Query
  const { data: employees, isLoading, error, refetch } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeesService.getEmployees(),
  });

  // Transform API data to display format
  const displayEmployees: EmployeeDisplay[] = employees
    ? employees.map(transformEmployee)
    : [];

  // Filter employees based on search term
  const filteredEmployees = displayEmployees.filter(
    (employee) =>
      employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <DashboardHeader />
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow">
            <TeamPageHeader count={displayEmployees.length} />
            <TeamFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} />

            {isLoading && <LoadingState />}

            {error && (
              <ErrorState
                error={error instanceof Error ? error.message : 'Failed to load employees'}
                onRetry={() => refetch()}
              />
            )}

            {!isLoading && !error && <EmployeeGrid employees={filteredEmployees} />}
          </div>
          <DashboardSidebar count={displayEmployees.length} />
        </div>
      </main>
    </div>
  );
}
