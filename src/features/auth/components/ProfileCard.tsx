import { useState } from "react";
import { Avatar, Button, Card, Descriptions, Empty, Flex, Tag, Typography } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../store/auth.store.ts";
import { AvatarUploadModal } from "./AvatarUploadModal.tsx";

const { Title, Text } = Typography;

export const ProfileCard = () => {
  const { t } = useTranslation("common");
  const user = useAuthStore((state) => state.user);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  if (!user) {
    return <Empty description={t("profile.empty")} />;
  }

  const booleanTag = (value: boolean, yes: string, no: string) => (
    <Tag
      color={value ? "success" : "error"}
      icon={value ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
    >
      {value ? yes : no}
    </Tag>
  );

  return (
    <Card>
      <Flex align="center" gap={16} style={{ marginBottom: 24 }}>
        <div style={{ position: "relative", width: 64, height: 64 }}>
          <Avatar size={64} src={user.avatar_url ?? undefined} icon={<UserOutlined />} />
          <Button
            type="primary"
            shape="circle"
            size="small"
            icon={<EditOutlined />}
            aria-label={t("profile.avatar.edit")}
            onClick={() => setIsAvatarModalOpen(true)}
            style={{ position: "absolute", bottom: -4, right: -4 }}
          />
        </div>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            {user.email}
          </Title>
          <Text type="secondary">{user.is_superuser ? t("profile.admin") : t("profile.user")}</Text>
        </div>
      </Flex>

      <Descriptions
        column={1}
        bordered
        size="small"
        items={[
          { key: "email", label: t("profile.email"), children: user.email },
          {
            key: "status",
            label: t("profile.status"),
            children: booleanTag(user.is_active, t("profile.active"), t("profile.inactive")),
          },
          {
            key: "verified",
            label: t("profile.verified"),
            children: booleanTag(
              user.is_verified,
              t("profile.verifiedYes"),
              t("profile.verifiedNo"),
            ),
          },
          {
            key: "role",
            label: t("profile.role"),
            children: user.is_superuser ? t("profile.admin") : t("profile.user"),
          },
        ]}
      />

      <AvatarUploadModal open={isAvatarModalOpen} onClose={() => setIsAvatarModalOpen(false)} />
    </Card>
  );
};
