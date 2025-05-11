'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export const RefreshAccessToken = () => {
  const router = useRouter();

  React.useEffect(() => {
    router.refresh();
  }, [router]);

  return null;
};
