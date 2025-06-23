'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Center, Pagination } from '@mantine/core';

interface StoriesPaginationProps {
  currentPage: number;
  totalPages: number;
}

export const StoriesPagination = ({ currentPage, totalPages }: StoriesPaginationProps) => {
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
      <Pagination total={totalPages} value={currentPage} onChange={handlePageChange} />
    </Center>
  );
};
