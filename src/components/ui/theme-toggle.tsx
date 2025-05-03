'use client';

import {
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');
  // Add client-side only rendering to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  // Only show the toggle after component has mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <ActionIcon
        variant='default'
        size='xl'
        aria-label='Loading theme toggle'
        style={{ visibility: 'hidden' }}
      >
        <Sun size={20} />
      </ActionIcon>
    );
  }

  return (
    <ActionIcon
      onClick={() =>
        setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')
      }
      variant='default'
      size='xl'
      aria-label='Toggle color scheme'
    >
      {computedColorScheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </ActionIcon>
  );
}
