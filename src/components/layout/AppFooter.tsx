import { Link } from "react-router";
import { Col, Divider, Layout, Row, Space, Typography } from "antd";
import {
  GithubOutlined,
  HeartOutlined,
  InstagramOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Routes } from "../../router/routes";
import { styleConfig } from "../../style.config.ts";
import { useThemeStore } from "../../store/theme.store.ts";

const { Footer } = Layout;
const { Text, Title } = Typography;

export const AppFooter = () => {
  const { t } = useTranslation("common");
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? styleConfig.dark : styleConfig.light;

  const footerSections = [
    {
      title: t("footer.sections.navigation"),
      links: [
        { label: t("footer.links.home"), to: Routes.Home },
        { label: t("footer.links.animals"), to: Routes.Animals },
        { label: t("footer.links.profile"), to: Routes.Profile },
      ],
    },
    {
      title: t("footer.sections.account"),
      links: [{ label: t("footer.links.settings"), to: Routes.Settings }],
    },
    {
      title: t("footer.sections.support"),
      links: [
        { label: t("footer.links.helpCenter"), to: "#" },
        { label: t("footer.links.privacyPolicy"), to: "#" },
        { label: t("footer.links.termsOfService"), to: "#" },
      ],
    },
  ];

  return (
    <Footer
      style={{
        background: colors.bgFooter,
        borderTop: `1px solid ${colors.border}`,
        padding: "40px 48px 24px",
      }}
    >
      <Row gutter={[48, 32]}>
        <Col xs={24} sm={24} md={8}>
          <Space orientation="vertical" size={12}>
            <Space align="center">
              <HeartOutlined style={{ fontSize: 20, color: styleConfig.colorPrimary }} />
              <Title level={4} style={{ margin: 0, color: colors.textPrimary }}>
                AnimalCare
              </Title>
            </Space>
            <Text
              style={{
                maxWidth: 240,
                display: "block",
                lineHeight: 1.6,
                color: colors.textSecondary,
              }}
            >
              {t("footer.description")}
            </Text>
            <Space size={16} style={{ marginTop: 8 }}>
              <GithubOutlined
                style={{ fontSize: 18, color: colors.textSecondary, cursor: "pointer" }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = styleConfig.colorPrimary)
                }
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = colors.textSecondary)}
              />
              <LinkedinOutlined
                style={{ fontSize: 18, color: colors.textSecondary, cursor: "pointer" }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = styleConfig.colorPrimary)
                }
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = colors.textSecondary)}
              />
              <InstagramOutlined
                style={{ fontSize: 18, color: colors.textSecondary, cursor: "pointer" }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = styleConfig.colorPrimary)
                }
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = colors.textSecondary)}
              />
            </Space>
          </Space>
        </Col>

        {footerSections.map((section) => (
          <Col xs={12} sm={8} md={16 / footerSections.length} key={section.title}>
            <Space orientation="vertical" size={10}>
              <Text
                strong
                style={{
                  fontSize: styleConfig.fontSizeSM,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: colors.textPrimary,
                }}
              >
                {section.title}
              </Text>
              {section.links.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  style={{
                    color: colors.textSecondary,
                    display: "block",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = styleConfig.colorPrimary)
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = colors.textSecondary)
                  }
                >
                  {link.label}
                </Link>
              ))}
            </Space>
          </Col>
        ))}
      </Row>

      <Divider style={{ borderColor: colors.border, margin: "32px 0 20px" }} />

      <Row justify="space-between" align="middle">
        <Col>
          <Text style={{ fontSize: styleConfig.fontSizeSM, color: colors.textSecondary }}>
            © {new Date().getFullYear()} AnimalCare. {t("footer.copyright")}
          </Text>
        </Col>
        <Col>
          <Text style={{ fontSize: styleConfig.fontSizeSM, color: colors.textSecondary }}>
            {t("footer.madeWith")} <HeartOutlined style={{ color: styleConfig.colorPrimary }} />{" "}
            {t("footer.forAnimals")}
          </Text>
        </Col>
      </Row>
    </Footer>
  );
};
