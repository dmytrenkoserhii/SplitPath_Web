import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { convertObjectKeysToCamelCaseAndConvertStringValuesToType } from './convert-object.util';

/**
 * Extracts and parses cookies from a raw cookie string, filtering by a list of specified cookie names.
 * It converts cookie attribute names to camelCase and their string values to appropriate JavaScript types.
 *
 * @param cookieString The raw cookie string (e.g., from a 'Set-Cookie' header).
 * @param cookieNames An array of cookie names to extract and parse.
 * @returns An array of `ResponseCookie` objects for the specified cookie names found in the string.
 */
export function extractAndParseCookies(
  cookieString: string,
  cookieNames: string[]
) {
  const cookies: ResponseCookie[] = [];

  const individualCookies = cookieString.split(/,\s*(?=[^;]+=[^;]+)/);

  individualCookies.forEach((cookiePart) => {
    const regex = new RegExp(`(${cookieNames.join('|')})=([^;]*)`, 'g');
    let match;

    while ((match = regex.exec(cookiePart)) !== null) {
      const name = match[1];
      const value = match[2].trim();

      const parts = cookiePart.split(/;\s*/);
      const attributes: Record<string, string> = {};

      parts.slice(1).forEach((attr) => {
        const [attrName, ...attrValueParts] = attr.split('=');
        const attrValue = attrValueParts.join('=').trim();

        if (attrName) {
          if (attrName.toLowerCase() === 'httponly') {
            attributes[attrName] = 'true';
          } else if (attrName.toLowerCase() === 'secure') {
            attributes[attrName] = 'true';
          } else {
            attributes[attrName] = attrValue || '';
          }
        }
      });

      attributes.name = name;
      attributes.value = value;

      cookies.push(
        convertObjectKeysToCamelCaseAndConvertStringValuesToType(attributes)
      );
    }
  });

  return cookies;
}
