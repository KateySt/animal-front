export const ANTD_SSR_STYLE_ID = "antd-ssr";

export const removeAntdSsrStyle = () => {
  document.getElementById(ANTD_SSR_STYLE_ID)?.remove();
};
