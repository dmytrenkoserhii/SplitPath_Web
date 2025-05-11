import { isUnauthorizedError } from '@/utils';
import { RefreshAccessToken } from './refresh-access-token';

type Props = {
  error: unknown;
};

/**
 * Renders a server error component that refreshes the access token if the error is an unauthorized error.
 * Otherwise, it throws the error.
 * If server components encounter an error, it will be caught and this component will be rendered.
 *
 * @param error - The error to be rendered.
 * @returns A React component that renders the error or refreshes the access token.
 */
export const ServerError = ({ error }: Props) => {
  if (isUnauthorizedError(error)) {
    return <RefreshAccessToken />;
  }

  throw error;
};
