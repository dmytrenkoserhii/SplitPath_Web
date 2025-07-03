import Link from 'next/link';

import { Button, Center, Container, Stack, Text, Title } from '@mantine/core';

import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <Container size="sm" py="xl">
      <Center style={{ minHeight: '60vh' }}>
        <Stack align="center" gap="xl">
          <Stack align="center" gap="md">
            <Title order={1} size="4rem" c="tertiary">
              404
            </Title>
            <Title order={2} ta="center">
              Page Not Found
            </Title>
            <Text size="lg" c="dimmed" ta="center" maw={400}>
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </Text>
          </Stack>

          <Stack gap="sm">
            <Button
              component={Link}
              href="/"
              leftSection={<Home size={16} />}
              size="lg"
              color="tertiary"
            >
              Go Home
            </Button>
          </Stack>
        </Stack>
      </Center>
    </Container>
  );
}
