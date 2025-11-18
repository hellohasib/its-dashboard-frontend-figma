// Typography tokens extracted from Figma design

export const typography = {
  fontFamily: {
    DEFAULT: 'Inter, system-ui, sans-serif',
  },
  
  // Text styles from Figma
  heading: {
    h1: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: '1.25em',
      letterSpacing: '-1%',
    },
    h2: {
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: '1.44em',
    },
  },
  
  body: {
    large: {
      regular: {
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: '1.5em',
      },
      semibold: {
        fontSize: '18px',
        fontWeight: 600,
        lineHeight: '1.44em',
      },
      bold: {
        fontSize: '16px',
        fontWeight: 700,
        lineHeight: '1.5em',
      },
    },
    medium: {
      regular: {
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '1.57em',
      },
      medium: {
        fontSize: '16px',
        fontWeight: 500,
        lineHeight: '1.5em',
      },
      bold: {
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '1.57em',
      },
    },
    small: {
      regular: {
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '1.29em',
      },
      medium: {
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '1.29em',
      },
    },
  },
  
  caption: {
    fontSize: '10px',
    fontWeight: 400,
    lineHeight: '1.4em',
  },
} as const;

