import { type ReactNode, useEffect } from "react";
import { ConfigProvider, theme as antTheme } from "antd";
import { useThemeStore } from "../store/theme.store";
import { palette, styleConfig } from "../style.config.ts";

type ThemeWrapperProps = {
  children: ReactNode;
};

const ThemeWrapper = ({ children }: ThemeWrapperProps) => {
  const isDark = useThemeStore((state) => state.isDark);
  const colors = isDark ? styleConfig.dark : styleConfig.light;

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
  }, [isDark, colors.bg, colors.textPrimary]);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: palette.primary,
          colorLink: palette.accent,
          colorLinkHover: palette.accentLight,
          colorLinkActive: palette.accentDark,
          colorError: palette.accent,
          colorErrorHover: palette.accentLight,
          borderRadius: styleConfig.borderRadius,
          fontFamily: styleConfig.fontFamily,
          fontSize: styleConfig.fontSizeBase,
          lineHeight: styleConfig.lineHeight,
          colorText: colors.textPrimary,
          colorTextSecondary: colors.textSecondary,
          colorBgBase: colors.bg,
        },
        components: {
          Button: {
            colorPrimaryHover: palette.accentLight,
            defaultActiveBorderColor: palette.accent,
          },
          Tag: {
            colorPrimary: palette.primary,
          },
          Slider: {
            colorPrimaryBorder: palette.accentLight,
            colorPrimaryBorderHover: palette.accent,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ThemeWrapper;
