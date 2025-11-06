javascript
import React from 'react';
import { ChevronLeft, ChevronRight, TriangleAlert, LayoutGrid, CircleAlert } from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS & DATA
// ============================================================================

type Allocation = {
  project: string;
  hours?: number;
  color: 'blue' | 'purple' | 'green' | 'orange' | 'red';
  hasConflict?: boolean;
  tooltip?: string;
};

type TeamMember = {
  name: string;
  role: string;
  avatar: string;
  utilization: number;
  allocations: { [day: string]: Allocation[] };
};

const weekDays = [
  { day: "Mon", date: 4 },
  { day: "Tue", date: 5 },
  { day: "Wed", date: 6 },
  { day: "Thu", date: 7 },
  { day: "Sat", date: 9 },
  { day: "Sun", date: 10 },
];

const teamData: TeamMember[] = [
  {
    name: 'John Smith',
    role: 'Senior Developer',
    avatar: 'https://i.pravatar.cc/150?u=johnsmith',
    utilization: 95,
    allocations: {
      'Tue 5': [
        { project: 'PROJ-001 (8h)', color: 'blue' },
        { project: 'PROJ-093 (0h)', color: 'purple' },
        { project: 'PROJ-083 (4h)', color: 'purple' },
      ],
      'Wed 6': [],
      'Thu 7': [{ project: 'PROJ-001 (8h)', color: 'blue', hasConflict: true }],
      'Sat 9': [{ project: 'PROJ-001', color: 'green' }],
      'Sun 10': [{ project: 'PROJ-001 (8h)', color: 'red' }],
    },
  },
  {
    name: 'Jane Doe',
    role: 'UI Designer',
    avatar: 'https://i.pravatar.cc/150?u=janedoe1',
    utilization: 80,
    allocations: {
      'Thu 7': [{ project: 'PROJ-02', color: 'green' }],
      'Sat 9': [{ project: 'PROJ-00h', color: 'green' }],
      'Sun 10': [{ project: 'Fri', color: 'orange' }],
    },
  },
  {
    name: 'Jane Doe',
    role: 'UI Designer',
    avatar: 'https://i.pravatar.cc/150?u=janedoe2',
    utilization: 75,
    allocations: {
      'Sun 10': [{ project: 'ADMIN (4h)', color: 'red' }],
    },
  },
  {
    name: 'Michael Chen',
    role: 'Project Manager',
    avatar: 'https://i.pravatar.cc/150?u=michaelchen1',
    utilization: 0,
    allocations: {
      'Sat 9': [{ project: 'PROJ-022', color: 'green' }],
      'Sun 10': [{ project: 'PROJ-00h)', color: 'orange' }],
    },
  },
  {
    name: 'Sarah Lee',
    role: 'Data Analyst',
    avatar: 'https://i.pravatar.cc/150?u=sarahlee1',
    utilization: 60,
    allocations: {
      'Thu 7': [{ project: 'PROJ-001 (8h)', color: 'purple' }],
      'Sat 9': [{ project: 'PROJ-001 (4h)', color: 'green' }],
      'Sun 10': [{ project: 'ADMIN (4h)', color: 'orange' }],
    },
  },
  {
    name: 'Michael Chen',
    role: 'Drota Analyst',
    avatar: 'https://i.pravatar.cc/150?u=michaelchen2',
    utilization: 0,
    allocations: {
      'Wed 6': [{ project: 'PROJ-0', color: 'purple', tooltip: 'Conflict: John Smith is allocated for 12 on PROJ-001 and PROJ-031 (8h)' }],
      'Sun 10': [{ project: '8h', color: 'orange' }],
    },
  },
  {
    name: 'Sarah Lee',
    role: 'UI Designer',
    avatar: 'https://i.pravatar.cc/150?u=sarahlee2',
    utilization: 0,
    allocations: {
      'Wed 6': [{ project: 'PROJ-002 (8h)', color: 'purple' }],
      'Thu 7': [{ project: '8h', color: 'orange' }],
    },
  },
  {
    name: 'David Rodriguez',
    role: 'Senior Developer',
    avatar: 'https://i.pravatar.cc/150?u=davidrodriguez',
    utilization: 0,
    allocations: {},
  },
  {
    name: 'Emily White',
    role: 'UI Designer',
    avatar: 'https://i.pravatar.cc/150?u=emilywhite',
    utilization: 40,
    allocations: {},
  },
  {
    name: 'Emily White',
    role: 'Data Analyst',
    avatar: 'https://i.pravatar.cc/150?u=emilywhite2',
    utilization: 0,
    allocations: {},
  },
  {
    name: 'Alex Turner',
    role: '',
    avatar: 'https://i.pravatar.cc/150?u=alexturner',
    utilization: 0,
    allocations: {},
  },
];

// ============================================================================
// HELPER COMPONENTS & UTILS
// ============================================================================

const getAllocationColor = (color: Allocation['color']) => {
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
  allocation: Allocation;
}

const AllocationBar: React.FC<AllocationBarProps> = ({ allocation }) => (
  <div className="relative">
    <div className={`text-white text-xs font-semibold p-1.5 rounded-md mb-1 ${getAllocationColor(allocation.color)}`}>
      {allocation.project}
    </div>
    {allocation.hasConflict && <TriangleAlert className="w-4 h-4 text-red-500 absolute -bottom-1 -right-2 bg-white rounded-full p-0.5" />}
    {allocation.tooltip && (
      <div className="absolute left-[50%] top-[90%] w-max max-w-xs bg-white p-3 rounded-lg shadow-2xl text-sm z-20 border border-gray-100">
        <p className="font-semibold text-gray-800">Conflict</p>
        <p className="text-gray-600">{allocation.tooltip}</p>
      </div>
    )}
  </div>
);

interface CalendarCellProps {
  allocations: Allocation[];
}

const CalendarCell: React.FC<CalendarCellProps> = ({ allocations }) => (
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

const UtilizationBadge: React.FC<UtilizationBadgeProps> = ({ utilization }) => {
  if (utilization <= 0) return null;
  return (
    <div className={`w-9 h-9 flex-shrink-0 rounded-full border-2 flex items-center justify-center text-xs font-bold ${getUtilizationClasses(utilization)}`}>
      {utilization}%
    </div>
  );
};

interface EmployeeInfoProps {
  member: TeamMember;
}

const EmployeeInfo: React.FC<EmployeeInfoProps> = ({ member }) => (
  <div className="sticky left-0 bg-white p-3 border-b border-gray-200 z-10 flex items-center gap-3">
    <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
    <div className="flex-grow">
      <p className="font-semibold text-gray-800">{member.name}</p>
      <p className="text-xs text-gray-500">{member.role}</p>
    </div>
    <UtilizationBadge utilization={member.utilization} />
  </div>
);

interface GridHeaderProps {
  days: typeof weekDays;
}

const GridHeader: React.FC<GridHeaderProps> = ({ days }) => (
  <>
    <div className="sticky top-0 left-0 bg-white z-20"></div> {/* Corner */}
    <div className="sticky top-0 col-span-6 bg-white z-10">
      <div className="grid grid-cols-6">
        {days.map((day, index) => (
          <div key={index} className="p-3 text-sm font-medium text-gray-500 bg-slate-50 text-left border-b border-l border-gray-200">
            {day.day} <span className="text-gray-400">{day.date}</span>
          </div>
        ))}
      </div>
    </div>
  </>
);

interface AllocationsGridProps {
  team: TeamMember[];
  days: typeof weekDays;
}

const AllocationsGrid: React.FC<AllocationsGridProps> = ({ team, days }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <div className="overflow-x-auto relative">
      <div className="grid" style={{ gridTemplateColumns: '260px repeat(6, 1fr)' }}>
        <GridHeader days={days} />
        {team.map((member, memberIndex) => (
          <React.Fragment key={member.name + memberIndex}>
            <EmployeeInfo member={member} />
            {days.map((day, dayIndex) => {
              const dayKey = `${day.day} ${day.date}`;
              const dailyAllocations = member.allocations[dayKey] || [];
              return <CalendarCell key={dayIndex} allocations={dailyAllocations} />;
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  </div>
);

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

const AppHeader: React.FC = () => (
  <header className="bg-white shadow-sm sticky top-0 z-30">
    <nav className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <LayoutGrid className="w-7 h-7 text-blue-600" />
        <span className="font-bold text-xl text-gray-800">StaffAlloc</span>
      </div>
      <div className="flex items-center gap-8 text-sm font-medium text-gray-600">
        <a href="#" className="hover:text-blue-600">Dashboard</a>
        <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-1">Projects</a>
        <a href="#" className="hover:text-blue-600">Team</a>
        <a href="#" className="hover:text-blue-600">Reports</a>
        <a href="#" className="hover:text-blue-600">Settings</a>
      </div>
    </nav>
  </header>
);

const AllocationsHeader: React.FC = () => (
  <section className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold text-gray-800">Team Allocations</h1>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <button className="p-2 rounded-md hover:bg-gray-100" aria-label="Previous month">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span>November 2025</span>
        <button className="p-2 rounded-md hover:bg-gray-100" aria-label="Next month">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="bg-gray-100 p-1 rounded-lg flex text-sm">
        <button className="py-1 px-4 rounded-md bg-white text-blue-600 shadow-sm font-semibold">Week</button>
        <button className="py-1 px-4 rounded-md text-gray-500 font-medium">Month</button>
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

const WeekOverviewSidebar: React.FC = () => (
  <aside className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Week Overview</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Team Hours:</span>
          <span className="font-semibold text-gray-800">320h</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Average Utilization:</span>
          <span className="font-semibold text-gray-800">78%</span>
        </div>
        <div className="flex items-center gap-2 text-red-600 font-semibold pt-2">
          <CircleAlert className="w-5 h-5"/>
          <span>2 conflicts detected</span>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <div className="w-4 h-4 rounded bg-blue-500"></div>
          <span className="text-gray-600">PROJ-001</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-4 h-4 rounded bg-orange-500"></div>
          <span className="text-gray-600">PROJ-004 / ADMIN</span>
        </div>
      </div>
    </div>
  </aside>
);

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function TeamAllocations() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans text-gray-900">
      <AppHeader />
      <main className="max-w-screen-2xl mx-auto p-6">
        <AllocationsHeader />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-6">
          <AllocationsGrid team={teamData} days={weekDays} />
          <WeekOverviewSidebar />
        </div>
      </main>
    </div>
  );
}