import { redirect } from 'next/navigation';

import { Box, Center, Text, Title } from '@mantine/core';

import { ServerError } from '@/components/auth';
import { StoryFilters } from '@/components/stories';
import { StoryCardsList } from '@/components/stories/story-cards-list';
import { Pagination } from '@/components/ui';
import { StoryStatus } from '@/enums';
import { storiesService } from '@/services/stories.service';

type SearchParamsType = { page?: string; status?: string };

interface StoriesPageProps {
  searchParams: SearchParamsType;
}

export default async function StoriesPage({ searchParams }: StoriesPageProps) {
  const params = await searchParams;
  if (!params.page || Number(params.page) < 1) {
    redirect('/stories?page=1');
  }

  try {
    const currentPage = Number(params.page);
    const itemsPerPage = 9;

    const defaultStatuses = `${StoryStatus.NEW},${StoryStatus.IN_PROGRESS}`;
    const statusParam = params.status || defaultStatuses;

    const storiesData = await storiesService().findAllPaginated({
      page: currentPage,
      limit: itemsPerPage,
      status: statusParam,
    });

    if (!storiesData.items.length) {
      return (
        <Box>
          <Title c="tertiary" ta="center" mb="md">
            Active Stories
          </Title>
          <Center py="xl">
            <Text size="lg" c="dimmed">
              No active stories found
            </Text>
          </Center>
        </Box>
      );
    }

    return (
      <Box>
        <Title ta="center" mb="md">
          Active Stories
        </Title>

        <StoryFilters />

        <Box mb="md" style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
          <Text c="dimmed" size="sm">
            Page {storiesData.meta.currentPage} of {storiesData.meta.totalPages}
          </Text>
        </Box>

        <StoryCardsList stories={storiesData.items} />

        {
          <Pagination
            currentPage={storiesData.meta.currentPage}
            totalPages={storiesData.meta.totalPages}
          />
        }
      </Box>
    );
  } catch (error) {
    return <ServerError error={error} />;
  }
}
