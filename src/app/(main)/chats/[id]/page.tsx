import { redirect } from 'next/navigation';

import { Paper, Stack } from '@mantine/core';

import { ServerError } from '@/components/auth';
import { ChatInput, ChatMessagesListHandler } from '@/components/chats';
import { usersService } from '@/services';

interface ChatPageProps {
  params: {
    id: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  try {
    const { id } = await params;

    if (!id) {
      return redirect('/chats');
    }

    const { data: currentUser } = await usersService().getCurrent();
    const { data: friendUser } = await usersService().findOneById(Number(id));

    if (!friendUser) {
      return redirect('/chats');
    }

    return (
      <Paper
        withBorder
        p="sm"
        style={{
          height: 'calc(100dvh - 60px - 60px - 35px)',
          maxHeight: 'calc(100dvh - 60px - 60px - 35px)',
        }}
      >
        <Stack h="100%" justify="space-between">
          <ChatMessagesListHandler friend={friendUser} currentUserId={currentUser.id} />
          <ChatInput receiverId={Number(id)} />
        </Stack>
      </Paper>
    );
  } catch (error) {
    return <ServerError error={error} />;
  }
}
