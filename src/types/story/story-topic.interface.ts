import { Story } from './story.interface';

export interface StoryTopic {
  id: number;
  name: string;
  description?: string;
  stories: Story[];
  createdAt: Date;
  updatedAt: Date;
}
