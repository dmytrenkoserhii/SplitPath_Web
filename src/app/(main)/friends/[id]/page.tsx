import {
  Avatar,
  Badge,
  Card,
  CardSection,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { usersService } from '@/services/users.service';
import { friendsService } from '@/services/friends.service';
import { formatDate } from '@/lib';
import { CalendarClock, Mail, User as UserIcon } from 'lucide-react';
import { notFound } from 'next/navigation';

interface FriendPageProps {
  params: {
    id: string;
  };
}

export default async function FriendPage({ params }: FriendPageProps) {
  const { id } = await params;
  const userId = Number(id);
  console.log(userId);

  if (isNaN(userId)) {
    notFound();
  }

  try {
    const [friendResponse, statusResponse] = await Promise.all([
      usersService().findOneById(userId),
      friendsService().getFriendsOnlineStatus(),
    ]);

    const friend = friendResponse.data;
    const onlineStatus = statusResponse.data;
    const isOnline =
      friend.id in onlineStatus ? onlineStatus[friend.id] : false;

    return (
      <Container size='md' py='xl'>
        <Card withBorder shadow='sm' radius='md'>
          <CardSection p='lg' bg='gray.1'>
            <Group justify='space-between' align='flex-start'>
              <Group>
                <Avatar
                  src={friend.account?.avatarUrl}
                  size={120}
                  radius='md'
                  color='blue'
                >
                  {friend.account?.username?.substring(0, 2).toUpperCase() || (
                    <UserIcon size={40} />
                  )}
                </Avatar>
                <Stack gap='xs'>
                  <Title order={2}>
                    {friend.account?.username || 'Unknown'}
                  </Title>
                  <Badge
                    color={isOnline ? 'green' : 'gray'}
                    variant='light'
                    size='lg'
                  >
                    {isOnline ? 'Online' : 'Offline'}
                  </Badge>
                </Stack>
              </Group>
            </Group>
          </CardSection>

          <Stack p='lg' gap='md'>
            <Group gap='sm'>
              <Mail size={18} />
              <Text fw={600}>Email:</Text>
              <Text>{friend.email}</Text>
            </Group>

            <Group gap='sm'>
              <CalendarClock size={18} />
              <Text fw={600}>Joined:</Text>
              <Text>{formatDate(friend.createdAt)}</Text>
            </Group>
          </Stack>
        </Card>
      </Container>
    );
  } catch (error) {
    notFound();
  }
}
