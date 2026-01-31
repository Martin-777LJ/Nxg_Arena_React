/**
 * NexGen Arena Design System & Theme Configuration
 * Centralized styling constants for consistency across all components
 */

// Color Palette
export const colors = {
  // Primary
  primary: '#a855f7', // violet-600
  primaryLight: '#c4b5fd', // violet-300
  primaryDark: '#7c3aed', // violet-600
  primaryBg: '#f5f3ff', // violet-50

  // Secondary
  secondary: '#06b6d4', // cyan-500
  secondaryLight: '#67e8f9', // cyan-300
  secondaryDark: '#0891b2', // cyan-600

  // Neutrals
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712', // #050505 custom dark
  },

  // Semantic Colors
  success: '#10b981', // emerald-500
  warning: '#f59e0b', // amber-500
  error: '#ef4444', // red-500
  info: '#3b82f6', // blue-500

  // Custom NXG Dark Background
  nxgDark: '#050505',
  nxgDarkCard: '#0f0f0f',
  nxgDarkBorder: 'rgba(255, 255, 255, 0.05)',
};

// Border Radius Scale
export const borderRadius = {
  none: '0',
  sm: '0.375rem', // 6px
  base: '0.5rem', // 8px
  md: '0.75rem', // 12px
  lg: '1rem', // 16px
  xl: '1.5rem', // 24px
  '2xl': '2rem', // 32px
  '3xl': '2.5rem', // 40px
  '4xl': '3.5rem', // 56px
  full: '9999px',
};

// Spacing Scale (px)
export const spacing = {
  0: '0px',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  32: '8rem', // 128px
};

// Font Weights
export const fontWeights = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

// Typography
export const typography = {
  fontFamily: {
    sans: "'Rajdhani', system-ui, sans-serif",
    mono: "'Courier New', monospace",
  },
  fontSize: {
    xs: { size: '0.75rem', height: '1rem' }, // 12px
    sm: { size: '0.875rem', height: '1.25rem' }, // 14px
    base: { size: '1rem', height: '1.5rem' }, // 16px
    lg: { size: '1.125rem', height: '1.75rem' }, // 18px
    xl: { size: '1.25rem', height: '1.75rem' }, // 20px
    '2xl': { size: '1.5rem', height: '2rem' }, // 24px
    '3xl': { size: '1.875rem', height: '2.25rem' }, // 30px
    '4xl': { size: '2.25rem', height: '2.5rem' }, // 36px
    '5xl': { size: '3rem', height: '1' }, // 48px
    '6xl': { size: '3.75rem', height: '1' }, // 60px
    '7xl': { size: '4.5rem', height: '1' }, // 72px
  },
};

// Shadows
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  glow: '0 0 20px rgba(168, 85, 247, 0.4)',
  glowSm: '0 0 10px rgba(168, 85, 247, 0.2)',
};

// Common Button Styles
export const buttonStyles = {
  base: 'font-bold uppercase tracking-widest transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
  primary: 'bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800',
  secondary: 'bg-slate-800 text-white hover:bg-slate-700 active:bg-slate-600',
  ghost: 'bg-transparent text-white hover:bg-slate-800/50 border border-white/10',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800',
};

// Common Card Styles
export const cardStyles = {
  base: 'rounded-3xl border border-white/5 bg-slate-900 shadow-lg',
  dark: 'rounded-3xl border border-white/5 bg-slate-950/40 shadow-lg',
  interactive: 'rounded-3xl border border-white/5 bg-slate-900 hover:bg-slate-800/50 transition-all duration-200 cursor-pointer',
};

// Component Presets
export const components = {
  modal: {
    overlay: 'fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-2xl',
    content: 'relative bg-slate-900 border border-white/10 w-full max-w-lg rounded-[4rem] overflow-hidden shadow-2xl',
  },
  card: {
    default: `rounded-[2.8rem] border border-white/5 bg-slate-900 p-6 transition-all duration-200`,
    hover: `rounded-[2.8rem] border border-white/5 bg-slate-900 p-6 hover:bg-slate-800/50 transition-all duration-200 cursor-pointer`,
    dark: `rounded-[2.8rem] border border-white/5 bg-slate-950/40 p-6 transition-all duration-200`,
  },
  input: {
    base: 'w-full bg-slate-950 border-2 border-white/5 rounded-[2.8rem] py-3 px-6 text-white font-bold outline-none focus:border-violet-600 transition-all placeholder:text-slate-700',
  },
};

// Z-Index Scale
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  offcanvas: 1050,
  modal: 1060,
  popover: 1070,
  tooltip: 1080,
};

// Animations/Transitions
export const animations = {
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    ease: 'ease',
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

export default {
  colors,
  borderRadius,
  spacing,
  fontWeights,
  typography,
  shadows,
  buttonStyles,
  cardStyles,
  components,
  zIndex,
  animations,
};
