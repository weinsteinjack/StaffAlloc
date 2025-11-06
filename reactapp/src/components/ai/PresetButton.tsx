import type { ReactNode } from 'react';

interface PresetButtonProps {
  icon?: ReactNode;
  label: string;
  description?: string;
  onSelect: () => void;
}

export default function PresetButton({ icon, label, description, onSelect }: PresetButtonProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left text-sm text-slate-600 transition hover:border-blue-200 hover:bg-blue-50"
    >
      {icon && <span className="mt-1 text-blue-500">{icon}</span>}
      <div>
        <p className="font-semibold text-slate-800">{label}</p>
        {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
      </div>
    </button>
  );
}

