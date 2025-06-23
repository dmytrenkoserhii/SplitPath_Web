'use client';

import { useEffect, useRef } from 'react';

import { useRouter } from 'next/navigation';

import { Box, Stack, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { useMutation } from '@tanstack/react-query';

import { storiesService, storySegmentsService } from '@/services';
import { Story } from '@/types/story';

import { LoadingState } from './loading-state';
import { StorySegmentCard } from './story-segment';

interface StoryContentProps {
  story: Story;
}

export function StoryContent({ story }: StoryContentProps) {
  const router = useRouter();
  const generationInitiatedRef = useRef(false);
  const storyEndRef = useRef<HTMLDivElement>(null);

  const existingSegments = story.segments || [];
  const totalSegments = story.numberOfSegments || 10;

  const currentSegmentCount = existingSegments.length;
  const isStoryComplete = currentSegmentCount >= totalSegments;

  const shouldAutoGenerate = currentSegmentCount === 0;
  const previousSegmentCountRef = useRef(currentSegmentCount);

  const { mutate: generateInitialSegment, isPending: isGeneratingInitial } = useMutation({
    mutationFn: () => storiesService().generateInitialSegment(story.id),
    onSuccess: () => {
      notifications.show({
        title: 'Adventure Begins!',
        message: 'Your story has started. Make your first choice!',
        color: 'green',
      });

      router.push(`/stories/${story.id}`);
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
      await storySegmentsService().update(segmentId, story.id, { selectedChoice: choice });

      const segmentsAfterChoice = currentSegmentCount;
      const nextSegmentNumber = segmentsAfterChoice + 1;

      if (nextSegmentNumber < totalSegments) {
        return storiesService().generateNextSegment(story.id);
      } else if (nextSegmentNumber === totalSegments) {
        return storiesService().generateFinalSegment(story.id);
      } else {
        throw new Error('Story is already complete');
      }
    },
    onSuccess: () => {
      const nextSegmentNumber = currentSegmentCount + 1;

      router.refresh();

      if (nextSegmentNumber === totalSegments) {
        notifications.show({
          title: 'Story Complete!',
          message: 'Your adventure has reached its conclusion!',
          color: 'orange',
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
    if (shouldAutoGenerate && !isGeneratingInitial && !generationInitiatedRef.current) {
      generationInitiatedRef.current = true;
      generateInitialSegment();
    }
  }, [shouldAutoGenerate, isGeneratingInitial, generateInitialSegment]);

  useEffect(() => {
    if (currentSegmentCount > previousSegmentCountRef.current) {
      setTimeout(() => {
        storyEndRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      }, 100);
    }
    previousSegmentCountRef.current = currentSegmentCount;
  }, [currentSegmentCount]);

  const handleChoiceSelect = (choice: string, segmentId: number) => {
    selectChoice({ segmentId, choice });
  };

  if (isGeneratingInitial && currentSegmentCount === 0) {
    return (
      <LoadingState
        title="Starting Your Adventure..."
        message="Creating the beginning of your story"
        size="xl"
      />
    );
  }

  const segmentsToDisplay = existingSegments.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return (
    <Stack gap="xl">
      <Box>
        <Title order={2} mb="md">
          {story.title}
        </Title>
        {isStoryComplete && (
          <Text size="sm" fw={500} c="green" mb="md">
            ✅ Story Complete! You&apos;ve reached the end of your adventure.
          </Text>
        )}
      </Box>

      {segmentsToDisplay.map((segment, index) => {
        const isLastSegment = index === segmentsToDisplay.length - 1;
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

      {isProcessingChoice && <LoadingState title="" message="Processing your choice..." />}

      <div ref={storyEndRef} style={{ height: '1px' }} />
    </Stack>
  );
}
