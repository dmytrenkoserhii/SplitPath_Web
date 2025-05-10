'use server';

import { xiorClient } from '@/lib';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error('Missing environment variable: BACKEND_URL');
}

// TODO: Do we even need to use server actions for this?
export async function getCurrentUserAction(): Promise<{
  user: any | null;
  error?: string;
}> {
  try {
    const response = await xiorClient.get(`${BACKEND_URL}/users/current`);
    if (!response.response.ok) {
      if (response.response.status === 401) {
        return { user: null, error: 'Unauthorized or session expired.' };
      }
      return { user: null, error: `Failed to fetch user: ${response.status}` };
    }
    const data = response.data;
    // Ensure the data is serializable by converting it to a plain object
    const serializedData = JSON.parse(JSON.stringify(data));
    return { user: serializedData };
  } catch (error: any) {
    console.error('Error in getMeAction:', error);
    return { user: null, error: error.message || 'Could not fetch user data.' };
  }
}
