'use server';

import { cookies } from 'next/headers';

/**
 * Extracts Set-Cookie headers from a response
 */
export async function extractCookieHeaders(
  response: Response
): Promise<string[]> {
  return (
    response.headers.getSetCookie?.() ||
    response.headers
      .get('Set-Cookie')
      ?.split(',')
      .map((cookie) => cookie.trim()) ||
    []
  );
}

/**
 * Sets cookies from Set-Cookie headers in the response
 */
export async function setCookiesFromResponse(
  response: Response
): Promise<void> {
  const setCookieHeaders = extractCookieHeaders(response);
  const cookieStore = await cookies();

  for (const cookieStr of await setCookieHeaders) {
    const [nameValue, ...options] = cookieStr
      .split(';')
      .map((part) => part.trim());
    const [name, value] = nameValue.split('=');

    if (name && value) {
      const cookieOptions: any = {};

      options.forEach((option) => {
        const [key, val] = option.split('=').map((s) => s?.trim());
        const lowerKey = key?.toLowerCase();

        if (lowerKey === 'httponly') cookieOptions.httpOnly = true;
        else if (lowerKey === 'secure') cookieOptions.secure = true;
        else if (lowerKey === 'path') cookieOptions.path = val;
        else if (lowerKey === 'max-age') cookieOptions.maxAge = parseInt(val);
        else if (lowerKey === 'samesite')
          cookieOptions.sameSite = val?.toLowerCase();
      });

      cookieStore.set(name, value, cookieOptions);
    }
  }
}
