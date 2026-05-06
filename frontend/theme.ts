// FVPrep design tokens — translated from project/colors_and_type.css.
// Light theme is default. Dark values are placeholders for the popover toggle.

export const colors = {
  orange50: "#fff4ec",
  orange100: "#ffe1cb",
  orange200: "#ffc59a",
  orange300: "#ffa166",
  orange400: "#ff7d33",
  orange500: "#f25c1a",
  orange600: "#d44509",
  orange700: "#a83407",

  navy50: "#f4f6fb",
  navy100: "#e6ebf3",
  navy200: "#c6d0e0",
  navy300: "#94a3bf",
  navy400: "#5f7090",
  navy500: "#3d4d6c",
  navy600: "#2a3852",
  navy700: "#1c2740",
  navy800: "#131c33",
  navy900: "#0b1226",

  cream50: "#fbf7f0",
  cream100: "#f6efde",
  cream200: "#ecdfbe",

  green500: "#1f9d6b",
  green100: "#d4f1e3",
  red500: "#d6394a",
  red100: "#fadadf",
  amber500: "#e3a008",
  amber100: "#fcecb6",
  blue500: "#2868d8",

  bgApp: "#fbf7f0",
  bgSurface: "#ffffff",
  fg1: "#0b1226",
  fg2: "#2a3852",
  fg3: "#5f7090",
  fg4: "#94a3bf",
  border1: "#e6ebf3",
  border2: "#c6d0e0",
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  xxl: 28,
  pill: 999,
};

export const space = {
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 20,
  s6: 24,
  s8: 32,
};

export const shadow = {
  s1: {
    shadowColor: "#0b1226",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  s2: {
    shadowColor: "#0b1226",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  s3: {
    shadowColor: "#0b1226",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 12,
  },
  brand: {
    shadowColor: "#f25c1a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 8,
  },
} as const;
