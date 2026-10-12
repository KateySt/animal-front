import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Switch } from "antd";
import { useThemeStore } from "../../store/theme.store.ts";

export const ThemeSwitch = () => {
  const { isDark, toggleTheme } = useThemeStore();
  return (
    <Switch
      checked={isDark}
      onChange={toggleTheme}
      checkedChildren={<MoonOutlined />}
      unCheckedChildren={<SunOutlined />}
    />
  );
};
