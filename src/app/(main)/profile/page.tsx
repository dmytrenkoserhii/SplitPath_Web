import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button, Card, Group, Stack, Text, Title } from '@mantine/core';

import { ServerError } from '@/components/auth';
import { Account } from '@/types/user';

export default async function ProfilePage() {
  try {
    const cookieStore = cookies();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/account`, {
      headers: {
        Cookie: cookieStore.toString(),
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      notFound();
    }

    if (!response.ok) {
      throw new Error('Failed to load account data');
    }

    const account: Account = await response.json();

    return (
      <Stack gap="xl">
        <Title order={1} ta="center">
          Profile
        </Title>
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack gap="md">
            <Text>
              <b>Username:</b> {account.username}
            </Text>

            <Text>
              <b>First Name:</b> {account.firstName || 'Not set'}
            </Text>

            <Text>
              <b>Last Name:</b> {account.lastName || 'Not set'}
            </Text>

            <Text>
              <b>Birth Date:</b>{' '}
              {account.birthDate ? new Date(account.birthDate).toLocaleDateString() : 'Not set'}
            </Text>

            <Text>
              <b>Bio:</b> {account.bio || 'No bio set'}
            </Text>

            <Group justify="flex-end">
              <Button component={Link} href="/profile/edit" color="tertiary">
                Edit Profile
              </Button>
            </Group>
          </Stack>
        </Card>
      </Stack>
    );
  } catch (error) {
    return <ServerError error={error} />;
  }
}
