import { reactRouter } from "@react-router/dev/vite";
import { defineConfig, loadEnv } from "vite";

const LOCAL_SITE_URL = "http://localhost:5173";

const resolveSiteUrl = (mode: string) => {
  const { VITE_SITE_URL } = loadEnv(mode, process.cwd(), "VITE_");
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const siteUrl = VITE_SITE_URL || (vercelUrl ? `https://${vercelUrl}` : LOCAL_SITE_URL);
  return siteUrl.replace(/\/$/, "");
};

export default defineConfig(({ mode }) => ({
  plugins: [reactRouter()],
  resolve: {
    alias: [{ find: /^@ant-design\/icons-svg\/lib\//, replacement: "@ant-design/icons-svg/es/" }],
  },
  ssr: {
    noExternal: ["@ant-design/icons", "@ant-design/icons-svg"],
  },
  define: {
    "import.meta.env.VITE_SITE_URL": JSON.stringify(resolveSiteUrl(mode)),
  },
}));
