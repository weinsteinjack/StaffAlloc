tsx
import React, { FC, SVGProps } from 'react';
import { BrainCircuit, Cpu, Lightbulb, RefreshCw, Sparkles } from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

type CategoryColor = 'blue' | 'red' | 'purple';

type TagColor = 'red' | 'yellow';

type Recommendation = {
  category: string;
  categoryColor: CategoryColor;
  priority: Priority;
  rightTag: string;
  rightTagColor: TagColor;
  title: string;
  description: string;
  details: { label: string; value: string }[];
  avatarUrl?: string;
  suggestedAction?: string;
  generatedTime: string;
  model: string;
};

type Filter = {
  name: string;
  count: number;
  active: boolean;
};

// ============================================================================
// MOCK DATA
// ============================================================================

const filters: Filter[] = [
  { name: 'All', count: 6, active: true },
  { name: 'Staffing', count: 3, active: false },
  { name: 'Conflicts', count: 1, active: false },
  { name: 'Workload Balance', count: 1, active: false },
];

const recommendationsData: Recommendation[] = [
  {
    category: 'Staffing',
    categoryColor: 'blue',
    priority: 'HIGH',
    rightTag: 'MDRUBIITY',
    rightTagColor: 'red',
    title: 'Staff Shortage Detected',
    description: 'Project "Customer Podsig" is understaffed, rissing delays. Recommend allocating additional resources.',
    details: [
      { label: 'Project', value: 'Ser React Developer' },
      { label: 'Required', value: 'Senior React Developer' },
      { label: 'Time Period', value: 'Sprint 3-5 (Nov 15 - Dec 31)' },
    ],
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    suggestedAction: 'Suggested Asnak',
    generatedTime: '2 hours ago',
    model: 'StaffSmart v2.1',
  },
  {
    category: 'Conflicts',
    categoryColor: 'red',
    priority: 'MEDIUM',
    rightTag: '',
    rightTagColor: 'yellow',
    title: 'Allocation Conflict Detected',
    description: 'John Doe is double booked for Sprint 4, assigned to both "Customer Idetign" and "Mobile App Development"',
    details: [
      { label: 'Project', value: 'Mobile App Advelopment' },
      { label: 'Required', value: 'Full Stack Developer' },
    ],
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    suggestedAction: 'Reallocate John or find substitute',
    generatedTime: '1 hours ago',
    model: 'StaffSmart v2.1',
  },
  {
    category: 'Forecast',
    categoryColor: 'purple',
    priority: 'MEDIUM',
    rightTag: 'Forecast',
    rightTagColor: 'yellow',
    title: 'Optimization Opportunity',
    description: 'Upcoming holiday season moving S&A, Wssizz reduced capacity in December. Projects could dev/apacts 15%',
    details: [
      { label: 'Project', value: 'Senior Front-End Upgrade' },
      { label: 'Role', value: 'Senior Froint Decl Dev' },
      { label: 'Suggested', value: 'Santor Bast 11 (Dcaters' },
    ],
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    suggestedAction: 'Pre-allocate resources',
    generatedTime: '3 hours ago',
    model: 'StaffSmart v2.1',
  },
  {
    category: 'Training',
    categoryColor: 'blue',
    priority: 'LOW',
    rightTag: '',
    rightTagColor: 'yellow',
    title: 'Skill Gap Identified',
    description: 'Team lacks expertise in "Cloud Migratily" for new "Data Migration Project". Trained existing skill Training or hiring recommended.',
    details: [
      { label: 'Capacity Forecast Warning', value: '' },
      { label: 'Project', value: 'Q4 Initiatives' },
      { label: 'Time Period', value: 'Dec 2025' },
    ],
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704g',
    suggestedAction: 'Hire current staff or hire',
    generatedTime: '3 hours ago',
    model: 'StaffSmart v2.1',
  },
];

const topSkills = ['React', 'Machine Learning', 'AWS', 'Machine Learning', 'DevOps', 'Python', 'Cybersecurity'];

// ============================================================================
// ATOMIC & REUSABLE COMPONENTS
// ============================================================================

interface TagProps {
  text: string;
  color: string;
  type: 'priority' | 'category';
}

const Tag: FC<TagProps> = ({ text, color, type }) => {
  const colorClasses = {
    priority: {
      HIGH: 'bg-red-100 text-red-700',
      MEDIUM: 'bg-amber-100 text-amber-700',
      LOW: 'bg-green-100 text-green-700',
    },
    category: {
      blue: 'bg-blue-100 text-blue-700',
      red: 'bg-red-100 text-red-700',
      purple: 'bg-purple-100 text-purple-700',
      yellow: 'bg-amber-100 text-amber-700',
    },
  };
  
  const classes = type === 'priority' 
    ? colorClasses.priority[text.split(' ')[0] as Priority] 
    : colorClasses.category[color as keyof typeof colorClasses.category];

  return (
    <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded-md ${classes}`}>
      {text}
    </span>
  );
};

interface DonutChartProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

const DonutChart: FC<DonutChartProps> = ({ percentage, size=160, strokeWidth=18 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" /> 
                        <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                </defs>
                <circle
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    stroke="url(#gradient)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-sm text-gray-500">Current Utilization</span>
                 <span className="text-2xl font-bold text-gray-800">{percentage}% utilized</span>
            </div>
        </div>
    );
}

// ============================================================================
// LAYOUT & SECTION COMPONENTS
// ============================================================================

const AppHeader: FC = () => {
    const navItems = ['Dashboard', 'Projects', 'Staff', 'Reports'];
    return (
        <header className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-md">
            <nav className="max-w-screen-xl mx-auto px-6 py-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <BrainCircuit className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-wider">AI⁺ StaffAlloc</span>
                </div>
                <ul className="hidden md:flex items-center gap-2">
                    {navItems.map(item => (
                        <li key={item}>
                            <a href="#" className="px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors">
                                {item}
                            </a>
                        </li>
                    ))}
                    <li>
                        <a href="#" className="relative px-4 py-2 rounded-lg text-sm font-semibold bg-white/20 transition-colors flex items-center gap-2">
                            Recommendations
                            <span className="bg-white/20 p-0.5 rounded-full"><Sparkles className="h-3 w-3 text-purple-200" /></span>
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

const PageHeader: FC = () => (
    <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-full shadow-sm">
                <Cpu className="h-10 w-10 text-indigo-600" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-slate-900">AI-Driven Staffing Recommendations</h1>
                <p className="text-slate-500 mt-1">Smart suggestions to optimize your team allocation</p>
            </div>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:bg-indigo-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <RefreshCw className="h-4 w-4" />
            Refresh Recommendations
        </button>
    </div>
);

interface FilterTabsProps {
    items: Filter[];
}

const FilterTabs: FC<FilterTabsProps> = ({ items }) => (
    <div className="flex items-center gap-3 mb-8">
        {items.map(filter => (
            <button key={filter.name} className={`px-4 py-1.5 text-sm font-semibold rounded-full flex items-center gap-2 transition-colors ${filter.active ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-200'}`}>
                {filter.name}
                <span className={`px-2 py-0.5 text-xs rounded-full ${filter.active ? 'bg-white/30' : 'bg-slate-200 text-slate-500'}`}>{filter.count}</span>
            </button>
        ))}
    </div>
);

interface RecommendationCardProps {
    recommendation: Recommendation;
}

const RecommendationCard: FC<RecommendationCardProps> = ({ recommendation: rec }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200/50 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
                <Tag text={rec.category} color={rec.categoryColor} type="category" />
                {rec.priority && <Tag text={`${rec.priority} PRIORITY`} color={rec.priority} type="priority" />}
            </div>
            {rec.rightTag && <Tag text={rec.rightTag} color={rec.rightTagColor} type="category" />}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
                <h3 className="font-bold text-lg text-slate-900 mb-2">{rec.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{rec.description}</p>
            </div>

            <div className="md:w-1/2 flex flex-col items-start md:items-end text-left md:text-right gap-3">
                <div className="text-sm text-slate-600 w-full">
                    {rec.details.map(detail => (
                        <p key={detail.label}>
                            <span className="font-semibold text-slate-700">{detail.label}: </span>
                            {detail.value}
                        </p>
                    ))}
                </div>

                <div className="flex items-center gap-4 mt-2 w-full justify-between md:justify-end">
                    {rec.avatarUrl && <img src={rec.avatarUrl} alt="User avatar" className="w-10 h-10 rounded-full" />}
                    <div className="flex flex-col items-start md:items-end">
                        <p className="text-sm font-semibold text-slate-700">{rec.suggestedAction}</p>
                        <p className="text-xs text-slate-400 mt-1">Generated {rec.generatedTime} &middot; AI Model: {rec.model}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 mt-2 pt-2 border-t border-slate-200/80 w-full justify-end">
                    <button className="px-4 py-1.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">View Details</button>
                    <button className="text-sm text-slate-500 hover:text-slate-700 hover:underline">Dismiss</button>
                </div>
            </div>
        </div>
    </div>
);

interface InsightSectionProps {
    title: string;
    children: React.ReactNode;
}

const InsightSection: FC<InsightSectionProps> = ({ title, children }) => (
    <div>
        <h3 className="font-semibold text-slate-800 border-b pb-2 mb-3">{title}</h3>
        <div className="text-sm text-slate-600 space-y-1">
            {children}
        </div>
    </div>
);

const Sidebar: FC<{ skills: string[] }> = ({ skills }) => (
    <aside className="lg:col-span-1">
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200/50 sticky top-8">
            <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="h-6 w-6 text-indigo-600" />
                <h2 className="text-xl font-bold text-slate-900">AI Insights</h2>
            </div>

            <div className="flex flex-col items-center mb-8">
                <DonutChart percentage={78} />
            </div>

            <div className="space-y-6">
                <InsightSection title="Upcoming Capacity Gaps">
                    <p>Dec 2025: -2 developers</p>
                    <p>Jan 2026: -3 data scientists</p>
                </InsightSection>
                
                <InsightSection title="Top Skills in Demand">
                    {skills.map((skill, i) => <p key={i}>{skill}</p>)}
                </InsightSection>

                <div className="text-center pt-4">
                    <h3 className="font-semibold text-slate-800">Model Accuracy</h3>
                    <p className="text-5xl font-bold text-indigo-600 my-1">92%</p>
                    <p className="text-xs text-slate-400">Last Updated: 5 minutes ago</p>
                </div>
            </div>
        </div>
    </aside>
);

// ============================================================================
// MAIN VIEW COMPONENT
// ============================================================================

export default function AIRecommendationsView() {
  return (
    <div className="bg-slate-100 min-h-screen font-sans text-slate-800">
      <AppHeader />
      <main className="max-w-screen-xl mx-auto p-6 lg:p-8">
        <PageHeader />
        <FilterTabs items={filters} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            {recommendationsData.map((rec, index) => (
              <RecommendationCard key={index} recommendation={rec} />
            ))}
          </div>
          <Sidebar skills={topSkills} />
        </div>
      </main>
    </div>
  );
}