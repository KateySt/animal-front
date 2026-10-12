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
  define: {
    "import.meta.env.VITE_SITE_URL": JSON.stringify(resolveSiteUrl(mode)),
  },
}));
