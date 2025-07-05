import { SimpleGrid } from '@mantine/core';

import { Story } from '@/types/story';

import { StoryCard } from './story-card';

interface StoryCardsListProps {
  stories: Story[];
}

export const StoryCardsList = ({ stories }: StoryCardsListProps) => {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg" verticalSpacing="lg">
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
    </SimpleGrid>
  );
};
