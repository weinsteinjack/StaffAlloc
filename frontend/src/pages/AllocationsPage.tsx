import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, TriangleAlert, Blocks, CircleAlert, LogOut, Loader2, AlertCircle } from 'lucide-react';
import { allocationsService } from '../services/allocations';
import { employeesService } from '../services/employees';
import { useAuth } from '../hooks/useAuth';
import type { AllocationWithDetails, Employee } from '../types/api.types';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type AllocationColor = 'blue' | 'purple' | 'green' | 'orange' | 'red';

interface AllocationDisplay {
  project: string;
  projectCode: string;
  hours: number;
  color: AllocationColor;
  hasConflict?: boolean;
  tooltip?: string;
}

interface EmployeeWithAllocations extends Employee {
  utilization: number;
  allocations: { [day: string]: AllocationDisplay[] };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get color based on allocation hours
 * Useful for color-coding allocations in the calendar grid
 */
// function getAllocationColor(hours: number): AllocationColor {
//   if (hours >= 8) return 'blue';
//   if (hours >= 6) return 'purple';
//   if (hours >= 4) return 'green';
//   if (hours > 0) return 'orange';
//   return 'red';
// }

/**
 * Calculate utilization percentage
 */
function calculateUtilization(allocations: AllocationWithDetails[]): number {
  if (allocations.length === 0) return 0;
  const totalHours = allocations.reduce((sum, alloc) => sum + alloc.allocated_hours, 0);
  const workingHoursPerMonth = 160; // Assuming 40 hours/week * 4 weeks
  return Math.round((totalHours / workingHoursPerMonth) * 100);
}

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
 * Get current week dates
 */
function getCurrentWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  return Array.from({ length: 6 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  });
}

/**
 * Format date for display
 */
function formatWeekDay(date: Date) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return {
    day: days[date.getDay()],
    date: date.getDate(),
    fullDate: date.toISOString().split('T')[0],
  };
}

// ============================================================================
// REUSABLE UI COMPONENTS
// ============================================================================

const getAllocationColorClass = (color: AllocationColor) => {
  const colorMap = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  };
  return colorMap[color];
};

interface AllocationBarProps {
  allocation: AllocationDisplay;
}

const AllocationBar = ({ allocation }: AllocationBarProps) => (
  <div className="relative">
    <div className={`text-white text-xs font-semibold p-1.5 rounded-md mb-1 ${getAllocationColorClass(allocation.color)}`}>
      {allocation.project}
    </div>
    {allocation.hasConflict && (
      <TriangleAlert className="w-4 h-4 text-red-500 absolute -bottom-1 -right-2 bg-white rounded-full p-0.5" />
    )}
    {allocation.tooltip && (
      <div className="absolute left-[50%] top-[90%] w-max max-w-xs bg-white p-3 rounded-lg shadow-2xl text-sm z-20 border border-gray-100">
        <p className="font-semibold text-gray-800">Conflict</p>
        <p className="text-gray-600">{allocation.tooltip}</p>
      </div>
    )}
  </div>
);

interface CalendarCellProps {
  allocations: AllocationDisplay[];
}

const CalendarCell = ({ allocations }: CalendarCellProps) => (
  <div className="p-1.5 border-b border-l border-gray-200 min-h-[72px] align-top relative">
    {allocations.map((alloc, index) => (
      <AllocationBar key={index} allocation={alloc} />
    ))}
  </div>
);

const getUtilizationClasses = (percentage: number) => {
  if (percentage >= 90) return 'border-red-400 text-red-500 bg-red-50';
  if (percentage >= 70) return 'border-green-400 text-green-600 bg-green-50';
  if (percentage > 0) return 'border-orange-400 text-orange-500 bg-orange-50';
  return 'border-gray-300 text-gray-400';
};

interface UtilizationBadgeProps {
  utilization: number;
}

const UtilizationBadge = ({ utilization }: UtilizationBadgeProps) => {
  if (utilization <= 0) return null;
  return (
    <div className={`w-9 h-9 flex-shrink-0 rounded-full border-2 flex items-center justify-center text-xs font-bold ${getUtilizationClasses(utilization)}`}>
      {utilization}%
    </div>
  );
};

interface EmployeeInfoProps {
  employee: EmployeeWithAllocations;
}

const EmployeeInfo = ({ employee }: EmployeeInfoProps) => (
  <div className="sticky left-0 bg-white p-3 border-b border-gray-200 z-10 flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
      {getInitials(employee.full_name)}
    </div>
    <div className="flex-grow">
      <p className="font-semibold text-gray-800">{employee.full_name}</p>
      <p className="text-xs text-gray-500">{employee.email}</p>
    </div>
    <UtilizationBadge utilization={employee.utilization} />
  </div>
);

interface GridHeaderProps {
  weekDates: ReturnType<typeof getCurrentWeekDates>;
}

const GridHeader = ({ weekDates }: GridHeaderProps) => (
  <>
    <div className="sticky top-0 left-0 bg-white z-20"></div> {/* Corner */}
    <div className="sticky top-0 col-span-6 bg-white z-10">
      <div className="grid grid-cols-6">
        {weekDates.map((date, index) => {
          const formatted = formatWeekDay(date);
          return (
            <div key={index} className="p-3 text-sm font-medium text-gray-500 bg-slate-50 text-left border-b border-l border-gray-200">
              {formatted.day} <span className="text-gray-400">{formatted.date}</span>
            </div>
          );
        })}
      </div>
    </div>
  </>
);

interface AllocationsGridProps {
  employees: EmployeeWithAllocations[];
  weekDates: ReturnType<typeof getCurrentWeekDates>;
}

const AllocationsGrid = ({ employees, weekDates }: AllocationsGridProps) => {
  if (employees.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <p className="text-gray-500">No employee allocations found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto relative">
        <div className="grid" style={{ gridTemplateColumns: '260px repeat(6, 1fr)' }}>
          <GridHeader weekDates={weekDates} />
          {employees.map((employee) => (
            <div key={employee.id} className="contents">
              <EmployeeInfo employee={employee} />
              {weekDates.map((date, dayIndex) => {
                const formatted = formatWeekDay(date);
                const dayKey = `${formatted.day} ${formatted.date}`;
                const dailyAllocations = employee.allocations[dayKey] || [];
                return <CalendarCell key={dayIndex} allocations={dailyAllocations} />;
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

const AppHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
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
              <Link to="/projects" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                Projects
              </Link>
              <Link to="/employees" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                Employees
              </Link>
              <Link to="/allocations" className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1">
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

interface AllocationsHeaderProps {
  currentMonth: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  viewMode: 'week' | 'month';
  onViewModeChange: (mode: 'week' | 'month') => void;
}

const AllocationsHeader = ({ currentMonth, onPrevMonth, onNextMonth, viewMode, onViewModeChange }: AllocationsHeaderProps) => (
  <section className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold text-gray-800">Team Allocations</h1>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <button
          onClick={onPrevMonth}
          className="p-2 rounded-md hover:bg-gray-100"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span>{currentMonth}</span>
        <button
          onClick={onNextMonth}
          className="p-2 rounded-md hover:bg-gray-100"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="bg-gray-100 p-1 rounded-lg flex text-sm">
        <button
          onClick={() => onViewModeChange('week')}
          className={`py-1 px-4 rounded-md font-semibold ${
            viewMode === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 font-medium'
          }`}
        >
          Week
        </button>
        <button
          onClick={() => onViewModeChange('month')}
          className={`py-1 px-4 rounded-md font-semibold ${
            viewMode === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 font-medium'
          }`}
        >
          Month
        </button>
      </div>
      <button className="text-sm font-semibold bg-blue-600 text-white py-2 px-4 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        Export Schedule
      </button>
      <button className="text-sm font-semibold bg-white text-gray-700 py-2 px-4 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300">
        Adjust Allocations
      </button>
    </div>
  </section>
);

interface WeekOverviewSidebarProps {
  totalHours: number;
  avgUtilization: number;
  conflictCount: number;
}

const WeekOverviewSidebar = ({ totalHours, avgUtilization, conflictCount }: WeekOverviewSidebarProps) => (
  <aside className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Week Overview</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Team Hours:</span>
          <span className="font-semibold text-gray-800">{totalHours}h</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Average Utilization:</span>
          <span className="font-semibold text-gray-800">{avgUtilization}%</span>
        </div>
        {conflictCount > 0 && (
          <div className="flex items-center gap-2 text-red-600 font-semibold pt-2">
            <CircleAlert className="w-5 h-5" />
            <span>{conflictCount} conflicts detected</span>
          </div>
        )}
      </div>
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
      <p className="text-gray-600">Loading allocations...</p>
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

export default function AllocationsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const weekDates = getCurrentWeekDates();

  // Fetch employees and allocations from API
  const { data: employees, isLoading: isLoadingEmployees, error: employeesError, refetch: refetchEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeesService.getEmployees(),
  });

  const { data: allocations, isLoading: isLoadingAllocations, error: allocationsError, refetch: refetchAllocations } = useQuery({
    queryKey: ['allocations'],
    queryFn: () => allocationsService.getAllocations(),
  });

  const isLoading = isLoadingEmployees || isLoadingAllocations;
  const error = employeesError || allocationsError;

  // Transform data for display
  const employeesWithAllocations: EmployeeWithAllocations[] = employees
    ? employees.map((employee) => {
        const employeeAllocations = allocations?.filter(
          (alloc) => alloc.employee_email === employee.email
        ) || [];

        // Group allocations by day (simplified - would need more complex logic for actual day mapping)
        const allocationsByDay: { [day: string]: AllocationDisplay[] } = {};

        return {
          ...employee,
          utilization: calculateUtilization(employeeAllocations),
          allocations: allocationsByDay,
        };
      })
    : [];

  // Calculate overview stats
  const totalHours = allocations?.reduce((sum, alloc) => sum + alloc.allocated_hours, 0) || 0;
  const avgUtilization = employeesWithAllocations.length > 0
    ? Math.round(employeesWithAllocations.reduce((sum, emp) => sum + emp.utilization, 0) / employeesWithAllocations.length)
    : 0;
  const conflictCount = 0; // Would need conflict detection logic

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const currentMonthStr = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <AppHeader />
      <main className="max-w-screen-2xl mx-auto p-6">
        <AllocationsHeader
          currentMonth={currentMonthStr}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {isLoading && <LoadingState />}

        {error && (
          <ErrorState
            error={error instanceof Error ? error.message : 'Failed to load allocations'}
            onRetry={() => {
              refetchEmployees();
              refetchAllocations();
            }}
          />
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-6">
            <AllocationsGrid employees={employeesWithAllocations} weekDates={weekDates} />
            <WeekOverviewSidebar
              totalHours={totalHours}
              avgUtilization={avgUtilization}
              conflictCount={conflictCount}
            />
          </div>
        )}
      </main>
    </div>
  );
}
