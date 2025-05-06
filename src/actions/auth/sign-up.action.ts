// app/actions/auth.ts
'use server';

import { z } from 'zod';
import { SignUpFormSchema } from '@/schemas/auth';
import { setCookiesFromResponse } from '@/utils/cookies';

type SignUpInput = Omit<
  z.infer<typeof SignUpFormSchema>,
  'passwordConfirmation' | 'terms'
>;

interface ActionResult {
  success: boolean;
  error?: string;
}

const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error('Missing environment variable: BACKEND_URL');
}

export async function signUpAction(values: SignUpInput): Promise<ActionResult> {
  console.log('signUpAction', values);
  try {
    const response = await fetch(`${BACKEND_URL}/auth/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      return { success: false, error: errorMessage };
    }

    // Set cookies from response using the utility function
    await setCookiesFromResponse(response);

    return { success: true };
  } catch (error) {
    console.error('Error during sign up:', error);
    return {
      success: false,
      error: 'An unknown error occurred during sign up.',
    };
  }
}
