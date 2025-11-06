import type { ReactNode } from 'react';

interface ChatMessageProps {
  role: 'user' | 'assistant' | 'system';
  content: ReactNode;
  timestamp?: string;
}

const toneClasses: Record<ChatMessageProps['role'], string> = {
  user: 'border-blue-200 bg-blue-50 text-blue-800',
  assistant: 'border-slate-200 bg-white text-slate-800',
  system: 'border-amber-200 bg-amber-50 text-amber-800'
};

export default function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-xl border px-4 py-3 text-sm shadow-sm ${toneClasses[role]}`}
    >
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
        <span>{role === 'assistant' ? 'StaffAlloc AI' : role === 'user' ? 'You' : 'System'}</span>
        {timestamp && <time className="text-xs font-medium opacity-70">{timestamp}</time>}
      </div>
      <div className="leading-relaxed">{content}</div>
    </div>
  );
}

