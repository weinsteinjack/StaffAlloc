import { Link } from 'react-router-dom';
import { Blocks, Users, FolderKanban, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

/**
 * Dashboard Page - Landing page after login
 * Provides navigation to main features
 */
export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Blocks className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-slate-800">StaffAlloc</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-700">{user?.full_name}</p>
              <p className="text-xs text-slate-500">{user?.system_role}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome back, {user?.full_name}!</h1>
          <p className="text-slate-600 mb-8">Select a feature to get started with your resource management.</p>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employees Card */}
            <Link
              to="/employees"
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">Employees</h3>
                  <p className="text-sm text-slate-600">
                    Manage employee profiles, skills, and availability across all projects.
                  </p>
                </div>
              </div>
            </Link>

            {/* Projects Card */}
            <Link
              to="/projects"
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition">
                  <FolderKanban className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">Projects</h3>
                  <p className="text-sm text-slate-600">
                    Create and manage projects, timelines, and team assignments.
                  </p>
                </div>
              </div>
            </Link>

            {/* Allocations Card */}
            <Link
              to="/allocations"
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">Allocations</h3>
                  <p className="text-sm text-slate-600">
                    View and manage team allocations, utilization, and resource conflicts.
                  </p>
                </div>
              </div>
            </Link>

            {/* Coming Soon Card */}
            <div className="bg-white rounded-xl shadow-md p-6 opacity-60 cursor-not-allowed">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-100 rounded-lg">
                  <Blocks className="h-6 w-6 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">AI Recommendations</h3>
                  <p className="text-sm text-slate-600">
                    AI-powered insights and recommendations (Coming in Phase 2)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">🚀 MVP Phase - Core Features</h4>
            <p className="text-sm text-blue-800">
              You're using the MVP version of StaffAlloc. The Employees, Projects, and Allocations modules are fully functional.
              Additional features like dashboards and AI recommendations will be available in upcoming releases.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
