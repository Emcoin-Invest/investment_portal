'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  loading?: boolean;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendLabel,
  loading = false,
  variant = 'neutral',
}: MetricCardProps) {
  const variantStyles = {
    primary: 'from-blue-50 to-indigo-50 border-blue-200/50',
    success: 'from-green-50 to-emerald-50 border-green-200/50',
    warning: 'from-amber-50 to-orange-50 border-amber-200/50',
    danger: 'from-red-50 to-rose-50 border-red-200/50',
    neutral: 'from-slate-50 to-slate-50 border-slate-200/50',
  };

  const iconColor = {
    primary: 'bg-blue-100 text-blue-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-amber-100 text-amber-600',
    danger: 'bg-red-100 text-red-600',
    neutral: 'bg-slate-100 text-slate-600',
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${variantStyles[variant]} p-6 transition-all duration-300 hover:shadow-md hover:scale-105 group`}
    >
      {/* Background gradient accent */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:bg-white/40 transition-all duration-300" />

      <div className="relative z-10 space-y-4">
        {/* Header with icon and title */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          </div>
          {icon && <div className={`p-2.5 rounded-lg ${iconColor[variant]}`}>{icon}</div>}
        </div>

        {/* Main value */}
        {loading ? (
          <div className="h-10 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded animate-shimmer" />
        ) : (
          <div>
            <p className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{value}</p>
            {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          </div>
        )}

        {/* Trend indicator */}
        {trend !== undefined && (
          <div className="flex items-center gap-2 pt-2">
            <div className={`flex items-center gap-1 text-sm font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(trend)}%
            </div>
            {trendLabel && <span className="text-xs text-slate-500">{trendLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

interface MetricsGridProps {
  metrics: MetricCardProps[];
  columns?: number;
}

export function MetricsGrid({ metrics, columns = 4 }: MetricsGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6 animate-slideInUp`}>
      {metrics.map((metric, idx) => (
        <div key={idx} className="animate-fadeIn" style={{ animationDelay: `${idx * 50}ms` }}>
          <MetricCard {...metric} />
        </div>
      ))}
    </div>
  );
}
