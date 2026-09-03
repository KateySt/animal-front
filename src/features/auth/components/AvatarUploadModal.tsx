import { useEffect, useState } from "react";
import { Avatar, Button, Flex, Modal, Upload, message } from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../store/auth.store.ts";
import { useRemoveAvatar, useUploadAvatar } from "../hooks/use-auth.ts";

const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;

type AvatarUploadModalProps = {
  open: boolean;
  onClose: () => void;
};

export const AvatarUploadModal = ({ open, onClose }: AvatarUploadModalProps) => {
  const { t } = useTranslation("common");
  const user = useAuthStore((state) => state.user);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar();
  const { mutate: removeAvatar, isPending: isRemoving } = useRemoveAvatar();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  const beforeUpload = (file: File) => {
    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      message.error(t("profile.avatar.invalidType"));
      return Upload.LIST_IGNORE;
    }
    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      message.error(t("profile.avatar.tooLarge"));
      return Upload.LIST_IGNORE;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    return false;
  };

  const handleSave = () => {
    if (!selectedFile) return;
    uploadAvatar(selectedFile, { onSuccess: handleClose });

  };

  const handleRemove = () => {
    removeAvatar(undefined, { onSuccess: handleClose });
  };

  return (
    <Modal
      open={open}
      title={t("profile.avatar.title")}
      onCancel={handleClose}
      footer={[
        user?.avatar_url && !selectedFile && (
          <Button key="remove" danger loading={isRemoving} onClick={handleRemove}>
            {t("profile.avatar.remove")}
          </Button>
        ),
        <Button key="cancel" onClick={handleClose}>
          {t("profile.avatar.cancel")}
        </Button>,
        <Button
          key="save"
          type="primary"
          disabled={!selectedFile}
          loading={isUploading}
          onClick={handleSave}
        >
          {t("profile.avatar.save")}
        </Button>,
      ]}
    >
      <Flex vertical align="center" gap={16}>
        <Avatar
          size={120}
          src={previewUrl ?? user?.avatar_url ?? undefined}
          icon={<UserOutlined />}
        />
        <Upload
          accept="image/jpeg,image/png,image/webp"
          maxCount={1}
          showUploadList={false}
          beforeUpload={beforeUpload}
        >
          <Button icon={<PlusOutlined />}>{t("profile.avatar.choose")}</Button>
        </Upload>
      </Flex>
    </Modal>
  );
};
