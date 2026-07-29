import { Button, Dropdown, type MenuProps, Space } from "antd";
import { Locale } from "../../lib/locales.ts";
import i18n from "../../lib/i18n.ts";
import { styleConfig } from "../../style.config.ts";
import { useThemeStore } from "../../store/theme.store.ts";
import {
  LOCALE_FLAGS,
  LOCALE_LABELS,
  useLocaleFlag,
} from "../../features/stripe/hooks/use-locale-flag.ts";

const LanguageDropdown = () => {
  const { isDark } = useThemeStore();
  const colors = isDark ? styleConfig.dark : styleConfig.light;

  const { currentLocale } = useLocaleFlag();

  const localeMenuItems: MenuProps["items"] = Object.values(Locale).map((locale) => ({
    key: locale,
    label: (
      <Space size={6}>
        <span>{LOCALE_FLAGS[locale]}</span>
        <span>{LOCALE_LABELS[locale]}</span>
      </Space>
    ),
    onClick: () => i18n.changeLanguage(locale),
  }));

  return (
    <Dropdown
      menu={{ items: localeMenuItems, selectedKeys: [currentLocale] }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <Button
        type="text"
        size="small"
        style={{ padding: "0 4px", fontWeight: 500, color: colors.textPrimary }}
      >
        <Space size={3}>
          <span>{LOCALE_FLAGS[currentLocale]}</span>
          <span>{LOCALE_LABELS[currentLocale]}</span>
        </Space>
      </Button>
    </Dropdown>
  );
};

export default LanguageDropdown;
