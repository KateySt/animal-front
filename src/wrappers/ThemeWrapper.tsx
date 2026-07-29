import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { ConfigProvider, theme as antTheme } from "antd";
import { useThemeStore } from "../store/theme.store";
import { styleConfig } from "../style.config.ts";
import AppInitializer from "./AppInitializer.tsx";
import { router } from "../router";

const ThemeWrapper = () => {
  const isDark = useThemeStore((state) => state.isDark);
  const colors = isDark ? styleConfig.dark : styleConfig.light;

  useEffect(() => {
    document.body.style.background = colors.bg;
    document.body.style.color = colors.textPrimary;
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.background = colors.bg;
    const app = document.getElementById("app");
    if (app) {
      app.style.background = colors.bg;
      app.style.minHeight = "100vh";
    }
  }, [isDark, colors.bg, colors.textPrimary]);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: styleConfig.colorPrimary,
          borderRadius: styleConfig.borderRadius,
          fontFamily: styleConfig.fontFamily,
          fontSize: styleConfig.fontSizeBase,
          lineHeight: styleConfig.lineHeight,
          colorText: colors.textPrimary,
          colorTextSecondary: colors.textSecondary,
          colorBgBase: colors.bg,
        },
      }}
    >
      <AppInitializer>
        <RouterProvider router={router} />
      </AppInitializer>
    </ConfigProvider>
  );
};

export default ThemeWrapper;
