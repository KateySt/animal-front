import { theme } from "antd";
import { presetPalettes } from "@ant-design/colors";

const { purple, magenta } = presetPalettes;

// Purple — primary (70%), Magenta — bright accent (30%)
export const palette = {
  // --- Purple base ---
  primary: purple[5], // #531dab — brand primary
  primaryLight: purple[3], // #d3adf7 — light hover
  primaryDark: purple[7], // #22075e — pressed / dark
  primaryAlpha15: `${purple[5]}26`, // active item bg (dark theme)
  primaryAlpha08: `${purple[5]}14`, // active item bg (light theme)
  primaryAlpha30: `${purple[5]}4D`, // active item border

  // --- Magenta accent (French Magenta) ---
  accent: magenta[5], // #eb2f96 — bright accent
  accentLight: magenta[3], // #ffadd2 — soft hover
  accentDark: magenta[7], // #9e1068 — pressed
  accentAlpha15: `${magenta[5]}26`,
  accentAlpha08: `${magenta[5]}14`,
} as const;

export const styleConfig = {
  defaultTheme: theme.darkAlgorithm,
  stripeTheme: "night" as const,

  // Brand
  colorPrimary: palette.primary,
  colorAccent: palette.accent,
  borderRadius: 6,

  // Layout
  maxAppWidth: 1440,
  maxContentWidth: 1200,

  // Typography
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  fontSizeBase: 14,
  fontSizeSM: 12,
  fontSizeLG: 16,
  fontSizeXL: 20,
  lineHeight: 1.6,

  dark: {
    bg: "#0f0f16",
    bgHeader: "rgba(20, 20, 30, 0.92)",
    bgFooter: "rgba(15, 15, 22, 0.95)",
    textPrimary: "rgba(255,255,255,0.88)",
    textSecondary: "rgba(255,255,255,0.45)",
    textMuted: "rgba(255,255,255,0.2)",
    border: "rgba(255,255,255,0.08)",
    mobileBg: "rgba(20, 20, 30, 0.98)",
  },

  light: {
    bg: "#f5f5f5",
    bgHeader: "rgba(255,255,255,0.92)",
    bgFooter: "rgba(240,240,245,0.98)",
    textPrimary: "rgba(0,0,0,0.88)",
    textSecondary: "rgba(0,0,0,0.55)",
    textMuted: "rgba(0,0,0,0.3)",
    border: "rgba(0,0,0,0.08)",
    mobileBg: "rgba(255,255,255,0.98)",
  },
} as const;
