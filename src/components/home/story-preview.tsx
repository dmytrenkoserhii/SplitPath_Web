import { Box, Card, CardSection, Text } from '@mantine/core';

interface StoryPreviewProps {
  title: string;
  description: string;
  imageUrl: string;
}

export const StoryPreview = ({ title, description, imageUrl }: StoryPreviewProps) => {
  return (
    <Card shadow="md" padding="xl" radius="md" withBorder>
      <CardSection>
        <Box
          style={{
            background: 'linear-gradient(45deg, #FF7B00, #FF4D00)',
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <Text size="xl" fw={700}>
            {title}
          </Text>
        </Box>
      </CardSection>
      <Text fw={700} size="xl" mt="xl" mb="sm">
        {title}
      </Text>
      <Text size="md" c="dimmed" lh={1.6}>
        {description}
      </Text>
    </Card>
  );
};
