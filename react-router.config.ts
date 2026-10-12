import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  ssr: false,
  prerender: ["/", "/login", "/register", "/robots.txt", "/sitemap.xml", "/llms.txt"],
} satisfies Config;
