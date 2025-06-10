import { XiorResponse } from 'xior';
import { xiorClient } from '@/lib';
import { Story } from '@/types/story';

export interface CreateStoryDto {
  title: string;
  topicId: number;
}

interface StoriesApi {
  create: (data: CreateStoryDto) => Promise<XiorResponse<Story>>;
  generateInitialSegment: (storyId: number) => Promise<XiorResponse<{ text: string; choices: string[] }>>;
  generateNextSegment: (storyId: number, selectedChoice: string) => Promise<XiorResponse<{ text: string; choices: string[] }>>;
  findOneById: (id: number, segmentId?: number) => Promise<XiorResponse<Story>>;
}

export const storiesService = (): StoriesApi => {
  return {
    create,
    generateInitialSegment,
    generateNextSegment,
    findOneById,
  };
};

const create = (data: CreateStoryDto) => {
  const payload = {
    title: data.title,
    topicId: Number(data.topicId),
  };
  return xiorClient.post<Story>('stories', payload);
};

const generateInitialSegment = (storyId: number) => {
  return xiorClient.post<{ text: string; choices: string[] }>(
    `stories/${Number(storyId)}/segments/generate-initial`
  );
};


const generateNextSegment = (storyId: number, selectedChoice: string) => {
  return xiorClient.post<{ text: string; choices: string[] }>(
    `stories/${Number(storyId)}/segments/generate-next`,
    { selectedChoice }
  );
};


const findOneById = (id: number, segmentId?: number) => {
  const url = segmentId 
    ? `stories/${Number(id)}?segment=${Number(segmentId)}&include=segments`
    : `stories/${Number(id)}?include=segments`;
  return xiorClient.get<Story>(url);
}; 