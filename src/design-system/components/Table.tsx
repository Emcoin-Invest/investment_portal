'use client';

import React from 'react';
import clsx from 'clsx';

interface TableColumn<T extends object> {
  key: Extract<keyof T, string>;
  label: string;
  sortable?: boolean;
  format?: (value: unknown, row: T) => React.ReactNode;
  width?: string;
}

interface TableProps<T extends object> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  emptyState?: React.ReactNode;
}

export function Table<T extends object = object>({
  columns,
  data,
  isLoading,
  onRowClick,
  striped = true,
  hoverable = true,
  compact = false,
  emptyState,
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-neutral-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500">
        {emptyState || 'No data available'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-200">
              {columns.map((column) => (
              <th
                  key={column.key}
                className={clsx(
                  'text-left font-semibold text-neutral-700 text-sm bg-neutral-50',
                  compact ? 'px-4 py-2' : 'px-6 py-3'
                )}
                style={{ width: column.width }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={clsx(
                'border-b border-neutral-200 transition-colors',
                striped && rowIndex % 2 === 1 && 'bg-neutral-50',
                hoverable && 'hover:bg-blue-50 cursor-pointer'
              )}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={clsx(
                    'text-neutral-900 text-sm',
                    compact ? 'px-4 py-2' : 'px-6 py-3'
                  )}
                >
                  {(() => {
                    const cellValue = row[column.key as keyof T];
                    return column.format
                      ? column.format(cellValue, row)
                      : cellValue === null || cellValue === undefined
                        ? ''
                        : String(cellValue);
                  })()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
