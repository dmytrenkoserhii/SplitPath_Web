import { xiorClient } from '@/lib';
import { PaginatedResponse } from '@/types/shared';
import { CreateStoryPayload, FindAllPaginatedOptions, Story, StorySegment } from '@/types/story';

export interface StoriesApi {
  create: (data: CreateStoryPayload) => Promise<Story>;
  findAllPaginated: (options: FindAllPaginatedOptions) => Promise<PaginatedResponse<Story>>;
  findOneById: (id: number) => Promise<Story>;
  generateInitialSegment: (storyId: number) => Promise<StorySegment>;
  generateNextSegment: (storyId: number) => Promise<StorySegment>;
  generateFinalSegment: (storyId: number) => Promise<StorySegment>;
}

export const storiesService = (): StoriesApi => {
  return {
    create,
    findAllPaginated,
    findOneById,
    generateInitialSegment,
    generateNextSegment,
    generateFinalSegment,
  };
};

const create = async (data: CreateStoryPayload) => {
  const response = await xiorClient.post<Story>('stories', data);
  return response.data;
};

const findAllPaginated = async ({ page, limit, sort, status }: FindAllPaginatedOptions) => {
  const response = await xiorClient.get<PaginatedResponse<Story>>('stories', {
    params: { page, limit, sort, status },
  });
  return response.data;
};

const findOneById = async (id: number) => {
  const response = await xiorClient.get<Story>(`stories/${id}`);
  return response.data;
};

const generateInitialSegment = async (storyId: number) => {
  const response = await xiorClient.post<StorySegment>(
    `stories/${storyId}/segments/generate-initial`,
  );
  return response.data;
};

const generateNextSegment = async (storyId: number) => {
  const response = await xiorClient.post<StorySegment>(`stories/${storyId}/segments/generate-next`);
  return response.data;
};

const generateFinalSegment = async (storyId: number) => {
  const response = await xiorClient.post<StorySegment>(
    `stories/${storyId}/segments/generate-final`,
  );
  return response.data;
};
