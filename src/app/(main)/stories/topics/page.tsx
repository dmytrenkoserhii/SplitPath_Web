import { Box, Title } from '@mantine/core';

import { ServerError } from '@/components/auth';
import { CreateTopicForm } from '@/components/stories';
import { TopicCardsList } from '@/components/stories/topic-cards-list';
import { storyTopicsService } from '@/services/story-topics.service';

export default async function TopicsPage() {
  try {
    const topics = await storyTopicsService().findAll();

    return (
      <Box>
        <Title c="orange" mb="xl" ta="center">
          Create New Story Topic
        </Title>
        <CreateTopicForm />
        <TopicCardsList topics={topics} />
      </Box>
    );
  } catch (error) {
    return <ServerError error={error} />;
  }
}
