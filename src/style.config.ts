import { theme } from "antd";

export const styleConfig = {
  defaultTheme: theme.darkAlgorithm,
  stripeTheme: "night" as const,

  // Brand
  colorPrimary: "#b905c7",
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

  // Text colors (dark theme)
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

  // Text colors (light theme)
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
