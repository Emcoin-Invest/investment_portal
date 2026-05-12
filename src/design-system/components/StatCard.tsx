'use client';

import React from 'react';
import clsx from 'clsx';
import Card from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  className?: string;
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  green: 'bg-green-50 text-green-700 border-green-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
  trend,
  className,
}) => {
  return (
    <Card
      variant="outlined"
      padding="md"
      className={clsx('justify-between', className)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600">{title}</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div
              className={clsx(
                'text-xs font-semibold mt-2',
                trend.direction === 'up' && 'text-green-600',
                trend.direction === 'down' && 'text-red-600',
                trend.direction === 'neutral' && 'text-neutral-600'
              )}
            >
              {trend.direction === 'up' && '↑'}
              {trend.direction === 'down' && '↓'}
              {trend.value}%
            </div>
          )}
        </div>
        {icon && (
          <div
            className={clsx(
              'p-3 rounded-lg',
              colorClasses[color]
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
