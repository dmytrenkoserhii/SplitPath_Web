import { XiorError } from 'xior';

/**
 * Checks if an error is an unauthorized error (HTTP 401) from a Xior API request.
 *
 * @param error The error object to check.
 * @returns `true` if the error is a `XiorError` with a response status of 401, `false` otherwise.
 */
export const isUnauthorizedError = (error: unknown): boolean => {
  if (error instanceof XiorError && error.response?.status === 401) {
    return true;
  } else {
    return false;
  }
};
