import { Box, Title } from '@mantine/core';

import { ServerError } from '@/components/auth';
import { StoryTopicCardsList } from '@/components/stories/story-topic-cards-list';
import { storyTopicsService } from '@/services/story-topics.service';

export default async function StorySelection() {
  try {
    const topics = await storyTopicsService().findAll();

    return (
      <Box>
        <Title c="tertiary" ta="center" mb="md">
          Story Selection
        </Title>
        <StoryTopicCardsList topics={topics} />
      </Box>
    );
  } catch (error) {
    return <ServerError error={error} />;
  }
}
