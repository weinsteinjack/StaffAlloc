import type { PropsWithChildren, ReactNode } from 'react';

interface CardProps extends PropsWithChildren {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  padding?: 'default' | 'none';
}

export default function Card({
  title,
  description,
  action,
  className,
  padding = 'default',
  children
}: CardProps) {
  const baseClass =
    'rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-150 hover:shadow-md';
  const paddingClass = padding === 'default' ? 'p-6' : '';

  return (
    <section className={`${baseClass} ${paddingClass} ${className ?? ''}`.trim()}>
      {(title || description || action) && (
        <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title && <h2 className="text-lg font-semibold text-slate-900">{title}</h2>}
            {description && <p className="text-sm text-slate-500">{description}</p>}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </header>
      )}
      <div className={padding === 'default' ? 'space-y-4' : undefined}>{children}</div>
    </section>
  );
}

