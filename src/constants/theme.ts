export const COLORS = {
  PRIMARY: {
    DEFAULT: 'indigo-600',
    HOVER: 'indigo-700',
    FOCUS: 'indigo-500',
    LIGHT: 'indigo-100',
    TEXT: 'indigo-600',
  },
  SECONDARY: {
    DEFAULT: 'gray-600',
    HOVER: 'gray-700',
    FOCUS: 'gray-500',
    LIGHT: 'gray-100',
    TEXT: 'gray-700',
  },
  DANGER: {
    DEFAULT: 'red-600',
    HOVER: 'red-700',
    FOCUS: 'red-500',
    LIGHT: 'red-100',
    TEXT: 'red-700',
  },
  SUCCESS: {
    DEFAULT: 'green-600',
    HOVER: 'green-700',
    FOCUS: 'green-500',
    LIGHT: 'green-100',
    TEXT: 'green-800',
  },
  WARNING: {
    DEFAULT: 'yellow-600',
    HOVER: 'yellow-700',
    FOCUS: 'yellow-500',
    LIGHT: 'yellow-100',
    TEXT: 'yellow-800',
  },
} as const;

export const SPACING = {
  CONTAINER: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  SECTION: 'py-8',
  CARD: 'p-6',
} as const;

export const SHADOWS = {
  SM: 'shadow-sm',
  DEFAULT: 'shadow',
  LG: 'shadow-lg',
} as const;

export const BORDERS = {
  DEFAULT: 'border border-gray-200',
  ROUNDED: 'rounded-xl',
  ROUNDED_LG: 'rounded-lg',
} as const;
