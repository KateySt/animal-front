import { SeoRoutes } from "../routes";
import { absoluteUrl, PRIVATE_PATH_PREFIXES } from "./site";

export const loader = () => {
  const disallowed = PRIVATE_PATH_PREFIXES.map((prefix) => `Disallow: ${prefix}`);
  const body = [
    "User-agent: *",
    "Allow: /",
    ...disallowed,
    "",
    `Sitemap: ${absoluteUrl(SeoRoutes.Sitemap)}`,
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
