import { xiorClient } from '@/lib';
import { StorySegment } from '@/types/story';

export interface StorySegmentsApi {
  update: (
    segmentId: number,
    storyId: number,
    data: { selectedChoice: string },
  ) => Promise<StorySegment>;
}

export const storySegmentsService = (): StorySegmentsApi => {
  return {
    update,
  };
};

const update = async (segmentId: number, storyId: number, data: { selectedChoice: string }) => {
  const response = await xiorClient.patch<StorySegment>(
    `stories/${storyId}/segments/${segmentId}`,
    data,
  );
  return response.data;
};
