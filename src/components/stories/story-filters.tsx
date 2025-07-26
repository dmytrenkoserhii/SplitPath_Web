'use client';

import { useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Box, MultiSelect, Text } from '@mantine/core';

import { StoryStatus } from '@/enums';

const statusOptions = [
  { value: StoryStatus.NEW, label: 'New' },
  { value: StoryStatus.IN_PROGRESS, label: 'In Progress' },
];

export function StoryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getInitialStatuses = () => {
    const statusParam = searchParams.get('status');
    return statusParam ? statusParam.split(',') : [StoryStatus.NEW, StoryStatus.IN_PROGRESS];
  };

  const [selected, setSelected] = useState<string[]>(getInitialStatuses);

  const handleStatusChange = (statuses: string[]) => {
    if (statuses.length === 0) {
      return;
    }

    setSelected(statuses);

    const params = new URLSearchParams(searchParams);
    if (statuses.length) {
      params.set('status', statuses.join(','));
    } else {
      params.delete('status');
    }
    params.set('page', '1');

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Box mb="md">
      <MultiSelect
        label="Filter by status"
        placeholder="Select story statuses"
        data={statusOptions}
        value={selected}
        onChange={handleStatusChange}
      />
    </Box>
  );
}
