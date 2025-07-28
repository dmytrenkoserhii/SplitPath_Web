import { Group, Stack, Title } from '@mantine/core';

import { ServerError } from '@/components/auth';
import { AddNewFriendPopover, FriendsTabs } from '@/components/friends';

// I decided to make this page requests completely client side
// We can potentially add next tags to the fetch requests, use server actions for all requests and invalidate tags in them
// But I don't see a big benefit of doing so
// I just use react query to fetch data and invalidate queries.
// The main problem was the amount of requests for the single page. I have 5 requests for the friends page.
// If I just invalidate cache for the whole page, it will make 5 requests to the server again.
// We could potentially create another endpoint to fetch all the friends data at once, but it'll be still a big request.
export default function FriendsPage() {
  try {
    return (
      <Stack>
        <Group justify="space-between">
          <Title order={2}>Friends</Title>
          <AddNewFriendPopover />
        </Group>

        <FriendsTabs />
      </Stack>
    );
  } catch (error) {
    return <ServerError error={error} />;
  }
}
