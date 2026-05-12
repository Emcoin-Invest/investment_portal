'use client';

import React from 'react';

interface TableColumn<T extends object> {
  key: Extract<keyof T, string>;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T) => React.ReactNode;
  width?: string;
}

interface PremiumTableProps<T extends object> {
  columns: TableColumn<T>[];
  data: T[];
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  loading?: boolean;
}

export function PremiumTable<T extends object>({
  columns,
  data,
  onSort,
  striped = true,
  hoverable = true,
  compact = false,
  loading = false,
}: PremiumTableProps<T>) {
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const handleSort = (columnKey: Extract<keyof T, string>) => {
    const newDirection = sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(columnKey);
    setSortDirection(newDirection);
    onSort?.(columnKey, newDirection);
  };

  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
      <div className="overflow-x-auto animate-slideInUp">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 font-semibold text-sm text-slate-700 ${alignClass[column.align || 'left']} ${
                    column.sortable ? 'cursor-pointer hover:bg-slate-200/50 transition-colors' : ''
                  } ${column.width ? `w-${column.width}` : ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <span className="text-xs text-slate-400">
                        {sortColumn === column.key ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="border-b border-slate-100"
                >
                  {columns.map((_, colIdx) => (
                    <td key={colIdx} className="px-6 py-4">
                      <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded animate-shimmer" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <p className="text-slate-500">No data available</p>
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={`border-b border-slate-100 transition-colors ${
                    hoverable ? 'hover:bg-slate-50' : ''
                  } ${striped && rowIdx % 2 === 1 ? 'bg-slate-50/40' : ''}`}
                >
                  {columns.map((column) => (
                    <td
                      key={`${rowIdx}-${column.key}`}
                      className={`px-6 py-4 text-sm text-slate-700 ${alignClass[column.align || 'left']}`}
                    >
                      {(() => {
                        const cellValue = row[column.key as keyof T];
                        return column.render
                          ? column.render(cellValue, row)
                          : cellValue === null || cellValue === undefined
                            ? ''
                            : String(cellValue);
                      })()}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Enhanced Badge for table use */
interface BadgeProps {
  label: string;
  variant: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export function Badge({ label, variant }: BadgeProps) {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variantStyles[variant]}`}>
      {label}
    </span>
  );
}
