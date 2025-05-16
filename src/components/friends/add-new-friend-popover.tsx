'use client';

import {
  CreateFriendRequestSchema,
  CreateFriendRequestType,
} from '@/schemas/friends';
import { Popover, Button, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Assuming @tanstack/react-query
import { friendsService } from '@/services/friends.service'; // Assuming your service path
import { notifications } from '@mantine/notifications'; // For feedback
import { ReactQueryTags } from '@/enums';

// TODO: close popover on success
export const AddNewFriendPopover = () => {
  const queryClient = useQueryClient();
  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: zodResolver(CreateFriendRequestSchema),
  });

  const { sendFriendRequest } = friendsService(); // Get the service instance

  const sendFriendRequestMutation = useMutation({
    mutationFn: (data: CreateFriendRequestType) => sendFriendRequest(data),
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Friend request sent successfully!',
        color: 'green',
      });
      // Invalidate all potentially affected queries
      queryClient.invalidateQueries({
        queryKey: [ReactQueryTags.FRIEND_REQUESTS_OUTGOING],
      });
      queryClient.invalidateQueries({ queryKey: [ReactQueryTags.FRIENDS] });
      // Reset form
      form.reset();
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message:
          error.response?.data?.message || 'Failed to send friend request.',
        color: 'red',
      });
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    sendFriendRequestMutation.mutate(values);
  });

  return (
    <Popover width={400} position='bottom' withArrow shadow='md' trapFocus>
      <Popover.Target>
        <Button variant='outline' color='green'>
          Add friend
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <form onSubmit={handleSubmit}>
          <TextInput
            {...form.getInputProps('email')}
            placeholder='Friend email'
            label="Friend's Email"
            withAsterisk
            mb='sm'
            disabled={sendFriendRequestMutation.isPending}
          />
          <Button
            type='submit'
            fullWidth
            loading={sendFriendRequestMutation.isPending}
          >
            Add friend
          </Button>
        </form>
      </Popover.Dropdown>
    </Popover>
  );
};
