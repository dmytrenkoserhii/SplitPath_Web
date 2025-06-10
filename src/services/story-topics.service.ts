import { XiorResponse } from 'xior';
import { xiorClient } from '@/lib';
import { StoryTopic } from '@/types/story';

export interface CreateStoryTopicDto {
  name: string;
  description?: string;
}

interface StoryTopicsApi {
  create: (data: CreateStoryTopicDto) => Promise<XiorResponse<StoryTopic>>;
  findAll: () => Promise<XiorResponse<StoryTopic[]>>;
}

export const storyTopicsService = (): StoryTopicsApi => {
  return {
    create,
    findAll,
  };
};


const create = (data: CreateStoryTopicDto) => {
  return xiorClient.post<StoryTopic>('story-topics', data);
};


const findAll = () => {
  return xiorClient.get<StoryTopic[]>('story-topics');
}; 