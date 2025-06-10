'use client';

import { Box, Title, SimpleGrid, Text, Center, Loader } from '@mantine/core';
import { StoryTopicCard } from '@/components/stories';
import { useQuery } from '@tanstack/react-query';
import { storyTopicsService } from '@/services/story-topics.service';

export default function StorySelectionPage() {
  const { data: topics, isLoading, error } = useQuery({
    queryKey: ['story-topics'],
    queryFn: async () => {
      const response = await storyTopicsService().findAll();
      return response.data;
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
        <Text c="red">Failed to load topics. Please try again later.</Text>
      </Center>
    );
  }

  return (
    <Box p="md">
      <Title c="orange" mb="xl">Story Selection</Title>
      {topics && topics.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {topics.map((topic) => (
            <StoryTopicCard key={topic.id} topic={topic} />
          ))}
        </SimpleGrid>
      ) : (
        <Center h={200}>
          <Text c="dimmed">No story topics available yet.</Text>
        </Center>
      )}
    </Box>
  );
}
