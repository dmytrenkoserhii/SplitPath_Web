import { authService, friendsService, usersService } from '@/services';
import { ServerError } from '@/components/auth';
import {
  Stack,
  Title,
  Tabs,
  Group,
  TabsPanel,
  TabsList,
  TabsTab,
} from '@mantine/core';
import {
  AddNewFriendPopover,
  FriendsList,
  PendingRequestsList,
  RejectedRequestsList,
} from '@/components/friends';
import { FriendStatus, FriendRequestDirection } from '@/enums';

export default async function FriendsPage() {
  try {
    const { data: userData } = await usersService().getCurrent();

    const { data: friendsData } = await friendsService().getFriendsList();

    const { data: incomingRequestsData } =
      await friendsService().getFriendRequests({
        status: FriendStatus.PENDING,
        direction: FriendRequestDirection.INCOMING,
        page: 1,
        limit: 10,
      });
    const { data: outgoingRequestsData } =
      await friendsService().getFriendRequests({
        status: FriendStatus.PENDING,
        direction: FriendRequestDirection.OUTGOING,
        page: 1,
        limit: 10,
      });

    const { data: rejectedIncomingRequestsData } =
      await friendsService().getFriendRequests({
        status: FriendStatus.REJECTED,
        direction: FriendRequestDirection.INCOMING,
        page: 1,
        limit: 10,
      });
    const { data: rejectedOutgoingRequestsData } =
      await friendsService().getFriendRequests({
        status: FriendStatus.REJECTED,
        direction: FriendRequestDirection.OUTGOING,
        page: 1,
        limit: 10,
      });

    return (
      <Stack>
        <Group>
          <Title order={2}>Friends</Title>
          <AddNewFriendPopover />
        </Group>

        <Tabs color='primary' defaultValue='friends'>
          <TabsList mb='md' grow>
            <TabsTab value='friends' color='primary'>
              Friends ({friendsData?.items?.length ?? 0})
            </TabsTab>
            <TabsTab value='pending' color='blue'>
              Pending ({incomingRequestsData?.items?.length ?? 0})
            </TabsTab>
            <TabsTab value='rejected' color='red'>
              Rejected ({rejectedIncomingRequestsData?.items?.length ?? 0})
            </TabsTab>
          </TabsList>

          <TabsPanel value='friends'>
            <FriendsList
              friends={friendsData?.items ?? []}
              currentUser={userData}
              // onDelete={onFriendDelete}
              // onMessage={onFriendMessage}
            />
          </TabsPanel>

          <TabsPanel value='pending'>
            <PendingRequestsList
              incomingRequests={incomingRequestsData?.items ?? []}
              outgoingRequests={outgoingRequestsData?.items ?? []}
              currentUser={userData}
              // onAcceptIncoming={onIncomingAccept}
              // onRejectIncoming={onIncomingReject}
              // onDeleteOutgoing={onOutgoingDelete}
            />
          </TabsPanel>

          <TabsPanel value='rejected'>
            <RejectedRequestsList
              incomingRejected={rejectedIncomingRequestsData?.items ?? []}
              outgoingRejected={rejectedOutgoingRequestsData?.items ?? []}
              currentUser={userData}
              // onAccept={onRejectedAccept}
              // onResend={onRejectedResend}
            />
          </TabsPanel>
        </Tabs>
      </Stack>
    );
  } catch (error) {
    return <ServerError error={error} />;
  }
}
