import dayjs from 'dayjs';

/**
 * Format a date to a readable string
 */
export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A';
  return dayjs(date).format('MMM D, YYYY');
};
