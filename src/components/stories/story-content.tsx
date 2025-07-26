'use client';

import { useEffect } from 'react';

import { Box, Center, Loader, Stack, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ReactQueryTags } from '@/enums';
import { storiesService, storySegmentsService } from '@/services';

import { StorySegmentCard } from './story-segment-card';

interface StoryContentProps {
  storyId: number;
}

export function StoryContent({ storyId }: StoryContentProps) {
  const queryClient = useQueryClient();

  const {
    data: story,
    isLoading,
    error,
  } = useQuery({
    queryKey: [ReactQueryTags.STORY, storyId],
    queryFn: () => storiesService().findOneById(storyId),
  });

  const { mutate: generateInitialSegment, isPending: isGeneratingInitial } = useMutation({
    mutationFn: () => storiesService().generateInitialSegment(storyId),
    onSuccess: () => {
      notifications.show({
        title: 'Adventure Begins!',
        message: 'Your story has started. Make your first choice!',
        color: 'green',
      });

      queryClient.invalidateQueries({ queryKey: [ReactQueryTags.STORY, storyId] });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Generation Failed',
        message: `Failed to start your story: ${error.message}`,
        color: 'red',
      });
    },
  });

  const { mutate: selectChoice, isPending: isProcessingChoice } = useMutation({
    mutationFn: async ({ segmentId, choice }: { segmentId: number; choice: string }) => {
      await storySegmentsService().update(segmentId, storyId, { selectedChoice: choice });

      if (!story) throw new Error('Story not found');

      const segmentsAfterChoice = story.segments.length;
      const nextSegmentNumber = segmentsAfterChoice + 1;

      if (nextSegmentNumber < story.numberOfSegments) {
        return storiesService().generateNextSegment(storyId);
      } else if (nextSegmentNumber === story.numberOfSegments) {
        return storiesService().generateFinalSegment(storyId);
      }
      throw new Error('Story is already complete');
    },
    onSuccess: () => {
      if (!story) return;

      const nextSegmentNumber = story.segments.length + 1;

      queryClient.invalidateQueries({ queryKey: [ReactQueryTags.STORY, storyId] });

      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);

      if (nextSegmentNumber === story.numberOfSegments) {
        notifications.show({
          title: 'Story Complete!',
          message: 'Your adventure has reached its conclusion!',
          color: 'tertiary',
        });
      }
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Choice Selection Failed',
        message: `Failed to save choice and continue: ${error.message}`,
        color: 'red',
      });
    },
  });

  useEffect(() => {
    if (story && story.segments.length === 0 && !isGeneratingInitial) {
      generateInitialSegment();
    }
  }, [story, isGeneratingInitial, generateInitialSegment]);

  if (isLoading) {
    return (
      <Center>
        <Stack align="center" gap="md">
          <Loader size="xl" color="tertiary" />
          <Title order={3}>Loading Story...</Title>
        </Stack>
      </Center>
    );
  }

  if (error || !story) {
    return (
      <Center>
        <Stack align="center" gap="md">
          <Title order={3} c="dimmed">
            Story not available
          </Title>
          <Text c="dimmed">This story could not be loaded</Text>
        </Stack>
      </Center>
    );
  }

  const isStoryComplete = story.segments.length >= story.numberOfSegments;

  if (isGeneratingInitial && story.segments.length === 0) {
    return (
      <Center>
        <Stack align="center" gap="md">
          <Loader size="xl" color="tertiary" />
          <Title order={3}>Starting Your Adventure...</Title>
          <Text c="dimmed">Creating the beginning of your story</Text>
        </Stack>
      </Center>
    );
  }

  const handleChoiceSelect = (choice: string, segmentId: number) => {
    selectChoice({ segmentId, choice });
  };

  return (
    <Stack gap="xl">
      <Box>
        <Title order={2} ta="center">
          {story.title}
        </Title>
        {isStoryComplete && (
          <Text size="sm" fw={500} c="green" mb="md">
            ✅ Story Complete! You&apos;ve reached the end of your adventure.
          </Text>
        )}
      </Box>

      {story.segments.map((segment, index) => {
        const isLastSegment = index === story.segments.length - 1;
        const isCurrentSegment = isLastSegment && !segment.selectedChoice;
        const isFinalSegment = segment.choices.length === 0;

        return (
          <StorySegmentCard
            key={segment.id}
            segment={segment}
            onChoiceSelect={(choice) => handleChoiceSelect(choice, segment.id)}
            isGenerating={isProcessingChoice && isCurrentSegment}
            isCurrentSegment={isCurrentSegment}
            isFinalSegment={isFinalSegment}
          />
        );
      })}

      {isProcessingChoice && (
        <Center>
          <Stack align="center" gap="md">
            <Loader size="xl" color="tertiary" />
            <Title order={3}>Processing your choice...</Title>
          </Stack>
        </Center>
      )}
    </Stack>
  );
}
