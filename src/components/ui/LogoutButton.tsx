import { LogoutOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { useLogout } from "../../features/auth/hooks/use-auth.ts";

type LogoutButtonProps = {
  onLogout: () => void;
};

const LogoutButton = ({ onLogout }: LogoutButtonProps) => {
  const { t } = useTranslation("common");

  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    onLogout();
    logout();
  };

  return (
    <Button
      type="text"
      icon={<LogoutOutlined />}
      onClick={handleLogout}
      danger
      title={t("nav.logout")}
    />
  );
};

export default LogoutButton;
