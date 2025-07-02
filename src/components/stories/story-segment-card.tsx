import { useRouter } from 'next/navigation';

import { Button, Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';

import { StorySegment } from '@/types/story';

import { ChoiceButton } from './choise-button';
import styles from './story-segment-card.module.css';

interface StorySegmentCardProps {
  segment: StorySegment;
  onChoiceSelect: (choice: string) => void;
  isGenerating: boolean;
  isCurrentSegment: boolean;
  isFinalSegment?: boolean;
}

export function StorySegmentCard({
  segment,
  onChoiceSelect,
  isGenerating,
  isCurrentSegment,
  isFinalSegment = false,
}: StorySegmentCardProps) {
  const router = useRouter();
  const hasSelectedChoice = segment.selectedChoice !== null;
  const shouldShowActiveChoices = isCurrentSegment && !hasSelectedChoice && !isFinalSegment;

  const handleCreateNewStory = () => {
    router.push('/stories/selection');
  };

  if (isFinalSegment) {
    return (
      <Card className={styles.card} shadow="sm" p="lg" radius="md" withBorder mb="md">
        <Stack>
          <Text size="lg">{segment.text}</Text>
          <Stack gap="md">
            <Title order={3} c="green" ta="center">
              🎉 Adventure Complete!
            </Title>
            <Text ta="center" c="dimmed">
              Thank you for experiencing this story. What would you like to do next?
            </Text>
            <Group justify="center" gap="md">
              <Button color="tertiary" onClick={handleCreateNewStory}>
                Create New Adventure
              </Button>
            </Group>
          </Stack>
        </Stack>
      </Card>
    );
  }

  return (
    <Card className={styles.card} shadow="sm" p="lg" radius="md" withBorder mb="md">
      <Stack>
        <Text size="lg">{segment.text}</Text>
        <Stack gap="md">
          <Text size="sm" fw={500} c="dimmed">
            {shouldShowActiveChoices ? 'Choose your next action:' : 'Available choices:'}
          </Text>
          <SimpleGrid cols={2} spacing="sm">
            {segment.choices.map((choice, index) => {
              const isSelected = choice === segment.selectedChoice;

              return (
                <ChoiceButton
                  key={index}
                  choice={choice}
                  isSelected={isSelected}
                  shouldShowActiveChoices={shouldShowActiveChoices}
                  isGenerating={isGenerating}
                  onChoiceSelect={onChoiceSelect}
                />
              );
            })}
          </SimpleGrid>
        </Stack>
      </Stack>
    </Card>
  );
}
