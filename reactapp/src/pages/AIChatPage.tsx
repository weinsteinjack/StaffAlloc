import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Loader2, RefreshCw, ShieldAlert, Sparkles, TerminalSquare } from 'lucide-react';
import dayjs from 'dayjs';

import { chatWithAI, fetchBalanceSuggestions, fetchConflicts, fetchForecast, recommendStaff, triggerReindex } from '../api/ai';
import type {
  BalanceSuggestionsResponse,
  ChatQueryResponse,
  ConflictsResponse,
  ForecastResponse,
  StaffingRecommendationResponse
} from '../types/api';
import { Card, SectionHeader } from '../components/common';
import { ChatMessage, PresetButton } from '../components/ai';

interface ConversationEntry {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

const PRESET_PROMPTS = [
  {
    label: "What's John Smith's total allocation for Q4?",
    description: 'Portfolio roll-up across all projects for a key engineer.',
    prompt: "What is John Smith's total allocation for Q4?"
  },
  {
    label: 'Show Cyber Analysts under 50% FTE in November',
    description: 'Quickly surface available analysts for new project needs.',
    prompt: 'Show me all Cyber Analysts with less than 50% FTE in November.'
  },
  {
    label: 'Forecast Senior Developer shortages',
    description: 'Spot hiring needs using the proactive forecast API.',
    prompt: 'Do we have a shortage of Senior Developers in the next quarter?'
  }
];

function buildTimestamp() {
  return dayjs().format('MMM D, YYYY • h:mm A');
}

export default function AIChatPage() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<ConversationEntry[]>(() => {
    try {
      const stored = localStorage.getItem('staffalloc-ai-chat-history');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to parse chat history from storage', error);
    }
    return [];
  });
  const [recommendation, setRecommendation] = useState<StaffingRecommendationResponse | null>(null);
  const [conflictSummary, setConflictSummary] = useState<ConflictsResponse | null>(null);
  const [forecastSummary, setForecastSummary] = useState<ForecastResponse | null>(null);
  const [balanceSummary, setBalanceSummary] = useState<BalanceSuggestionsResponse | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [history]);

  const chatMutation = useMutation({
    mutationFn: chatWithAI,
    onSuccess: (response: ChatQueryResponse) => {
      appendMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.answer,
        createdAt: buildTimestamp()
      });
    },
    onError: (error: Error) => {
      appendMessage({
        id: crypto.randomUUID(),
        role: 'system',
        content: `Unable to complete the request: ${error.message}. Try again once the AI service is online.`,
        createdAt: buildTimestamp()
      });
    }
  });

  const recommendMutation = useMutation({
    mutationFn: recommendStaff,
    onSuccess: (response) => {
      setRecommendation(response);
    }
  });

  const conflictsMutation = useMutation({
    mutationFn: fetchConflicts,
    onSuccess: (response) => {
      setConflictSummary(response);
    }
  });

  const forecastMutation = useMutation({
    mutationFn: fetchForecast,
    onSuccess: (response) => {
      setForecastSummary(response);
    }
  });

  const balanceMutation = useMutation({
    mutationFn: fetchBalanceSuggestions,
    onSuccess: (response) => {
      setBalanceSummary(response);
    }
  });

  const reindexMutation = useMutation({
    mutationFn: triggerReindex,
    onSuccess: () => {
      appendMessage({
        id: crypto.randomUUID(),
        role: 'system',
        content: 'Reindex request accepted. Background job will refresh embeddings shortly.',
        createdAt: buildTimestamp()
      });
    }
  });

  const appendMessage = (entry: ConversationEntry) => {
    setHistory((prev) => {
      const next = [...prev, entry];
      localStorage.setItem('staffalloc-ai-chat-history', JSON.stringify(next));
      return next;
    });
  };

  const handleSubmit = async (prompt: string) => {
    if (!prompt.trim()) return;
    appendMessage({
      id: crypto.randomUUID(),
      role: 'user',
      content: prompt.trim(),
      createdAt: buildTimestamp()
    });
    chatMutation.mutate({ query: prompt.trim() });
  };

  const presetButtons = useMemo(
    () =>
      PRESET_PROMPTS.map((preset) => (
        <PresetButton
          key={preset.label}
          label={preset.label}
          description={preset.description}
          icon={<Sparkles className="h-4 w-4" />}
          onSelect={() => {
            setInput(preset.prompt);
            handleSubmit(preset.prompt);
          }}
        />
      )),
    []
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <section className="space-y-4">
        <SectionHeader
          title="StaffAlloc AI Assistant"
          description="Ask questions about allocations, utilization, and availability across your portfolio."
          action={
            <button
              type="button"
              onClick={() => {
                setHistory([]);
                localStorage.removeItem('staffalloc-ai-chat-history');
                setRecommendation(null);
                setConflictSummary(null);
                setForecastSummary(null);
                setBalanceSummary(null);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Clear conversation
            </button>
          }
        />

        <Card>
          <div className="grid gap-3 md:grid-cols-3">{presetButtons}</div>
        </Card>

        <Card padding="none" className="flex h-[520px] flex-col">
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
            {history.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-sm text-slate-500">
                <Brain className="mb-3 h-10 w-10 text-blue-500" />
                <p className="font-semibold text-slate-700">Start a conversation with the StaffAlloc AI.</p>
                <p className="mt-1">Use the preset prompts or ask your own question about allocations.</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {history.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <ChatMessage role={message.role} content={message.content} timestamp={message.createdAt} />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            {chatMutation.isPending && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                AI composing response…
              </div>
            )}
          </div>
          <form
            className="border-t border-slate-200 bg-slate-50 p-4"
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit(input);
              setInput('');
            }}
          >
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Ask anything about staffing, utilization, or allocations…"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </form>
        </Card>
      </section>

      <section className="space-y-4">
        <Card
          title="Maintenance Tools"
          description="Keep the RAG cache fresh so answers reflect the latest staffing updates."
        >
          <button
            type="button"
            onClick={() => reindexMutation.mutate()}
            disabled={reindexMutation.isPending}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {reindexMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <TerminalSquare className="h-4 w-4 text-blue-500" />
            )}
            Trigger RAG reindex
          </button>
          {reindexMutation.isError && (
            <p className="mt-2 text-xs font-semibold text-red-600">
              Failed to trigger reindex. Ensure the AI service is running.
            </p>
          )}
        </Card>

        <Card
          title="Staffing Recommendations"
          description="Ask the AI to suggest available teammates for a specific role based on required hours."
        >
          <form
            className="space-y-3 text-sm"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const projectId = Number(formData.get('projectId'));
              const roleId = Number(formData.get('roleId'));
              const year = Number(formData.get('year'));
              const month = Number(formData.get('month'));
              const requiredHours = Number(formData.get('requiredHours'));
              if (projectId && roleId && year && month && requiredHours) {
                recommendMutation.mutate({ project_id: projectId, role_id: roleId, year, month, required_hours: requiredHours });
              }
            }}
          >
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate-500">
                Project ID
                <input name="projectId" type="number" min={1} className="mt-1 rounded border border-slate-200 px-2 py-1 text-sm text-slate-700" />
              </label>
              <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate-500">
                Role ID
                <input name="roleId" type="number" min={1} className="mt-1 rounded border border-slate-200 px-2 py-1 text-sm text-slate-700" />
              </label>
              <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate-500">
                Year
                <input name="year" type="number" min={2024} className="mt-1 rounded border border-slate-200 px-2 py-1 text-sm text-slate-700" />
              </label>
              <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate-500">
                Month
                <input name="month" type="number" min={1} max={12} className="mt-1 rounded border border-slate-200 px-2 py-1 text-sm text-slate-700" />
              </label>
            </div>
            <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate-500">
              Required hours
              <input name="requiredHours" type="number" min={1} className="mt-1 rounded border border-slate-200 px-2 py-1 text-sm text-slate-700" />
            </label>
            <button
              type="submit"
              disabled={recommendMutation.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {recommendMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Get recommendations
            </button>
          </form>
          {recommendation && (
            <div className="mt-3 space-y-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
              <p className="font-semibold">AI Suggestions</p>
              {recommendation.candidates.length === 0 ? (
                <p>No candidates available. Adjust hours or timeframe.</p>
              ) : (
                <ul className="space-y-1">
                  {recommendation.candidates.map((candidate, index) => (
                    <li key={index}>
                      {candidate.full_name ?? 'Candidate'} · {Math.round((candidate.current_fte ?? 0) * 100)}% FTE{' '}
                      {candidate.skills && candidate.skills.length > 0 ? `· Skills: ${candidate.skills.join(', ')}` : null}
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-[11px] font-medium opacity-80">{recommendation.reasoning}</p>
            </div>
          )}
        </Card>

        <Card title="Conflict Monitor" description="Detect over-allocated teammates and suggested remediation steps.">
          <button
            type="button"
            onClick={() => conflictsMutation.mutate()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-200 hover:text-amber-600"
          >
            <ShieldAlert className="h-4 w-4 text-amber-500" />
            Check conflicts
          </button>
          {conflictSummary && (
            <pre className="mt-3 max-h-40 overflow-y-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
              {JSON.stringify(conflictSummary, null, 2)}
            </pre>
          )}
        </Card>

        <Card title="Forecast" description="Model projected staffing gaps based on planned projects.">
          <button
            type="button"
            onClick={() => forecastMutation.mutate(3)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-purple-200 hover:text-purple-600"
          >
            <Sparkles className="h-4 w-4 text-purple-500" />
            Generate 3-month forecast
          </button>
          {forecastSummary && (
            <pre className="mt-3 max-h-40 overflow-y-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
              {JSON.stringify(forecastSummary, null, 2)}
            </pre>
          )}
        </Card>

        <Card title="Workload Balancing" description="Identify shifts to smooth utilization across teams.">
          <button
            type="button"
            onClick={() => balanceMutation.mutate()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-600"
          >
            <RefreshCw className="h-4 w-4 text-emerald-500" />
            Fetch balancing tips
          </button>
          {balanceSummary && (
            <pre className="mt-3 max-h-40 overflow-y-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
              {JSON.stringify(balanceSummary, null, 2)}
            </pre>
          )}
        </Card>
      </section>
    </div>
  );
}

