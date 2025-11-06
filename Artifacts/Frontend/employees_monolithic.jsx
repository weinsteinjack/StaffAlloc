import React from 'react';
import { Blocks, Plus, Search, SlidersHorizontal, ChevronDown, Calendar, Dot } from 'lucide-react';

// Type definitions for clarity
type Employee = {
  name: string;
  role: string;
  email: string;
  avatar: string;
  isInitials: boolean;
  skill: string;
  skillLabel: string;
  progress: number;
  status: 'On Leave' | 'Available';
  statusColor: string;
};

const employeesData: Employee[] = [
  { name: 'Jane Doe', role: 'Software Engineer', email: 'jane.doe@staffalloc.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', isInitials: false, skill: 'React', skillLabel: '<hualiemed', progress: 78, status: 'On Leave', statusColor: 'green' },
  { name: 'John Smith', role: 'Product Designer', email: 'john.smith@staffalloc.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', isInitials: false, skill: 'SQL', skillLabel: '<hualiscript', progress: 92, status: 'On Leave', statusColor: 'green' },
  { name: 'John Smith', role: 'Product Designer', email: 'jatri.doe@staffalloc.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', isInitials: false, skill: 'Sthl', skillLabel: '<kailoyroed', progress: 92, status: 'On Leave', statusColor: 'green' },
  { name: 'John Smith', role: 'Software Engineer', email: 'john.doe@staffalloc.com', avatar: 'JD', isInitials: true, skill: 'SQL', skillLabel: '<haalicymed', progress: 79, status: 'On Leave', statusColor: 'green' },
  { name: 'Emily White', role: 'John &zing Desipioer', email: 'aliee.m@ertarfilloc.com', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', isInitials: false, skill: 'SQL', skillLabel: '<Assigned', progress: 99, status: 'On Leave', statusColor: 'green' },
  { name: 'Alex Scientist', role: 'Engineering Manager', email: 'alex.h@staffalloc.com', avatar: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', isInitials: false, skill: 'SQL', skillLabel: '<haslspned', progress: 99, status: 'On Leave', statusColor: 'green' },
  { name: 'Eirea', role: 'Evtb Fsts Dersmpe', email: 'aiee.doe@staffalloc.com', avatar: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', isInitials: false, skill: 'SQL', skillLabel: '<heallaymed', progress: 51, status: 'Available', statusColor: 'green' },
  { name: 'Alex Martinez', role: 'Engineering Manager', email: 'alee.doe@staffalloc.com', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', isInitials: false, skill: 'Pawis', skillLabel: '<On Leave', progress: 83, status: 'On Leave', statusColor: 'green' },
  { name: 'Emily White', role: 'Esfisiring Meniager', email: 'jahn.doe@staffalloc.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', isInitials: false, skill: 'Stpl', skillLabel: '<iaailgraed', progress: 56, status: 'On Leave', statusColor: 'green' },
  { name: 'Full Stack Developer', role: 'Extrsirdinarg Alotions', email: 'pandas@staffalloc.com', avatar: 'AM', isInitials: true, skill: 'SQL', skillLabel: '<iaailonsed', progress: 48, status: 'On Leave', statusColor: 'green' },
  { name: 'Uuta Scientier', role: 'Devchine Learning', email: 'pandas@staffalloc.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', isInitials: false, skill: 'StDL', skillLabel: '<Auslismed', progress: 18, status: 'On Leave', statusColor: 'green' },
  { name: 'DevOps Engineer', role: 'Devblte fbg lieetliot', email: 'sql@staffalloc.com', avatar: 'https://images.unsplash.com/photo-1530268729831-4b0b9e170218?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', isInitials: false, skill: 'Rqbl', skillLabel: '<laelermed', progress: 12, status: 'On Leave', statusColor: 'green' },
];

const PillButton = ({ children, active = false, className = '' }: { children: React.ReactNode; active?: boolean; className?: string }) => {
  const baseClasses = 'px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200';
  const activeClasses = 'bg-blue-600 text-white';
  const inactiveClasses = 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100';
  return (
    <button className={`${baseClasses} ${active ? activeClasses : inactiveClasses} ${className}`}>
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

const EmployeeCard = ({ employee }: { employee: Employee }) => (
  <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center gap-4">
      {employee.isInitials ? (
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
          {employee.avatar}
        </div>
      ) : (
        <img className="w-12 h-12 rounded-full object-cover" src={employee.avatar} alt={`Photo of ${employee.name}`} />
      )}
      <div>
        <h3 className="font-semibold text-slate-800 text-lg">{employee.name}</h3>
        <p className="text-sm text-slate-500">{employee.role}</p>
        <p className="text-xs text-slate-400 mt-1">{employee.email}</p>
      </div>
    </div>
    <div className="mt-4 space-y-3 text-sm">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-slate-800 font-medium">{employee.skill}</span>
          <span className="text-slate-400 text-xs">{employee.skillLabel}</span>
        </div>
        <div className="flex items-center gap-2">
           <div className={`w-2.5 h-2.5 rounded-full ${employee.status === 'Available' ? 'bg-green-500' : 'bg-green-500'}`}></div>
          <span className="text-slate-600">{employee.status}</span>
        </div>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-1.5">
        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${employee.progress}%` }}></div>
      </div>
      <div className="flex justify-end">
          <span className="text-slate-800 font-medium">{employee.progress > 100 ? `${(employee.progress / 10).toFixed(1)}%` : `${employee.progress}%`}</span>
      </div>
    </div>
    <div className="mt-auto pt-4 border-t border-slate-200 flex justify-between items-center text-sm font-medium">
      <a href="#" className="text-blue-600 hover:underline">View Details</a>
      <a href="#" className="text-blue-600 hover:underline">View Details</a>
    </div>
  </div>
);

export default function TeamDashboard() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Blocks className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-slate-800">StaffAlloc</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1">Dashboard</a>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-800">Projects</a>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-800">Teams</a>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-800">Employees</a>
            </nav>
            <div className="flex items-center">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors">
                <Plus size={16} />
                Add Employee
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Area */}
          <div className="flex-grow">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-slate-800">Team Members</h1>
              <p className="text-slate-500 mt-1">Manage employee profiles, skills, and availability.</p>
            </div>

            {/* Filters */}
            <div className="space-y-4 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <PillButton active>All</PillButton>
                <PillButton>Eevaestt</PillButton>
                <PillButton>Designers</PillButton>
                <PillButton>Managers</PillButton>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <PillButton className="bg-slate-200 border-slate-200">39%</PillButton>
                <PillButton>Availability</PillButton>
                <PillButton>Data Scientists</PillButton>
                <button className="bg-white border border-slate-300 text-slate-700 px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-100">
                  <SlidersHorizontal size={16} />
                  Additional Filters
                  <div className="bg-slate-100 rounded-md p-1 -mr-2">
                    <Plus size={14} className="text-slate-500" />
                  </div>
                </button>
              </div>
            </div>

            {/* Employee Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {employeesData.map((employee, index) => (
                <EmployeeCard key={index} employee={employee} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[350px] flex-shrink-0">
            <div className="space-y-6 sticky top-24">
              <StatCard title="Team Overview">
                <p className="text-sm text-slate-500 mt-2">Total Employees: 47</p>
                <div className="relative mt-4 flex justify-center items-center h-48">
                  <svg className="transform -rotate-90" width="160" height="160" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="15.915" fill="none" stroke="#e6e6e6" strokeWidth="4"></circle>
                    <circle cx="20" cy="20" r="15.915" fill="none" stroke="#2563eb" strokeWidth="4" strokeDasharray="60, 100" strokeDashoffset="0"></circle>
                    <circle cx="20" cy="20" r="15.915" fill="none" stroke="#14b8a6" strokeWidth="4" strokeDasharray="38, 100" strokeDashoffset="-60"></circle>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-bold text-slate-800">60%</span>
                  </div>
                   <div className="absolute top-4 left-0 text-center">
                    <span className="text-xs font-semibold text-slate-700">React</span>
                    <span className="text-xs block text-slate-500">38%</span>
                  </div>
                  <div className="absolute bottom-1 right-1 text-center">
                    <span className="text-xs font-semibold text-slate-700">SQL</span>
                    <span className="text-xs block text-slate-500">6W%</span>
                  </div>
                   <div className="absolute bottom-0 left-0 text-center">
                    <span className="text-xs font-semibold text-slate-700">AWT</span>
                    <span className="text-xs block text-slate-500">60%</span>
                  </div>
                </div>
              </StatCard>
              
              <StatCard title="Team Stats">
                <h4 className="font-medium text-slate-700 text-sm mt-4">Utilization by Status</h4>
                <div className="flex items-end justify-between h-32 mt-2 gap-2">
                  <div className="w-full h-[60%] bg-blue-600 rounded-t-md"></div>
                  <div className="w-full h-[90%] bg-blue-600 rounded-t-md"></div>
                  <div className="w-full h-[30%] bg-blue-600 rounded-t-md"></div>
                  <div className="w-full h-[75%] bg-blue-600 rounded-t-md"></div>
                  <div className="w-full h-[50%] bg-blue-600 rounded-t-md"></div>
                </div>
                 <div className="flex justify-between text-xs text-slate-500 border-t mt-1 pt-1">
                    <span>Pest</span>
                    <span>Tkis</span>
                    <span>AuS</span>
                    <span>5%</span>
                    <span>Sok</span>
                 </div>
              </StatCard>

              <StatCard title="Top Skills in Demand">
                {/* Content for this card is not detailed in the image */}
              </StatCard>

              <StatCard title="Team Availability">
                 <div className="mt-4">
                    <div className="grid grid-cols-7 text-center text-xs text-slate-500 font-medium">
                        <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
                    </div>
                    <div className="grid grid-cols-7 text-center text-sm mt-2">
                        {[...Array(31)].map((_, i) => (
                            <div key={i} className={`py-1 ${i + 1 === 18 ? 'bg-blue-600 text-white rounded-full' : ''}`}>
                                {i + 1}
                            </div>
                        ))}
                    </div>
                 </div>
              </StatCard>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}