import { AppShellFooter, Group, Text } from '@mantine/core';

export function MainFooter() {
  return (
    <AppShellFooter p='md'>
      <Group justify='space-between' h='100%'>
        <Text size='sm'>© 2023 SplitPath</Text>
        <Text size='sm'>AI Generated Interactive Stories</Text>
      </Group>
    </AppShellFooter>
  );
}
