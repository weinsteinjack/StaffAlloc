import { useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AlertOctagon,
  ArrowDownToLine,
  BarChart3,
  Loader2,
  PieChart,
  Users
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import { exportPortfolioToExcel, fetchPortfolioDashboard } from '../api/reports';
import { Card, KpiTile, SectionHeader } from '../components/common';
import { saveBlobAsFile } from '../utils/download';

export default function PortfolioDashboard() {
  const portfolioQuery = useQuery({
    queryKey: ['portfolio-dashboard'],
    queryFn: fetchPortfolioDashboard,
    staleTime: 60_000
  });

  const exportMutation = useMutation({
    mutationFn: exportPortfolioToExcel,
    onSuccess: (blob) => {
      const timestamp = new Date().toISOString().slice(0, 10);
      saveBlobAsFile(blob, `staffalloc-portfolio-${timestamp}.xlsx`);
    }
  });

  const roleChartData = useMemo(() => {
    if (!portfolioQuery.data?.fte_by_role) return [];
    return Object.entries(portfolioQuery.data.fte_by_role).map(([role, value]) => ({
      role,
      utilization: value
    }));
  }, [portfolioQuery.data?.fte_by_role]);

  const overAllocated = portfolioQuery.data?.over_allocated_employees ?? [];
  const benchEmployees = portfolioQuery.data?.bench_employees ?? [];

  const utilizationPct = portfolioQuery.data?.overall_utilization_pct ?? 0;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Portfolio Dashboard"
        description="Org-wide health, utilization, and staffing outlook."
        action={
          <button
            type="button"
            onClick={() => exportMutation.mutate()}
            disabled={exportMutation.isPending}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {exportMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowDownToLine className="h-4 w-4" />
            )}
            Export to Excel
          </button>
        }
      />

      {portfolioQuery.isLoading && (
        <Card padding="none" className="p-0">
          <div className="flex h-64 items-center justify-center text-sm text-slate-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading portfolio metrics…
          </div>
        </Card>
      )}

      {portfolioQuery.isError && (
        <Card className="border-red-200 bg-red-50">
          <div className="flex items-center gap-3 text-sm text-red-600">
            <AlertOctagon className="h-5 w-5" />
            <span>Failed to load portfolio dashboard: {portfolioQuery.error instanceof Error ? portfolioQuery.error.message : 'Unknown error'}</span>
          </div>
        </Card>
      )}

      {portfolioQuery.data && !portfolioQuery.isError && (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <KpiTile
              label="Active Projects"
              value={portfolioQuery.data.total_projects}
              subLabel="Across portfolio"
              icon={<Users className="h-5 w-5 text-blue-500" />}
            />
            <KpiTile
              label="Total Headcount"
              value={portfolioQuery.data.total_employees}
              subLabel="Tracked employees"
              icon={<BarChart3 className="h-5 w-5 text-emerald-500" />}
            />
            <KpiTile
              label="Utilization"
              value={`${utilizationPct.toFixed(1)}%`}
              subLabel="Overall FTE"
              icon={<PieChart className="h-5 w-5 text-purple-500" />}
              trend={{
                direction: utilizationPct >= 80 ? 'up' : 'flat',
                label:
                  utilizationPct >= 80
                    ? 'Healthy portfolio utilization'
                    : 'Below target – investigate bench capacity',
                tone: utilizationPct >= 80 ? 'positive' : 'neutral'
              }}
            />
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <Card
              title="FTE by Role"
              description="Role mix derived from projects and assignments. Targets align with executive staffing forecasts."
            >
              {roleChartData.length === 0 ? (
                <p className="text-sm text-slate-500">FTE data by role is not yet available.</p>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roleChartData} margin={{ top: 16, right: 16, left: 0, bottom: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                      <XAxis dataKey="role" tick={{ fill: '#475569', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
                      <Tooltip
                        formatter={(value: number) => [`${value.toFixed(1)}%`, 'Utilization']}
                        labelStyle={{ color: '#1e293b', fontWeight: 600 }}
                      />
                      <Bar dataKey="utilization" fill="#2563eb" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>

            <div className="space-y-6">
              <Card
                title="Over-allocated"
                description="Employees above 100% FTE across all projects."
              >
                {overAllocated.length === 0 ? (
                  <p className="text-sm text-slate-500">No over-allocations detected.</p>
                ) : (
                  <ul className="space-y-3 text-sm text-slate-600">
                    {overAllocated.map((employee) => (
                      <li key={employee.user_id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-slate-800">{employee.full_name}</p>
                          <span className="text-xs font-semibold text-red-600">
                            {employee.fte_percentage.toFixed(1)}% FTE
                          </span>
                        </div>
                        {employee.projects && employee.projects.length > 0 && (
                          <ul className="mt-2 space-y-1 text-xs text-slate-500">
                            {employee.projects.map((project) => (
                              <li key={project.project_id}>
                                {project.project_name} · {project.allocated_hours} hrs
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </Card>

              <Card
                title="Bench Spotlight"
                description="Under 25% FTE availability to redeploy."
              >
                {benchEmployees.length === 0 ? (
                  <p className="text-sm text-slate-500">No bench capacity currently detected.</p>
                ) : (
                  <ul className="space-y-2 text-sm text-slate-600">
                    {benchEmployees.map((employee) => (
                      <li key={employee.user_id} className="flex items-center justify-between rounded-lg border border-slate-200 p-2">
                        <span>{employee.full_name}</span>
                        <span className="text-xs font-semibold text-emerald-600">
                          {employee.fte_percentage.toFixed(1)}% FTE
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
