import { absoluteUrl, PUBLIC_PAGES } from "./site";

export const loader = () => {
  const urls = PUBLIC_PAGES.map((path) => `  <url><loc>${absoluteUrl(path)}</loc></url>`);
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
