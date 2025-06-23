'use client';

import { Stack } from '@mantine/core';

import { StoryTopic } from '@/types/story/story-topic.interface';

import { TopicCard } from './topic-card';

interface TopicCardsListProps {
  topics: StoryTopic[];
}

export const TopicCardsList = ({ topics }: TopicCardsListProps) => {
  return (
    <Stack>
      {topics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} />
      ))}
    </Stack>
  );
};
