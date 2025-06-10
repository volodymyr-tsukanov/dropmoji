/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
import { createSystem, defaultConfig, defineConfig, defineSemanticTokens, defineTokens } from "@chakra-ui/react"


const tokens = defineTokens({
  colors: {
    brand: {
      DEFAULT: { value: "#319795" },
      50: { value: "#E6FFFA" },
      100: { value: "#B2F5EA" },
      200: { value: "#81E6D9" },
      300: { value: "#4FD1C7" },
      400: { value: "#38B2AC" },
      500: { value: "#319795" },
      600: { value: "#2C7A7B" },
      700: { value: "#285E61" },
      800: { value: "#234E52" },
      900: { value: "#1D4044" },
    },
    accent: {
      DEFAULT: { value: "#E53E3E" },
      50: { value: "#FFF5F5" },
      100: { value: "#FED7D7" },
      200: { value: "#FEB2B2" },
      300: { value: "#FC8181" },
      400: { value: "#F56565" },
      500: { value: "#E53E3E" },
      600: { value: "#C53030" },
      700: { value: "#9B2C2C" },
      800: { value: "#822727" },
      900: { value: "#63171B" },
    },
    // Security-themed colors for warnings/alerts
    warning: {
      DEFAULT: { value: "#F59E0B" },
      50: { value: "#FFFBEB" },
      100: { value: "#FEF3C7" },
      200: { value: "#FDE68A" },
      300: { value: "#FCD34D" },
      400: { value: "#FBBF24" },
      500: { value: "#F59E0B" },
      600: { value: "#D97706" },
      700: { value: "#B45309" },
      800: { value: "#92400E" },
      900: { value: "#78350F" },
    },
    // Success colors for message creation
    success: {
      DEFAULT: { value: "#22C55E" },
      50: { value: "#F0FDF4" },
      100: { value: "#DCFCE7" },
      200: { value: "#BBF7D0" },
      300: { value: "#86EFAC" },
      400: { value: "#4ADE80" },
      500: { value: "#22C55E" },
      600: { value: "#16A34A" },
      700: { value: "#15803D" },
      800: { value: "#166534" },
      900: { value: "#14532D" },
    },
  },
  fonts: {
    heading: { value: "Inter, sans-serif" },
    body: { value: "Inter, sans-serif" },
    mono: { value: "JetBrains Mono, Fira Code, Monaco, monospace" },
  },
  fontSizes: {
    xs: { value: "0.75rem" },
    sm: { value: "0.875rem" },
    md: { value: "1rem" },
    lg: { value: "1.125rem" },
    xl: { value: "1.25rem" },
    "2xl": { value: "1.5rem" },
    "3xl": { value: "1.875rem" },
    "4xl": { value: "2.25rem" },
    "5xl": { value: "3rem" },
    "6xl": { value: "3.75rem" },
    "7xl": { value: "4.5rem" },
    "8xl": { value: "6rem" },
    "9xl": { value: "8rem" },
  },
  spacing: {
    px: { value: "1px" },
    0.5: { value: "0.125rem" },
    1: { value: "0.25rem" },
    1.5: { value: "0.375rem" },
    2: { value: "0.5rem" },
    2.5: { value: "0.625rem" },
    3: { value: "0.75rem" },
    3.5: { value: "0.875rem" },
    4: { value: "1rem" },
    5: { value: "1.25rem" },
    6: { value: "1.5rem" },
    7: { value: "1.75rem" },
    8: { value: "2rem" },
    9: { value: "2.25rem" },
    10: { value: "2.5rem" },
    12: { value: "3rem" },
    14: { value: "3.5rem" },
    16: { value: "4rem" },
    20: { value: "5rem" },
    24: { value: "6rem" },
    28: { value: "7rem" },
    32: { value: "8rem" },
    36: { value: "9rem" },
    40: { value: "10rem" },
    44: { value: "11rem" },
    48: { value: "12rem" },
    52: { value: "13rem" },
    56: { value: "14rem" },
    60: { value: "15rem" },
    64: { value: "16rem" },
    72: { value: "18rem" },
    80: { value: "20rem" },
    96: { value: "24rem" },
  },
  radii: {
    none: { value: "0" },
    sm: { value: "0.125rem" },
    base: { value: "0.25rem" },
    md: { value: "0.375rem" },
    lg: { value: "0.5rem" },
    xl: { value: "0.75rem" },
    "2xl": { value: "1rem" },
    "3xl": { value: "1.5rem" },
    full: { value: "9999px" },
  },
});
const semanticTokens = defineSemanticTokens({
  colors: {
    brand: {
      solid: { value: "colors.brand.500" },  // default brand background
      contrast: { value: "colors.brand.50" },   // text on brand backgrounds
      fg: { value: "colors.brand.700" },  // primary brand text
      muted: { value: "colors.brand.200" },  // secondary brand text / muted UI
      subtle: { value: "colors.brand.100" },  // very faint accents / borders
      emphasized: { value: "colors.brand.600" },  // hover / active states
      focusRing: { value: "colors.brand.300" },  // outlines, focus rings
    },
    accent: {
      solid: { value: "colors.accent.500" },
      contrast: { value: "colors.accent.50" },
      fg: { value: "colors.accent.700" },
      muted: { value: "colors.accent.200" },
      subtle: { value: "colors.accent.100" },
      emphasized: { value: "colors.accent.600" },
      focusRing: { value: "colors.accent.300" },
    },
    warning: {
      solid: { value: "colors.warning.500" },
      contrast: { value: "colors.warning.50" },
      fg: { value: "colors.warning.700" },
      muted: { value: "colors.warning.200" },
      subtle: { value: "colors.warning.100" },
      emphasized: { value: "colors.warning.600" },
      focusRing: { value: "colors.warning.300" },
    },
    success: {
      solid: { value: "colors.success.500" },
      contrast: { value: "colors.success.50" },
      fg: { value: "colors.success.700" },
      muted: { value: "colors.success.200" },
      subtle: { value: "colors.success.100" },
      emphasized: { value: "colors.success.600" },
      focusRing: { value: "colors.success.300" },
    },
  },
});

const config = defineConfig({
  theme: {
    tokens,
    semanticTokens,
    /*styles: {
      global: (props: any) => ({
        
      }),
    },
    components: {
      Button: {
        defaultProps: {
          colorScheme: 'brand',
        },
        variants: {
          solid: {
            bg: 'brand.500',
            color: 'white',
            fontWeight: 'semibold',
            _hover: {
              bg: 'brand.600',
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            },
            _active: {
              transform: 'translateY(0)',
              bg: 'brand.700',
            },
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          ghost: {
            color: 'brand.500',
            _hover: {
              bg: 'brand.50',
              color: 'brand.600',
              transform: 'translateY(-1px)',
            },
            _active: {
              bg: 'brand.100',
            },
            transition: 'all 0.2s',
          },
          danger: {
            bg: 'accent.500',
            color: 'white',
            _hover: {
              bg: 'accent.600',
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            },
            _active: {
              bg: 'accent.700',
            },
          },
        },
      },
      Card: {
        baseStyle: {
          container: {
            bg: 'whiteAlpha.100',
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: 'whiteAlpha.200',
            borderRadius: '2xl',
            boxShadow: 'xl',
            transition: 'all 0.3s ease',
            _hover: {
              borderColor: 'whiteAlpha.300',
              boxShadow: '2xl',
              transform: 'translateY(-4px)',
            },
          },
        },
        variants: {
          message: {
            container: {
              bg: 'linear-gradient(135deg, whiteAlpha.200, whiteAlpha.100)',
              border: '2px solid',
              borderColor: 'brand.200',
              p: 6,
              textAlign: 'center',
              _hover: {
                borderColor: 'brand.300',
                bg: 'linear-gradient(135deg, whiteAlpha.300, whiteAlpha.200)',
              },
            },
          },
          warning: {
            container: {
              bg: 'linear-gradient(135deg, warning.50, warning.100)',
              border: '2px solid',
              borderColor: 'warning.300',
              color: 'warning.800',
            },
          },
        },
      },
      Input: {
        variants: {
          filled: {
            field: {
              bg: 'whiteAlpha.100',
              backdropFilter: 'blur(10px)',
              border: '1px solid',
              borderColor: 'whiteAlpha.300',
              _hover: {
                bg: 'whiteAlpha.200',
                borderColor: 'brand.300',
              },
              _focus: {
                bg: 'whiteAlpha.200',
                borderColor: 'brand.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
              },
            },
          },
        },
      },
      Modal: {
        baseStyle: {
          dialog: {
            bg: 'whiteAlpha.100',
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: 'whiteAlpha.300',
          },
          overlay: {
            bg: 'blackAlpha.600',
            backdropFilter: 'blur(4px)',
          },
        },
      },
      // Custom component for emoji picker
      EmojiPicker: {
        baseStyle: {
          bg: 'whiteAlpha.200',
          backdropFilter: 'blur(20px)',
          border: '1px solid',
          borderColor: 'whiteAlpha.300',
          borderRadius: 'lg',
          maxHeight: '300px',
          overflowY: 'auto',
        },
      },
      // Custom component for link display
      LinkDisplay: {
        baseStyle: {
          bg: 'gray.100',
          border: '2px dashed',
          borderColor: 'brand.300',
          borderRadius: 'md',
          p: 4,
          fontFamily: 'mono',
          fontSize: 'sm',
          wordBreak: 'break-all',
          _dark: {
            bg: 'gray.700',
            borderColor: 'brand.400',
          },
        },
      },
    },*/
  },

  globalCss: {
    body: {
      bg: 'linear-gradient(135deg, gray.900 0%, gray.800 100%)',
      color: 'white',
      minHeight: '100vh',
    },
    // Emoji and GIF containers
    '.emoji-large': {
      fontSize: '4xl',
      lineHeight: '1',
      display: 'inline-block',
    },
    '.gif-container': {
      borderRadius: 'lg',
      overflow: 'hidden',
      maxWidth: '100%',
      height: 'auto',
    },
    // Animation for message destruction countdown
    '.countdown-pulse': {
      animation: 'pulse 1s infinite',
    },
    '@keyframes pulse': {
      '0%, 100': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
  }
});

export const themedSystem = createSystem(defaultConfig, config);
