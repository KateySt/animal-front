import { Link } from "react-router";
import { Col, Divider, Layout, Row, Space, Typography } from "antd";
import {
  GithubOutlined,
  HeartOutlined,
  InstagramOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import styles from "./AppFooter.module.scss";
import { FOOTER_SECTIONS, GITHUB_LINK, LINKEDIN_LINK } from "../../constants/footer.ts";

const { Footer } = Layout;
const { Text, Title } = Typography;

export const AppFooter = () => {
  const { t } = useTranslation("common");

  return (
    <Footer className={styles.footer}>
      <Row gutter={[48, 32]}>
        <Col xs={24} sm={24} md={8}>
          <Space orientation="vertical" size={12}>
            <Space align="center">
              <HeartOutlined className={styles.brandIcon} />
              <Title level={4} className={styles.brandTitle}>
                {import.meta.env.APP_NAME}
              </Title>
            </Space>
            <Text className={styles.brandDesc}>{t("footer.description")}</Text>
            <Space size={16} className={styles.socialIcons}>
              <GithubOutlined
                className={styles.socialIcon}
                onClick={() => window.open(GITHUB_LINK, "_blank")}
              />
              <LinkedinOutlined
                className={styles.socialIcon}
                onClick={() => window.open(LINKEDIN_LINK, "_blank")}
              />
              <InstagramOutlined className={styles.socialIcon} />
            </Space>
          </Space>
        </Col>

        {FOOTER_SECTIONS.map((section) => (
          <Col xs={12} sm={8} md={16 / FOOTER_SECTIONS.length} key={section.title}>
            <Space orientation="vertical" size={10}>
              <Text strong className={styles.sectionTitle}>
                {t(section.title)}
              </Text>
              {section.links.map((link) => (
                <Link key={link.label} to={link.to} className={styles.navLink}>
                  {t(link.label)}
                </Link>
              ))}
            </Space>
          </Col>
        ))}
      </Row>

      <Divider className={styles.divider} />

      <Row justify="space-between" align="middle">
        <Col>
          <Text className={styles.copyright}>
            © {new Date().getFullYear()} {import.meta.env.APP_NAME}. {t("footer.copyright")}
          </Text>
        </Col>
        <Col>
          <Text className={styles.madeWith}>
            {t("footer.madeWith")} <HeartOutlined className={styles.heartIcon} />{" "}
            {t("footer.forAnimals")}
          </Text>
        </Col>
      </Row>
    </Footer>
  );
};
