import { ThemeToggle } from '@/components/UI/ThemeToggle';
import { Box, Title } from '@mantine/core';

export default function Home() {
  return (
    <Box>
      <ThemeToggle />
      <Title c='orange'>SplitPath</Title>
    </Box>
  );
}
