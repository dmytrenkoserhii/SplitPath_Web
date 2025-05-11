import { Story } from './story.interface';

export interface StorySegment {
  id: number;
  text: string;
  choices: string[];
  selectedChoice: string | null;
  story: Story;
  createdAt: Date;
  updatedAt: Date;
}
