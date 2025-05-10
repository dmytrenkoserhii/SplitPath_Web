/**
 * Checks if the current execution environment is client-side (i.e., in a browser).
 *
 * @returns `true` if the code is running in a browser environment (where `window` is defined), `false` otherwise.
 */
export const isClientSide = () => {
  return typeof window !== 'undefined';
};
