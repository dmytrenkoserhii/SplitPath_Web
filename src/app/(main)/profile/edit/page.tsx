import { Stack, Title } from '@mantine/core';

import { ServerError } from '@/components/auth';
import { SettingsForm } from '@/components/profile/settings-form';

export default function EditProfilePage() {
  try {
    return (
      <Stack gap="xl">
        <Title order={1} ta="center">
          Edit Profile
        </Title>
        <SettingsForm />
      </Stack>
    );
  } catch (error) {
    return <ServerError error={error} />;
  }
}
