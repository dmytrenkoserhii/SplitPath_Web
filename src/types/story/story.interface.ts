import { User } from '@/types/user';
import { StoryStatus } from '@/enums';
import { StorySegment } from './story-segment.interface';
import { StoryTopic } from './story-topic.interface';

export interface Story {
  id: number;
  title: string;
  status: StoryStatus;
  user: User;
  storyTopic: StoryTopic;
  segments: StorySegment[];
  createdAt: Date;
  updatedAt: Date;
}
