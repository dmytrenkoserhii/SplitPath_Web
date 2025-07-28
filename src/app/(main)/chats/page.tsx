import { Grid, GridCol, Paper, ScrollArea } from '@mantine/core';

import { ServerError } from '@/components/auth';
import { ChatsListHandler } from '@/components/chats/chats-list-handler';

export default async function ChatsPage() {
  try {
    return (
      <Grid>
        <GridCol span={12}>
          <Paper p="sm" style={{ height: 'calc(100dvh - 60px - 60px - 35px)' }} withBorder>
            <ScrollArea scrollbarSize={3} scrollHideDelay={2000} h="100%">
              <ChatsListHandler />
            </ScrollArea>
          </Paper>
        </GridCol>
      </Grid>
    );
  } catch (error) {
    return <ServerError error={error} />;
  }
}
