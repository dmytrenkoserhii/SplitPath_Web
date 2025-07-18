'use client';

import { useState } from 'react';

import { Button, Card, Group, Stack, Text, TextInput, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';

import { UpdateAccountFormSchema, UpdateAccountFormSchemaType } from '@/schemas/accounts';
import { Account } from '@/types/user';

interface SettingsFormProps {
  account: Account | null;
  error: string | null;
}

export const SettingsForm = ({ account, error }: SettingsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateAccountFormSchemaType>({
    validate: zodResolver(UpdateAccountFormSchema),
    initialValues: {
      username: account?.username || '',
      firstName: account?.firstName || '',
      lastName: account?.lastName || '',
      birthDate: account?.birthDate ? new Date(account.birthDate) : null,
      bio: account?.bio || '',
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (account) {
      form.setValues({
        username: account.username || '',
        firstName: account.firstName || '',
        lastName: account.lastName || '',
        birthDate: account.birthDate ? new Date(account.birthDate) : null,
        bio: account.bio || '',
      });
    }
  };

  const handleSubmit = form.onSubmit(async (values) => {
    setIsLoading(true);

    try {
      const payload = {
        ...values,
        birthDate: values.birthDate ? values.birthDate.toISOString().split('T')[0] : null,
      };

      const response = await fetch('/api/account', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        notifications.show({
          title: 'Profile updated',
          message: 'Your profile has been updated successfully',
          color: 'green',
        });
        setIsEditing(false);
      } else {
        notifications.show({
          title: 'Error',
          message: result.error || 'Failed to update profile',
          color: 'red',
        });
      }
    } catch (error) {
      console.error('Update error:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update profile',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  });

  if (error) {
    return (
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Text c="red" ta="center">
          {error}
        </Text>
      </Card>
    );
  }

  if (!account) {
    return (
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Text ta="center">No account data found.</Text>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder>
      <form onSubmit={handleSubmit}>
        <Stack gap="lg">
          <div>
            <Text fw={500} mb="xs">
              Username
            </Text>
            {isEditing ? (
              <TextInput placeholder="Enter username" {...form.getInputProps('username')} />
            ) : (
              <Text c="dimmed">{account.username}</Text>
            )}
          </div>

          <div>
            <Text fw={500} mb="xs">
              First Name
            </Text>
            {isEditing ? (
              <TextInput placeholder="Enter first name" {...form.getInputProps('firstName')} />
            ) : (
              <Text c="dimmed">{account.firstName || 'Not set'}</Text>
            )}
          </div>

          <div>
            <Text fw={500} mb="xs">
              Last Name
            </Text>
            {isEditing ? (
              <TextInput placeholder="Enter last name" {...form.getInputProps('lastName')} />
            ) : (
              <Text c="dimmed">{account.lastName || 'Not set'}</Text>
            )}
          </div>

          <div>
            <Text fw={500} mb="xs">
              Birth Date
            </Text>
            {isEditing ? (
              <DateInput
                placeholder="Select birth date"
                valueFormat="YYYY-MM-DD"
                {...form.getInputProps('birthDate')}
              />
            ) : (
              <Text c="dimmed">
                {account.birthDate ? new Date(account.birthDate).toLocaleDateString() : 'Not set'}
              </Text>
            )}
          </div>

          <div>
            <Text fw={500} mb="xs">
              Bio
            </Text>
            {isEditing ? (
              <Textarea
                placeholder="Tell us about yourself..."
                minRows={3}
                maxRows={6}
                {...form.getInputProps('bio')}
              />
            ) : (
              <Text c="dimmed" style={{ whiteSpace: 'pre-wrap' }}>
                {account.bio || 'No bio set'}
              </Text>
            )}
          </div>

          <Group justify="flex-end" mt="md">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="tertiary"
                  loading={isLoading}
                  disabled={!form.isValid()}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={handleEdit} color="tertiary">
                Edit Profile
              </Button>
            )}
          </Group>
        </Stack>
      </form>
    </Card>
  );
};
