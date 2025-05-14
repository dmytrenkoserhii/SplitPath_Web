import { authService } from '@/services';
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

export default async function FriendsPage() {
  try {
    const { verifyAccessToken } = authService();
    const user = await verifyAccessToken();
    const userData = user.data;

    return (
      <Stack>
        <Group>
          <Title order={2}>Friends</Title>
          <AddNewFriendPopover />
        </Group>

        <Tabs color='primary' defaultValue='friends'>
          <TabsList mb='md' grow>
            <TabsTab value='friends' color='primary'>
              {/* Friends ({friendsData?.items?.length ?? 0}) */}
              Friends
            </TabsTab>
            <TabsTab value='pending' color='blue'>
              {/* Pending ({incomingRequestsData?.items?.length ?? 0}) */}
              Pending
            </TabsTab>
            <TabsTab value='rejected' color='red'>
              {/* Rejected ({rejectedIncomingRequestsData?.items?.length ?? 0}) */}
              Rejected
            </TabsTab>
          </TabsList>

          <TabsPanel value='friends'>
            <FriendsList
            // friends={friendsData?.items ?? []}
            // currentUser={userData}
            // onDelete={onFriendDelete}
            // onMessage={onFriendMessage}
            />
          </TabsPanel>

          <TabsPanel value='pending'>
            <PendingRequestsList
            // incomingRequests={incomingRequestsData?.items ?? []}
            // outgoingRequests={outgoingRequestsData?.items ?? []}
            // currentUser={userData}
            // onAcceptIncoming={onIncomingAccept}
            // onRejectIncoming={onIncomingReject}
            // onDeleteOutgoing={onOutgoingDelete}
            />
          </TabsPanel>

          <TabsPanel value='rejected'>
            <RejectedRequestsList
            // incomingRejected={rejectedIncomingRequestsData?.items ?? []}
            // outgoingRejected={rejectedOutgoingRequestsData?.items ?? []}
            // currentUser={userData}
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
