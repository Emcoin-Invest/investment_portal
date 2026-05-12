'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useUserRequests } from '@/hooks/useApi';
import { Table, Badge, Card, Skeleton } from '@/design-system/components';
import { formatDate } from '@/utils/helpers';
import { ClientRequest } from '@/types';

const columns = [
  {
    key: 'title' as const,
    label: 'Title',
  },
  {
    key: 'description' as const,
    label: 'Description',
    format: (value: unknown) => (value as string).substring(0, 50) + '...',
  },
  {
    key: 'status' as const,
    label: 'Status',
    format: (value: unknown) => {
      const status = value as ClientRequest['status'];
      const variants = {
        open: 'primary',
        'in-progress': 'warning',
        completed: 'success',
        rejected: 'error',
      } as const;
      return <Badge variant={variants[status] || 'neutral'}>{status}</Badge>;
    },
  },
  {
    key: 'priority' as const,
    label: 'Priority',
    format: (value: unknown) => {
      const priority = value as ClientRequest['priority'];
      const variants = {
        low: 'neutral',
        medium: 'warning',
        high: 'error',
      } as const;
      return <Badge variant={variants[priority] || 'neutral'}>{priority}</Badge>;
    },
  },
  {
    key: 'createdAt' as const,
    label: 'Created',
    format: (value: unknown) => formatDate(value as string, 'short'),
  },
];

export function RequestsTable() {
  const { user } = useAuth();
  const { data, isLoading } = useUserRequests(user?.id.toString());

  return (
    <Card variant="outlined" padding="md">
      <h2 className="text-lg font-semibold mb-4 text-neutral-900">Your Requests</h2>
      <Table
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        emptyState={<p>No requests yet. Create one to get started.</p>}
      />
    </Card>
  );
}

export default RequestsTable;
