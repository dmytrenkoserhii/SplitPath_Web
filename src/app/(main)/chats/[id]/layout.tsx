import { redirect } from 'next/navigation';

import { Grid, GridCol, Paper, ScrollArea } from '@mantine/core';

import { ServerError } from '@/components/auth';
import { ChatsListHandler } from '@/components/chats/chats-list-handler';

export default async function ChatsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    id: string;
  };
}) {
  try {
    const { id } = await params;

    if (!id) {
      return redirect('/chats');
    }

    return (
      <Grid>
        <GridCol span={3}>
          <Paper withBorder p="sm" style={{ height: 'calc(100dvh - 60px - 60px - 35px)' }}>
            <ScrollArea scrollbarSize={3} scrollHideDelay={2000} h="100%">
              <ChatsListHandler id={Number(id)} />
            </ScrollArea>
          </Paper>
        </GridCol>
        <GridCol span={9}>{children}</GridCol>
      </Grid>
    );
  } catch (error) {
    return <ServerError error={error} />;
  }
}
