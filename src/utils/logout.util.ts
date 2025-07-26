import { NextResponse } from 'next/server';

import { authService } from '@/services';

import { appendCookiesToNextResponse } from './append-cookies-to-next-response.util';
import { extractAndParseCookies } from './extract-and-parse-cookies.util';

/**
 * Logs out a user by calling the logout endpoint of the authentication API.
 * It extracts the `access_token` and `refresh_token` cookies from the API response (which should be cleared cookies),
 * and appends these cleared cookies to the provided `NextResponse`.
 *
 * @param response The `NextResponse` to which the cleared authentication cookies will be appended.
 * @param headers The `Headers` object containing the current authentication cookies to be sent to the logout API.
 * @returns A promise that resolves with the `NextResponse` including the cleared authentication cookies.
 */
export const logout = async (response: NextResponse, headers: Headers) => {
  const refreshAccessTokenResponse = await authService().logout(headers);
  const setCookieHeader = refreshAccessTokenResponse.headers.getSetCookie().join('; ');
  const removedAuthCookies = extractAndParseCookies(setCookieHeader, [
    'access_token',
    'refresh_token',
  ]);
  const newResponse = appendCookiesToNextResponse(response, removedAuthCookies);
  return newResponse;
};
