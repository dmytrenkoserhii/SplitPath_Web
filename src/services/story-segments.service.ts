import { XiorResponse } from 'xior';
import { xiorClient } from '@/lib';
import { StorySegment } from '@/types/story';

export interface CreateStorySegmentDto {
  text: string;
  choices: string[];
  storyId: number;
  selectedChoice?: string;
}

export interface UpdateStorySegmentDto {
  selectedChoice?: string;
  storyId?: number;
}

interface StorySegmentsApi {
  update: (id: number, data: UpdateStorySegmentDto) => Promise<XiorResponse<StorySegment>>;
}

export const storySegmentsService = (): StorySegmentsApi => {
  return {
    update,
  };
};


const update = (id: number, data: UpdateStorySegmentDto) => {
  const storyId = data.storyId;
  if (!storyId) {
    throw new Error('Story ID is required for segment update');
  }
  return xiorClient.patch<StorySegment>(`stories/${storyId}/segments/${id}`, data);
}; 