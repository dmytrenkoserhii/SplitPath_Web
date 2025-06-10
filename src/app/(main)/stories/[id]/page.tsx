'use client';

import { Container, Loader, Center, Text, Stack } from '@mantine/core';
import { StorySegmentCard } from '@/components/stories/story-segment-card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { storiesService } from '@/services/stories.service';
import { storySegmentsService } from '@/services/story-segments.service';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function StoryPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const storyId = Number(id);
  
  const currentSegmentNumber = Number(searchParams.get('segment') || '1');

  const isGeneratingRef = useRef(false);
  const hasGeneratedInitialRef = useRef(false);

  const { data: story, isLoading: isLoadingStory, error: storyError } = useQuery({
    queryKey: ['story', storyId],
    queryFn: async () => {
      const response = await storiesService().findOneById(storyId);
      return response.data;
    },
  });

  const { mutate: generateInitialSegment, isPending: isGeneratingInitial } = useMutation({
    mutationFn: async () => {
      const response = await storiesService().generateInitialSegment(storyId);
      return response.data;
    },
    onSuccess: () => {
      hasGeneratedInitialRef.current = true;
      isGeneratingRef.current = false;
      
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['story', storyId] });
      }, 500);
    },
    onError: (error: Error) => {
      isGeneratingRef.current = false;
      hasGeneratedInitialRef.current = false;
      notifications.show({
        title: 'Error',
        message: `Failed to generate initial segment: ${error.message}`,
        color: 'red',
      });
    },
  });

  const { mutate: selectChoiceAndGenerateNext, isPending: isProcessingChoice } = useMutation({
    mutationFn: async ({ segmentId, choice }: { segmentId: number; choice: string }) => {
      await storySegmentsService().update(segmentId, { 
        selectedChoice: choice,
        storyId: storyId
      });
      
      const response = await storiesService().generateNextSegment(storyId, choice);
      return { choice, nextSegment: response.data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['story', storyId] });
      
      const nextSegmentNumber = currentSegmentNumber + 1;
      router.push(`/stories/${storyId}?segment=${nextSegmentNumber}`);
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: `Failed to save your choice and generate next part of the story: ${error.message}`,
        color: 'red',
      });
    },
  });

  const currentSegmentCount = story?.segments?.length || 0;
  const needsInitialSegment = currentSegmentNumber === 1 && 
                              currentSegmentCount === 0 && 
                              !hasGeneratedInitialRef.current;

  useEffect(() => {
    if (!story || isGeneratingRef.current || isGeneratingInitial || isProcessingChoice) {
      return;
    }

    if (needsInitialSegment) {
      isGeneratingRef.current = true;
      generateInitialSegment();
    }
  }, [story, needsInitialSegment, isGeneratingInitial, isProcessingChoice]);

  const handleChoiceSelect = (choice: string, segmentId: number) => {
    selectChoiceAndGenerateNext({ segmentId, choice });
  };

  if (isLoadingStory) {
    return (
      <Center h="100vh">
        <Loader size="xl" color="orange" />
      </Center>
    );
  }

  if (storyError) {
    return (
      <Center h="100vh">
        <Text c="red">Failed to load story. Please try again later.</Text>
      </Center>
    );
  }

  if (!story) {
    return (
      <Center h="100vh">
        <Text>Story not found.</Text>
      </Center>
    );
  }

  if (isGeneratingInitial) {
    return (
      <Container size="lg" py="xl">
        <Center>
          <Stack align="center" gap="md">
            <Loader size="xl" color="orange" />
            <Text>Creating your story...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  const segmentsToDisplay = (story.segments || [])
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(0, currentSegmentNumber);

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {segmentsToDisplay.map((segment, index) => {
          const segmentNumber = index + 1;
          const isCurrentSegment = segmentNumber === currentSegmentNumber && !segment.selectedChoice;
          
          return (
            <StorySegmentCard
              key={segment.id}
              segment={segment}
              onChoiceSelect={(choice) => handleChoiceSelect(choice, segment.id)}
              isGenerating={isProcessingChoice && isCurrentSegment}
              isCurrentSegment={isCurrentSegment}
            />
          );
        })}
        
        {isProcessingChoice && (
          <Center>
            <Stack align="center" gap="md">
              <Loader size="lg" color="orange" />
              <Text>Generating next part of your story...</Text>
            </Stack>
          </Center>
        )}
      </Stack>
    </Container>
  );
}
