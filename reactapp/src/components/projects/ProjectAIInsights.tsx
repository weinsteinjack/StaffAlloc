import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Sparkles, TriangleAlert } from 'lucide-react';

import {
  fetchBalanceSuggestions,
  fetchConflicts,
  fetchForecast,
  recommendStaff
} from '../../api/ai';
import type {
  BalanceSuggestionsResponse,
  ConflictsResponse,
  ForecastResponse,
  StaffingRecommendationResponse
} from '../../types/api';
import { Card } from '../common';

interface ProjectAIInsightsProps {
  projectId: number;
}

export default function ProjectAIInsights({ projectId }: ProjectAIInsightsProps) {
  const [recommendation, setRecommendation] = useState<StaffingRecommendationResponse | null>(null);
  const [conflicts, setConflicts] = useState<ConflictsResponse | null>(null);
  const [balance, setBalance] = useState<BalanceSuggestionsResponse | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);

  const recommendMutation = useMutation({
    mutationFn: (params: { roleId: number; year: number; month: number; requiredHours: number }) =>
      recommendStaff({
        project_id: projectId,
        role_id: params.roleId,
        year: params.year,
        month: params.month,
        required_hours: params.requiredHours
      }),
    onSuccess: (response) => setRecommendation(response)
  });

  const conflictsMutation = useMutation({
    mutationFn: fetchConflicts,
    onSuccess: (response) => setConflicts(response)
  });

  const balanceMutation = useMutation({
    mutationFn: () => fetchBalanceSuggestions(projectId),
    onSuccess: (response) => setBalance(response)
  });

  const forecastMutation = useMutation({
    mutationFn: () => fetchForecast(3),
    onSuccess: (response) => setForecast(response)
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card
        title="Fill open staffing needs"
        description="Let the AI suggest team members based on availability and skills."
      >
        <form
          className="space-y-3 text-sm"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const roleId = Number(formData.get('roleId'));
            const year = Number(formData.get('year'));
            const month = Number(formData.get('month'));
            const requiredHours = Number(formData.get('requiredHours'));
            if (roleId && year && month && requiredHours) {
              recommendMutation.mutate({ roleId, year, month, requiredHours });
            }
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate-500">
              Role ID
              <input
                name="roleId"
                type="number"
                min={1}
                className="mt-1 rounded border border-slate-200 px-2 py-1 text-sm text-slate-700"
                placeholder="e.g. 3"
              />
            </label>
            <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate-500">
              Required hours
              <input
                name="requiredHours"
                type="number"
                min={1}
                className="mt-1 rounded border border-slate-200 px-2 py-1 text-sm text-slate-700"
                placeholder="160"
              />
            </label>
            <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate-500">
              Year
              <input
                name="year"
                type="number"
                min={2024}
                className="mt-1 rounded border border-slate-200 px-2 py-1 text-sm text-slate-700"
                placeholder={String(new Date().getFullYear())}
              />
            </label>
            <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate-500">
              Month
              <input
                name="month"
                type="number"
                min={1}
                max={12}
                className="mt-1 rounded border border-slate-200 px-2 py-1 text-sm text-slate-700"
                placeholder="9"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={recommendMutation.isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {recommendMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Suggest staffing
          </button>
        </form>
        {recommendation && (
          <div className="mt-3 space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700">
            <p className="font-semibold">AI Recommendations</p>
            {recommendation.candidates.length === 0 ? (
              <p>No available candidates for this window.</p>
            ) : (
              <ul className="space-y-1">
                {recommendation.candidates.map((candidate, index) => (
                  <li key={index}>
                    {candidate.full_name ?? 'Candidate'} · {Math.round((candidate.current_fte ?? 0) * 100)}% FTE{' '}
                    {candidate.skills && candidate.skills.length > 0 ? `· Skills: ${candidate.skills.join(', ')}` : ''}
                  </li>
                ))}
              </ul>
            )}
            <p className="text-[11px] font-medium opacity-80">{recommendation.reasoning}</p>
          </div>
        )}
      </Card>

      <Card title="Conflict & Balance" description="Identify overloads and redistribute work with a single click.">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => conflictsMutation.mutate()}
            className="inline-flex items-center gap-1 rounded border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:border-amber-300"
          >
            <TriangleAlert className="h-4 w-4" />
            Detect conflicts
          </button>
          <button
            type="button"
            onClick={() => balanceMutation.mutate()}
            className="inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:border-emerald-300"
          >
            <Sparkles className="h-4 w-4" />
            Balance workload
          </button>
          <button
            type="button"
            onClick={() => forecastMutation.mutate()}
            className="inline-flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:border-blue-300"
          >
            <Sparkles className="h-4 w-4" />
            Forecast needs
          </button>
        </div>

        <div className="mt-3 space-y-3 text-xs text-slate-600">
          {conflictsMutation.isPending && <p>Checking for conflicts…</p>}
          {conflicts?.conflicts && conflicts.conflicts.length > 0 && (
            <pre className="max-h-36 overflow-y-auto rounded-lg bg-slate-900 p-3 text-[11px] text-slate-100">
              {JSON.stringify(conflicts.conflicts, null, 2)}
            </pre>
          )}
          {balanceMutation.isPending && <p>Generating balancing suggestions…</p>}
          {balance?.suggestions && balance.suggestions.length > 0 && (
            <pre className="max-h-36 overflow-y-auto rounded-lg bg-slate-900 p-3 text-[11px] text-slate-100">
              {JSON.stringify(balance.suggestions, null, 2)}
            </pre>
          )}
          {forecastMutation.isPending && <p>Calculating forecast…</p>}
          {forecast?.predictions && forecast.predictions.length > 0 && (
            <pre className="max-h-36 overflow-y-auto rounded-lg bg-slate-900 p-3 text-[11px] text-slate-100">
              {JSON.stringify(forecast.predictions, null, 2)}
            </pre>
          )}
        </div>
      </Card>
    </div>
  );
}

