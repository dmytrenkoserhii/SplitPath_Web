'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Center, Pagination as MantinePagination } from '@mantine/core';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export const Pagination = ({ currentPage, totalPages }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Center mt="xl">
      <MantinePagination total={totalPages} value={currentPage} onChange={handlePageChange} />
    </Center>
  );
};
