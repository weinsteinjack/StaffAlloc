import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Loader2, MapPin } from 'lucide-react';
import dayjs from 'dayjs';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import { fetchEmployee } from '../api/users';
import { fetchEmployeeTimeline } from '../api/reports';
import type { EmployeeTimelineEntry } from '../types/api';
import { Card, SectionHeader } from '../components/common';

function formatMonthLabel(entry: EmployeeTimelineEntry) {
  return dayjs()
    .year(entry.year)
    .month(entry.month - 1)
    .format('MMM YYYY');
}

export default function EmployeeTimelinePage() {
  const params = useParams();
  const employeeId = Number(params.employeeId);

  if (Number.isNaN(employeeId)) {
    return <Navigate to="/teams" replace />;
  }

  const employeeQuery = useQuery({
    queryKey: ['employee', employeeId],
    queryFn: () => fetchEmployee(employeeId),
    staleTime: 60_000
  });

  const timelineQuery = useQuery({
    queryKey: ['employee-timeline', employeeId],
    queryFn: () => fetchEmployeeTimeline(employeeId),
    staleTime: 60_000
  });

  const projectCount = employeeQuery.data?.assignments?.length ?? 0;
  const totalHours = timelineQuery.data?.timeline.reduce((sum, entry) => sum + entry.total_hours, 0) ?? 0;

  const chartData = useMemo(() => {
    if (!timelineQuery.data?.timeline) return [];
    return timelineQuery.data.timeline.map((entry) => ({
      month: formatMonthLabel(entry),
      hours: entry.total_hours
    }));
  }, [timelineQuery.data?.timeline]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/teams"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to teams
        </Link>
      </div>

      {employeeQuery.isLoading ? (
        <Card padding="none" className="p-0">
          <div className="flex h-40 items-center justify-center text-sm text-slate-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading employee profile…
          </div>
        </Card>
      ) : employeeQuery.isError || !employeeQuery.data ? (
        <Card className="border-red-200 bg-red-50 text-sm text-red-600">
          Failed to load employee details.
        </Card>
      ) : (
        <SectionHeader
          title={employeeQuery.data.full_name}
          description={
            <span className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                Last login{' '}
                {employeeQuery.data.last_login_at
                  ? new Date(employeeQuery.data.last_login_at).toLocaleDateString()
                  : 'not recorded'}
              </span>
              <span>System role: {employeeQuery.data.system_role}</span>
              <span>{employeeQuery.data.email}</span>
            </span>
          }
          action={
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <MapPin className="h-3.5 w-3.5" />
              Assigned to {projectCount} project{projectCount === 1 ? '' : 's'}
            </span>
          }
        />
      )}

      <section className="grid gap-4 md:grid-cols-3">
        <Card title="Total Allocated Hours" description="Summed across the selected timeline.">
          <p className="text-3xl font-bold text-slate-900">{totalHours.toLocaleString()} hrs</p>
          <p className="text-xs text-slate-500">
            Track trends by month below to understand workload hotspots.
          </p>
        </Card>
        <Card title="Projects" description="Current assignments pulled from staffing records.">
          <p className="text-3xl font-bold text-slate-900">{projectCount}</p>
          <p className="text-xs text-slate-500">
            Visit individual projects to adjust allocations or reassign work.
          </p>
        </Card>
        <Card title="Active Status" description="Availability for upcoming assignments.">
          <p className="text-3xl font-bold text-slate-900">
            {employeeQuery.data?.is_active ? 'Available' : 'On Leave'}
          </p>
          <p className="text-xs text-slate-500">
            Status can be managed from the employee profile once HR integration lands.
          </p>
        </Card>
      </section>

      <Card title="Monthly allocation trend" description="Shows total hours across all projects per month.">
        {timelineQuery.isLoading ? (
          <div className="flex h-64 items-center justify-center text-sm text-slate-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Building timeline…
          </div>
        ) : timelineQuery.isError ? (
          <div className="text-sm text-red-600">
            Failed to load allocation timeline. Try refreshing the page.
          </div>
        ) : chartData.length === 0 ? (
          <p className="text-sm text-slate-500">No allocation history recorded for this employee.</p>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 16, right: 24, left: 0, bottom: 16 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 12 }} />
                <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
                <Tooltip formatter={(value: number) => [`${value} hrs`, 'Hours']} />
                <Bar dataKey="hours" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <Card title="Timeline details" description="Month-by-month allocation breakdown with project context.">
        {timelineQuery.isLoading ? (
          <div className="flex h-32 items-center justify-center text-sm text-slate-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading timeline details…
          </div>
        ) : timelineQuery.isError ? (
          <div className="text-sm text-red-600">Unable to load timeline data.</div>
        ) : !timelineQuery.data || timelineQuery.data.timeline.length === 0 ? (
          <p className="text-sm text-slate-500">
            Allocations will appear here once this teammate is staffed on a project.
          </p>
        ) : (
          <div className="grid gap-3">
            {timelineQuery.data.timeline.map((entry) => (
              <div
                key={`${entry.year}-${entry.month}`}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-800">{formatMonthLabel(entry)}</p>
                  <p className="font-semibold text-slate-700">{entry.total_hours} hrs</p>
                </div>
                {entry.allocations && entry.allocations.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs text-slate-500">
                    {entry.allocations.map((allocation) => (
                      <li key={allocation.assignment_id ?? `${allocation.project_id}-${entry.month}`}>
                        {allocation.project_name} · {allocation.allocated_hours} hrs
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

