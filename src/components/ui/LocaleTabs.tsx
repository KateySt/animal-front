import type { ReactNode } from "react";
import { Tabs } from "antd";
import { useTranslation } from "react-i18next";
import { Locale, type LocaleType } from "../../lib/locales.ts";

type LocaleTabsProps = {
  renderFields: (locale: LocaleType) => ReactNode;
};

export const LocaleTabs = ({ renderFields }: LocaleTabsProps) => {
  const { t } = useTranslation("common");

  return (
    <Tabs
      items={Object.values(Locale).map((locale) => ({
        key: locale,
        label: t(`locales.${locale}`),
        forceRender: true,
        children: renderFields(locale),
      }))}
    />
  );
};
