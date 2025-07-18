import { cookies } from 'next/headers';

import { Stack, Title } from '@mantine/core';

import { ServerError } from '@/components/auth';
import { SettingsForm } from '@/components/profile';
import { Account } from '@/types/user';

export default async function ProfilePage() {
  try {
    let account: Account | null = null;
    let error: string | null = null;

    try {
      const cookieStore = cookies();
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/account`, {
        headers: {
          Cookie: cookieStore.toString(),
          'Content-Type': 'application/json',
        },
        next: { tags: ['account'] },
      });

      if (response.ok) {
        account = await response.json();
      } else {
        error = 'Failed to load account data';
      }
    } catch (err) {
      console.error('Server-side account fetch error:', err);
      error = 'Failed to load account data';
    }

    return (
      <Stack gap="xl">
        <Title order={1} ta="center">
          Profile Settings
        </Title>

        <SettingsForm account={account} error={error} />
      </Stack>
    );
  } catch (error) {
    return <ServerError error={error} />;
  }
}
