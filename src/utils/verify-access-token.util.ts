import { authService } from '@/services';

/**
 * Verifies an access token by making a request to the authentication API.
 * It sends the provided headers (which should contain the access token cookie) to the `/verifyAccessToken` endpoint.
 *
 * @param headers The `Headers` object containing the cookie with the access token.
 * @returns A promise that resolves with the data from the verification API response.
 */
export const verifyAccessToken = async (headers: Headers) => {
  const result = await authService().verifyAccessToken(headers);
  return result.data;
};
