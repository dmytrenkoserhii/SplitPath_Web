'use client';

import { Popover, Button, TextInput } from '@mantine/core';

export const AddNewFriendPopover = () => {
  return (
    <Popover width={400} position='bottom' withArrow shadow='md' trapFocus>
      <Popover.Target>
        <Button variant='outline' size='xs'>
          Add friend
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        {/* <form onSubmit={handleSubmit}>
          <TextInput
            {...form.getInputProps('friendId')}
            placeholder='Friend email/username'
            mb='sm'
            disabled={sendFriendRequest.isPending}
          />
          <Button type='submit' fullWidth loading={sendFriendRequest.isPending}>
            Add friend
          </Button>
        </form> */}
      </Popover.Dropdown>
    </Popover>
  );
};
