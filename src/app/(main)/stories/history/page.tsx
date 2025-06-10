'use client';

import { Box, Title, SimpleGrid, Text, Center, Loader } from '@mantine/core';
import { StoryCard } from '@/components/stories/story-card';
import { useQuery } from '@tanstack/react-query';
import { Story } from '@/types/story';

export default function HistoryPage() {
  const { data: stories, isLoading, error } = useQuery<Story[]>({
    queryKey: ['user-stories'],
    queryFn: async () => {
      return [];
    }
  });

  if (isLoading) {
    return (
      <Center h={400}>
        <Loader color="orange" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h={400}>
        <Text c="red">Failed to load story history. Please try again later.</Text>
      </Center>
    );
  }

  return (
    <Box p="md">
      <Title c="orange" mb="xl">Story History</Title>
      {stories && stories.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </SimpleGrid>
      ) : (
        <Center h={200}>
          <Text c="dimmed">No stories found. Start creating your first adventure!</Text>
        </Center>
      )}
    </Box>
  );
}
