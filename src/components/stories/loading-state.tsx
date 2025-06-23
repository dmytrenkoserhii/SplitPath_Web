import { Center, Loader, Stack, Text, Title } from '@mantine/core';

interface LoadingStateProps {
  title: string;
  message: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function LoadingState({ title, message, size = 'lg' }: LoadingStateProps) {
  return (
    <Center>
      <Stack align="center" gap="md">
        <Loader size={size} color="orange" />
        <Title order={3}>{title}</Title>
        <Text c="dimmed">{message}</Text>
      </Stack>
    </Center>
  );
}
