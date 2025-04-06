import { Group, ThemeIcon, Text } from '@mantine/core';

// Feature component displays an icon with title and description
interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function Feature({ icon, title, description }: FeatureProps) {
  return (
    <Group align='flex-start' wrap='nowrap'>
      <ThemeIcon size='xl' radius='md' variant='light' color='orange'>
        {icon}
      </ThemeIcon>
      <div>
        <Text fw={700} size='lg' mb={5}>
          {title}
        </Text>
        <Text c='dimmed' size='sm'>
          {description}
        </Text>
      </div>
    </Group>
  );
}
