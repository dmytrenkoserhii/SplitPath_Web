import { SimpleGrid } from '@mantine/core';

import { StoryTopic } from '@/types/story';

import { StoryTopicCard } from './story-topic-card';

interface StoryTopicCardsListProps {
  topics: StoryTopic[];
}

export const StoryTopicCardsList = ({ topics }: StoryTopicCardsListProps) => {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg" verticalSpacing="lg">
      {topics.map((topic) => (
        <StoryTopicCard key={topic.id} topic={topic} />
      ))}
    </SimpleGrid>
  );
};
