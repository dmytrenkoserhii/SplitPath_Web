import { XiorResponse } from 'xior';

import { xiorClient } from '@/lib';
import { CreateTopicSchemaType } from '@/schemas/stories';
import { StoryTopic } from '@/types/story/story-topic.interface';

interface StoryTopicsApi {
  findAll: () => Promise<StoryTopic[]>;
  create: (data: CreateTopicSchemaType) => Promise<StoryTopic>;
  update: (id: number, data: CreateTopicSchemaType) => Promise<StoryTopic>;
  remove: (id: number) => Promise<XiorResponse<StoryTopic>>;
}

export const storyTopicsService = (): StoryTopicsApi => {
  return {
    findAll,
    create,
    update,
    remove,
  };
};

const findAll = async () => {
  const response = await xiorClient.get<StoryTopic[]>('story-topics');
  return response.data;
};

const create = async (data: CreateTopicSchemaType) => {
  const response = await xiorClient.post<StoryTopic>('story-topics', data);
  return response.data;
};

const update = async (id: number, data: CreateTopicSchemaType) => {
  const response = await xiorClient.patch<StoryTopic>(`story-topics/${id}`, data);
  return response.data;
};

const remove = async (id: number) => {
  return xiorClient.delete<StoryTopic>(`story-topics/${id}`);
};
