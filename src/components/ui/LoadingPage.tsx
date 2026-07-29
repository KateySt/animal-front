import { Flex, Spin } from "antd";

export const LoadingPage = () => {
  return (
    <Flex justify="center" align="center" style={{ minHeight: "100vh", width: "100%" }}>
      <Spin size="large">
        <div style={{ padding: 48 }} />
      </Spin>
    </Flex>
  );
};
