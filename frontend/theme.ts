/**
 * Strict monochrome design tokens (black, white, grayscale only).
 * Use `getPalette(scheme)` with `ThemeProvider` / `useTheme()` from `./context/ThemeContext`.
 */

export type ThemeScheme = "light" | "dark";

export type ThemePalette = {
  bgApp: string;
  bgSurface: string;
  bgMuted: string;
  bgSubtle: string;
  fg1: string;
  fg2: string;
  fg3: string;
  fgOnInverse: string;
  fgOnInverseMuted: string;
  border1: string;
  border2: string;
  heroBg: string;
  heroControlBg: string;
  heroHairline: string;
  logoBg: string;
  logoFg: string;
  tabBarBg: string;
  tabBarBorder: string;
  tabActive: string;
  tabInactive: string;
  chipLiveBg: string;
  chipLiveFg: string;
  chipFinalBg: string;
  chipFinalFg: string;
  chipUpcomingBg: string;
  chipUpcomingFg: string;
  toggleTrackOff: string;
  toggleTrackOn: string;
  toggleKnob: string;
  shadow: string;
  scrim: string;
  primaryButtonBg: string;
  primaryButtonFg: string;
  secondaryButtonBg: string;
  secondaryButtonBorder: string;
  secondaryButtonFg: string;
  trendStrong: string;
  trendSoft: string;
};

export function getPalette(scheme: ThemeScheme): ThemePalette {
  if (scheme === "light") {
    return {
      bgApp: "#f0f0f0",
      bgSurface: "#ffffff",
      bgMuted: "#e8e8e8",
      bgSubtle: "#ebebeb",
      fg1: "#000000",
      fg2: "#333333",
      fg3: "#737373",
      fgOnInverse: "#ffffff",
      fgOnInverseMuted: "#a3a3a3",
      border1: "#d4d4d4",
      border2: "#a3a3a3",
      heroBg: "#000000",
      heroControlBg: "rgba(255,255,255,0.16)",
      heroHairline: "rgba(255,255,255,0.22)",
      logoBg: "#d4d4d4",
      logoFg: "#000000",
      tabBarBg: "#fafafa",
      tabBarBorder: "#d4d4d4",
      tabActive: "#000000",
      tabInactive: "#737373",
      chipLiveBg: "#000000",
      chipLiveFg: "#ffffff",
      chipFinalBg: "#404040",
      chipFinalFg: "#ffffff",
      chipUpcomingBg: "#d4d4d4",
      chipUpcomingFg: "#000000",
      toggleTrackOff: "#a3a3a3",
      toggleTrackOn: "#000000",
      toggleKnob: "#ffffff",
      shadow: "#000000",
      scrim: "rgba(0,0,0,0.45)",
      primaryButtonBg: "#000000",
      primaryButtonFg: "#ffffff",
      secondaryButtonBg: "#ffffff",
      secondaryButtonBorder: "#d4d4d4",
      secondaryButtonFg: "#000000",
      trendStrong: "#000000",
      trendSoft: "#737373",
    };
  }

  return {
    bgApp: "#0a0a0a",
    bgSurface: "#141414",
    bgMuted: "#1f1f1f",
    bgSubtle: "#1a1a1a",
    fg1: "#fafafa",
    fg2: "#d4d4d4",
    fg3: "#a3a3a3",
    fgOnInverse: "#fafafa",
    fgOnInverseMuted: "#a3a3a3",
    border1: "#2a2a2a",
    border2: "#404040",
    heroBg: "#000000",
    heroControlBg: "rgba(255,255,255,0.12)",
    heroHairline: "rgba(255,255,255,0.22)",
    logoBg: "#2a2a2a",
    logoFg: "#fafafa",
    tabBarBg: "#0d0d0d",
    tabBarBorder: "#2a2a2a",
    tabActive: "#ffffff",
    tabInactive: "#737373",
    chipLiveBg: "#ffffff",
    chipLiveFg: "#000000",
    chipFinalBg: "#737373",
    chipFinalFg: "#000000",
    chipUpcomingBg: "#404040",
    chipUpcomingFg: "#fafafa",
    toggleTrackOff: "#525252",
    toggleTrackOn: "#ffffff",
    toggleKnob: "#000000",
    shadow: "#000000",
    scrim: "rgba(0,0,0,0.65)",
    primaryButtonBg: "#fafafa",
    primaryButtonFg: "#000000",
    secondaryButtonBg: "#1a1a1a",
    secondaryButtonBorder: "#404040",
    secondaryButtonFg: "#fafafa",
    trendStrong: "#fafafa",
    trendSoft: "#737373",
  };
}

export function shadowsFor(c: ThemePalette) {
  return {
    s1: {
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.12,
      shadowRadius: 2,
      elevation: 1,
    },
    s2: {
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.14,
      shadowRadius: 12,
      elevation: 3,
    },
    s3: {
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.2,
      shadowRadius: 28,
      elevation: 12,
    },
  } as const;
}

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  xxl: 28,
  pill: 999,
} as const;

export const space = {
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 20,
  s6: 24,
  s8: 32,
} as const;
