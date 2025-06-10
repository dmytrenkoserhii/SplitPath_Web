import { Card, Text, Stack, SimpleGrid } from '@mantine/core';
import { StorySegment } from '@/types/story';
import { ChoiceButton } from './choice-button';
import styles from './story-segment-card.module.css';

interface StorySegmentCardProps {
  segment: StorySegment;
  onChoiceSelect: (choice: string) => void;
  isGenerating: boolean;
  isCurrentSegment: boolean;
}

export function StorySegmentCard({ 
  segment, 
  onChoiceSelect, 
  isGenerating,
  isCurrentSegment
}: StorySegmentCardProps) {
  const hasSelectedChoice = segment.selectedChoice !== null;
  const shouldShowActiveChoices = isCurrentSegment && !hasSelectedChoice;

  return (
    <Card className={styles.card} shadow="sm" p="lg" radius="md" withBorder mb="md">
      <Stack>
        <Text size="lg">{segment.text}</Text>
        
        <Stack gap="md">
          <Text size="sm" fw={500} c="dimmed">
            {shouldShowActiveChoices ? "Choose your next action:" : "Available choices:"}
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
