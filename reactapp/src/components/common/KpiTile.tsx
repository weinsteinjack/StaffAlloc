import type { ReactNode } from 'react';

type TrendDirection = 'up' | 'down' | 'flat';

interface Trend {
  direction: TrendDirection;
  label: string;
  tone?: 'positive' | 'negative' | 'neutral';
}

interface KpiTileProps {
  label: string;
  value: ReactNode;
  subLabel?: ReactNode;
  icon?: ReactNode;
  trend?: Trend;
  className?: string;
}

const toneClasses: Record<NonNullable<Trend['tone']>, string> = {
  positive: 'text-emerald-600',
  negative: 'text-red-600',
  neutral: 'text-slate-500'
};

const directionArrows: Record<TrendDirection, string> = {
  up: '▲',
  down: '▼',
  flat: '■'
};

export default function KpiTile({ label, value, subLabel, icon, trend, className }: KpiTileProps) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className ?? ''}`.trim()}
    >
      <div className="flex items-center gap-3">
        {icon && <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">{icon}</div>}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          {subLabel && <p className="text-xs text-slate-400">{subLabel}</p>}
        </div>
      </div>
      <div className="text-3xl font-bold text-slate-900">{value}</div>
      {trend && (
        <div className={`text-sm font-medium ${trend.tone ? toneClasses[trend.tone] : 'text-slate-500'}`}>
          <span className="mr-2">{directionArrows[trend.direction]}</span>
          {trend.label}
        </div>
      )}
    </div>
  );
}

