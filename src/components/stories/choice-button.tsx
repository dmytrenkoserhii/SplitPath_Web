'use client';

import { Button } from '@mantine/core';
import styles from './story-segment-card.module.css';

interface ChoiceButtonProps {
  choice: string;
  isSelected: boolean;
  shouldShowActiveChoices: boolean;
  isGenerating: boolean;
  onChoiceSelect: (choice: string) => void;
}

export function ChoiceButton({ 
  choice, 
  isSelected, 
  shouldShowActiveChoices, 
  isGenerating, 
  onChoiceSelect 
}: ChoiceButtonProps) {
  const isDisabled = !shouldShowActiveChoices || isGenerating;
  
  return (
    <Button
      variant={isSelected ? "filled" : "outline"}
      color={isSelected ? "green" : (shouldShowActiveChoices ? "orange" : "gray")}
      size="sm"
      onClick={() => shouldShowActiveChoices ? onChoiceSelect(choice) : undefined}
      disabled={isDisabled}
      className={`${styles.choiceButton} ${!shouldShowActiveChoices && !isSelected ? styles.inactiveChoiceButton : ''}`}
    >
      {choice}
    </Button>
  );
} 