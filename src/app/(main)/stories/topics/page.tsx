import { Box, Title } from '@mantine/core';

import { CreateTopicForm } from '@/components/stories';
import { TopicCardsList } from '@/components/stories/topic-cards-list';

export default function TopicsPage() {
  return (
    <Box>
      <Title c="tertiary" mb="xl" ta="center">
        Create New Story Topic
      </Title>
      <CreateTopicForm />
      <TopicCardsList />
    </Box>
  );
}
