import { createTheme, rem } from '@mantine/core';

export const theme = createTheme({
  /* Default theme colors */
  primaryColor: 'orange',

  /* Custom colors */
  colors: {},

  /* Typography */
  fontFamily: 'Roboto, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    fontFamily: 'Roboto, sans-serif',
    sizes: {
      h1: { fontSize: rem(34), lineHeight: '1.3' },
      h2: { fontSize: rem(26), lineHeight: '1.35' },
      h3: { fontSize: rem(22), lineHeight: '1.4' },
      h4: { fontSize: rem(18), lineHeight: '1.45' },
      h5: { fontSize: rem(16), lineHeight: '1.5' },
      h6: { fontSize: rem(14), lineHeight: '1.5' },
    },
  },

  /* Other theme customizations */
  spacing: {
    xs: rem(4),
    sm: rem(8),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
  },

  breakpoints: {
    xs: '36em',
    sm: '48em',
    md: '62em',
    lg: '75em',
    xl: '88em',
  },
});
