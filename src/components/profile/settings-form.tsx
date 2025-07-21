'use client';

import React, { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { Button, Card, Group, Loader, Stack, Text, TextInput, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';

import { useMutation, useQuery } from '@tanstack/react-query';

import { ReactQueryTags } from '@/enums';
import { UpdateAccountFormSchema, UpdateAccountFormSchemaType } from '@/schemas/accounts';

export const SettingsForm = () => {
  const router = useRouter();
  const {
    data: account,
    isLoading,
    error,
  } = useQuery({
    queryKey: [ReactQueryTags.ACCOUNT],
    queryFn: async () => {
      const res = await fetch('/api/account');
      if (!res.ok) throw new Error('Failed to fetch account');
      return res.json();
    },
  });

  const form = useForm<UpdateAccountFormSchemaType>({
    validate: zodResolver(UpdateAccountFormSchema),
    initialValues: {
      username: '',
      firstName: '',
      lastName: '',
      birthDate: null,
      bio: '',
    },
  });

  useEffect(() => {
    if (account) {
      form.setValues({
        username: account.username || '',
        firstName: account.firstName || '',
        lastName: account.lastName || '',
        birthDate: account.birthDate ? new Date(account.birthDate) : null,
        bio: account.bio || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const { mutate: updateAccount, isPending: isLoadingMutation } = useMutation({
    mutationFn: async (values: UpdateAccountFormSchemaType) => {
      const payload = {
        ...values,
        birthDate: values.birthDate ? values.birthDate.toISOString().split('T')[0] : undefined,
      };

      const response = await fetch('/api/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      return response.json();
    },
    onSuccess: () => {
      notifications.show({
        title: 'Profile updated',
        message: 'Your profile has been updated successfully',
        color: 'green',
      });
      router.push('/profile');
    },
    onError: (error: unknown) => {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to update profile',
        color: 'red',
      });
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    updateAccount(values);
  });

  if (isLoading) {
    return <Loader mx="auto" />;
  }

  if (error) {
    return (
      <Text ta="center" c="red">
        Failed to load account data.
      </Text>
    );
  }

  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder>
      <form onSubmit={handleSubmit}>
        <Stack gap="lg">
          <TextInput
            label="Username"
            placeholder="Enter username"
            {...form.getInputProps('username')}
          />
          <TextInput
            label="First Name"
            placeholder="Enter first name"
            {...form.getInputProps('firstName')}
          />
          <TextInput
            label="Last Name"
            placeholder="Enter last name"
            {...form.getInputProps('lastName')}
          />
          <DateInput
            label="Birth Date"
            placeholder="Select birth date"
            valueFormat="YYYY-MM-DD"
            {...form.getInputProps('birthDate')}
          />
          <Textarea
            label="Bio"
            placeholder="Tell us about yourself..."
            minRows={3}
            maxRows={6}
            {...form.getInputProps('bio')}
          />
          <Group justify="flex-end" mt="md">
            <Button
              type="submit"
              color="tertiary"
              loading={isLoadingMutation}
              disabled={!form.isValid()}
            >
              Save Changes
            </Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
};
