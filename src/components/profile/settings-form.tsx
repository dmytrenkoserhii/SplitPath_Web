'use client';

import React, { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { Button, Card, Group, Loader, Stack, Text, TextInput, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import dayjs from 'dayjs';

import { ReactQueryTags } from '@/enums';
import { UpdateAccountFormSchema, UpdateAccountFormSchemaType } from '@/schemas/accounts';
import { accountsService } from '@/services/account.service';

export const SettingsForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    data: account,
    isLoading,
    error,
  } = useQuery({
    queryKey: [ReactQueryTags.ACCOUNT],
    queryFn: () => accountsService().getCurrent(),
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
  }, [account]);

  const { mutate: updateAccount, isPending: isLoadingMutation } = useMutation({
    mutationFn: async (values: UpdateAccountFormSchemaType) => {
      const payload = {
        ...values,
        birthDate: values.birthDate ? dayjs(values.birthDate).format('YYYY-MM-DD') : undefined,
      };

      return accountsService().apiRouteUpdate(payload);
    },
    onSuccess: () => {
      notifications.show({
        title: 'Profile updated',
        message: 'Your profile has been updated successfully',
        color: 'green',
      });

      queryClient.invalidateQueries({ queryKey: [ReactQueryTags.ACCOUNT] });
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
