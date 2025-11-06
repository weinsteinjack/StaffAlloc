import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Loader2, RefreshCw, Sparkles, TriangleAlert } from 'lucide-react';

import { fetchBalanceSuggestions, fetchConflicts, fetchForecast, recommendStaff } from '../api/ai';
import type {
  BalanceSuggestionsResponse,
  ForecastResponse,
  StaffingRecommendationResponse
} from '../types/api';
import { Card, KpiTile, SectionHeader } from '../components/common';

export default function AIRecommendationsPage() {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Staffing' | 'Conflicts' | 'Forecast' | 'Balance'>(
    'All'
  );

  const staffingMutation = useMutation({
    mutationFn: () =>
      recommendStaff({
        project_id: 1,
        role_id: 1,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        required_hours: 160
      })
  });

  const conflictsQuery = useQuery({
    queryKey: ['ai-conflicts'],
    queryFn: fetchConflicts
  });

  const forecastQuery = useQuery({
    queryKey: ['ai-forecast'],
    queryFn: () => fetchForecast(3)
  });

  const balanceQuery = useQuery({
    queryKey: ['ai-balance'],
    queryFn: fetchBalanceSuggestions
  });

  useEffect(() => {
    staffingMutation.mutate();
  }, []);

  const recommendation = staffingMutation.data;
  const conflicts = conflictsQuery.data;
  const forecast = forecastQuery.data as ForecastResponse | undefined;
  const balance = balanceQuery.data as BalanceSuggestionsResponse | undefined;

  const filteredSections = useMemo(() => {
    const sections: { key: string; title: string; type: typeof selectedFilter }[] = [
      { key: 'staffing', title: 'Staffing Recommendations', type: 'Staffing' },
      { key: 'conflicts', title: 'Conflict Alerts', type: 'Conflicts' },
      { key: 'forecast', title: 'Forecast', type: 'Forecast' },
      { key: 'balance', title: 'Workload Balance', type: 'Balance' }
    ];

    return selectedFilter === 'All'
      ? sections
      : sections.filter((section) => section.type === selectedFilter);
  }, [selectedFilter]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="AI Recommendations & Alerts"
        description="Leverage AI insights to unblock staffing decisions, resolve conflicts, and stay ahead of resourcing risks."
        action={
          <button
            type="button"
            onClick={() => {
              staffingMutation.mutate();
              conflictsQuery.refetch();
              forecastQuery.refetch();
              balanceQuery.refetch();
            }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh insights
          </button>
        }
      />

      <section className="grid gap-4 md:grid-cols-4">
        <KpiTile
          label="Staffing Suggestions"
          value={recommendation?.candidates.length ?? 0}
          subLabel="Matches based on availability and skills"
          icon={<Sparkles className="h-5 w-5 text-blue-500" />}
        />
        <KpiTile
          label="Conflicts Detected"
          value={conflicts?.conflicts?.length ?? 0}
          subLabel="Employees over 100% FTE"
          icon={<TriangleAlert className="h-5 w-5 text-amber-500" />}
        />
        <KpiTile
          label="Forecast Horizon"
          value={`${forecast?.forecast_period_months ?? 0} months`}
          subLabel="Projection window"
          icon={<Sparkles className="h-5 w-5 text-purple-500" />}
        />
        <KpiTile
          label="Workload Suggestions"
          value={balance?.suggestions?.length ?? 0}
          subLabel="AI proposals to smooth utilization"
          icon={<RefreshCw className="h-5 w-5 text-emerald-500" />}
        />
      </section>

      <Card>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {['All', 'Staffing', 'Conflicts', 'Forecast', 'Balance'].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter as typeof selectedFilter)}
              className={`rounded-full px-3 py-1 font-semibold ${
                selectedFilter === filter
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </Card>

      {filteredSections.map((section) => {
        switch (section.key) {
          case 'staffing':
            return (
              <Card
                key={section.key}
                title="Recommended Staffing Actions"
                description="The AI evaluates availability, skills, and allocation caps to propose staffing solutions."
              >
                {staffingMutation.isPending ? (
                  <p className="text-sm text-slate-500">Analyzing staffing data…</p>
                ) : recommendation && recommendation.candidates.length > 0 ? (
                  <ul className="space-y-3 text-sm text-slate-600">
                    {recommendation.candidates.map((candidate, index) => (
                      <li key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-slate-800">{candidate.full_name ?? 'Candidate'}</p>
                          <span className="text-xs font-semibold text-blue-600">
                            {Math.round((candidate.current_fte ?? 0) * 100)}% FTE
                          </span>
                        </div>
                        {candidate.skills && candidate.skills.length > 0 && (
                          <p className="mt-1 text-xs text-slate-500">Skills: {candidate.skills.join(', ')}</p>
                        )}
                        {candidate.reasoning && (
                          <p className="mt-2 text-xs text-slate-500">{candidate.reasoning}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">
                    No staffing matches yet. Provide project details to unlock targeted recommendations.
                  </p>
                )}
                {recommendation && (
                  <p className="mt-4 text-xs text-slate-400">Reasoning: {recommendation.reasoning}</p>
                )}
              </Card>
            );

          case 'conflicts':
            return (
              <Card
                key={section.key}
                title="Conflict Alerts"
                description="Identify over-allocations and proposed resolutions."
              >
                {conflictsQuery.isLoading ? (
                  <p className="text-sm text-slate-500">Scanning for conflicts…</p>
                ) : conflicts?.conflicts && conflicts.conflicts.length > 0 ? (
                  <pre className="max-h-64 overflow-y-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
                    {JSON.stringify(conflicts.conflicts, null, 2)}
                  </pre>
                ) : (
                  <p className="text-sm text-slate-500">
                    No over-allocations detected. Keep monitoring as plans evolve.
                  </p>
                )}
                {conflicts?.message && <p className="mt-3 text-xs text-slate-400">{conflicts.message}</p>}
              </Card>
            );

          case 'forecast':
            return (
              <Card
                key={section.key}
                title="Forecast Insights"
                description="Projection of staffing surpluses and shortages based on planned projects."
              >
                {forecastQuery.isLoading ? (
                  <p className="text-sm text-slate-500">Generating forecast…</p>
                ) : forecast ? (
                  <pre className="max-h-64 overflow-y-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
                    {JSON.stringify(forecast.predictions, null, 2)}
                  </pre>
                ) : (
                  <p className="text-sm text-slate-500">
                    Forecasting data unavailable. Ensure upcoming pipeline entries are synced.
                  </p>
                )}
                {forecast?.message && <p className="mt-3 text-xs text-slate-400">{forecast.message}</p>}
              </Card>
            );

          case 'balance':
            return (
              <Card
                key={section.key}
                title="Workload Balancing Suggestions"
                description="Recommendations to redistribute work and prevent burnout."
              >
                {balanceQuery.isLoading ? (
                  <p className="text-sm text-slate-500">Reviewing workload patterns…</p>
                ) : balance?.suggestions && balance.suggestions.length > 0 ? (
                  <pre className="max-h-64 overflow-y-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
                    {JSON.stringify(balance.suggestions, null, 2)}
                  </pre>
                ) : (
                  <p className="text-sm text-slate-500">
                    No balancing opportunities detected. Re-run after new allocations are captured.
                  </p>
                )}
                {balance?.message && <p className="mt-3 text-xs text-slate-400">{balance.message}</p>}
              </Card>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

