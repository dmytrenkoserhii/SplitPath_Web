import { authService } from '@/services';
import { NextResponse } from 'next/server';
import { extractAndParseCookies } from './extract-and-parse-cookies.util';
import { appendCookiesToNextResponse } from './append-cookies-to-next-response.util';

/**
 * Refreshes an access token by calling the refresh token endpoint of the authentication API.
 * It extracts the new `access_token` and `refresh_token` cookies from the API response
 * and appends them to the provided `NextResponse`.
 *
 * @param response The `NextResponse` to which the new authentication cookies will be appended.
 * @param headers The `Headers` object containing the current refresh token cookie to be sent to the refresh API.
 * @returns A promise that resolves with the `NextResponse` including the new authentication cookies.
 */
export const refreshAccessToken = async (
  response: NextResponse,
  headers: Headers
) => {
  const refreshAccessTokenResponse = await authService().refreshAccessToken(headers);
  const setCookieHeader = refreshAccessTokenResponse.headers
    .getSetCookie()
    .join('; ');
  const refreshedAuthCookies = extractAndParseCookies(setCookieHeader, [
    'access_token',
    'refresh_token',
  ]);
  const newResponse = appendCookiesToNextResponse(
    response,
    refreshedAuthCookies
  );
  return newResponse;
};
