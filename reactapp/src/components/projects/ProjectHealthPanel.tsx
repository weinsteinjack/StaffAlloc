import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertOctagon, Loader2 } from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import { fetchProjectDashboard } from '../../api/reports';
import { Card, KpiTile } from '../common';

interface ProjectHealthPanelProps {
  projectId: number;
}

export default function ProjectHealthPanel({ projectId }: ProjectHealthPanelProps) {
  const dashboardQuery = useQuery({
    queryKey: ['project-dashboard', projectId],
    queryFn: () => fetchProjectDashboard(projectId),
    staleTime: 60_000
  });

  const chartData = useMemo(() => {
    if (!dashboardQuery.data?.burn_down_data || dashboardQuery.data.burn_down_data.length === 0) {
      return [];
    }

    return dashboardQuery.data.burn_down_data.map((point) => ({
      label: point.label,
      planned: point.planned_hours ?? 0,
      actual: point.actual_hours ?? 0
    }));
  }, [dashboardQuery.data?.burn_down_data]);

  if (dashboardQuery.isLoading) {
    return (
      <Card padding="none" className="p-0">
        <div className="flex h-48 items-center justify-center text-sm text-slate-500">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Calculating project health…
        </div>
      </Card>
    );
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return (
      <Card className="border-red-200 bg-red-50">
        <div className="flex items-center gap-3 text-sm text-red-600">
          <AlertOctagon className="h-5 w-5" />
          <span>
            Failed to load project health metrics:{' '}
            {dashboardQuery.error instanceof Error ? dashboardQuery.error.message : 'Unknown error'}
          </span>
        </div>
      </Card>
    );
  }

  const dashboard = dashboardQuery.data;

  return (
    <div className="space-y-4">
      <section className="grid gap-4 md:grid-cols-3">
        <KpiTile
          label="Funded Hours"
          value={`${dashboard.total_funded_hours.toLocaleString()}`}
          subLabel="Contracted budget"
        />
        <KpiTile
          label="Allocated Hours"
          value={`${dashboard.total_allocated_hours.toLocaleString()}`}
          subLabel="Across all team members"
        />
        <KpiTile
          label="Utilization"
          value={`${dashboard.utilization_pct.toFixed(1)}%`}
          subLabel="Funded vs. allocated"
          trend={{
            direction: dashboard.utilization_pct > 100 ? 'up' : 'flat',
            label:
              dashboard.utilization_pct > 100
                ? 'Over budget – adjust allocations'
                : 'Within limits',
            tone: dashboard.utilization_pct > 100 ? 'negative' : 'neutral'
          }}
        />
      </section>

      <Card title="Burn-down trajectory" description="Track planned vs. allocated hours across sprints.">
        {chartData.length === 0 ? (
          <p className="text-sm text-slate-500">
            Burn-down data will appear once allocations have been planned over time.
          </p>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 16, right: 24, left: 0, bottom: 16 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fill: '#475569', fontSize: 12 }} />
                <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
                <Tooltip formatter={(value: number) => [`${value.toLocaleString()} hrs`, 'Hours']} />
                <Legend />
                <Line type="monotone" dataKey="planned" stroke="#6366f1" strokeWidth={2} dot={false} name="Planned" />
                <Line type="monotone" dataKey="actual" stroke="#22c55e" strokeWidth={2} dot={false} name="Allocated" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
}

