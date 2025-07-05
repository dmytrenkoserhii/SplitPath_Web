'use client';

import { Loader, Stack, Text } from '@mantine/core';

import { useQuery } from '@tanstack/react-query';

import { ReactQueryTags } from '@/enums';
import { storyTopicsService } from '@/services/story-topics.service';

import { TopicCard } from './topic-card';

export const TopicCardsList = () => {
  const {
    data: topics,
    isLoading,
    error,
  } = useQuery({
    queryKey: [ReactQueryTags.STORY_TOPICS],
    queryFn: () => storyTopicsService().findAll(),
  });

  if (isLoading) {
    return <Loader mx="auto" />;
  }

  if (error) {
    return <Text ta="center">Failed to load topics. Please try again later.</Text>;
  }

  if (!topics || topics.length === 0) {
    return <Text ta="center">No topics available. Create your first topic above!</Text>;
  }

  return (
    <Stack>
      {topics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} />
      ))}
    </Stack>
  );
};
