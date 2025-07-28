import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

type Props = {
  accessToken?: RequestCookie;
  refreshToken?: RequestCookie;
};

/**
 * Creates a new `Headers` object with authentication cookies (access token and refresh token) added.
 * If the original headers already contain a 'Cookie' header, the new cookies are appended to it.
 * Otherwise, a new 'Cookie' header is created with the provided cookies.
 *
 * @param headers The original `Headers` object.
 * @param {Props} authCookies An object containing optional `accessToken` and `refreshToken` as `RequestCookie` objects.
 * @returns A new `Headers` object with the authentication cookies included.
 */
export const createAuthHeaders = (headers: Headers, { accessToken, refreshToken }: Props) => {
  const cookies: string[] = [];

  if (accessToken) {
    cookies.push(`${accessToken.name}=${accessToken.value}`);
  }

  if (refreshToken) {
    cookies.push(`${refreshToken.name}=${refreshToken.value}`);
  }

  const newHeaders = new Headers(headers);

  if (cookies.length > 0) {
    const existingCookieHeader = newHeaders.get('Cookie');
    if (existingCookieHeader) {
      newHeaders.set('Cookie', `${existingCookieHeader}; ${cookies.join('; ')}`);
    } else {
      newHeaders.set('Cookie', cookies.join('; '));
    }
  }

  return newHeaders;
};
