import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import { renderToReadableStream } from "react-dom/server";
import { ServerRouter, type EntryContext } from "react-router";
import { i18nReady } from "./lib/i18n";
import { ANTD_SSR_STYLE_ID } from "./lib/antd-ssr";

// antd styles go into one layered <style> at the end of <head>: React hydration tolerates
// trailing nodes there, and the layer keeps CSS modules winning. It only covers the first paint;
// root removes it after hydration and antd injects its own styles as in a client-only render.
const HEAD_CLOSE = "</head>";
const STYLE_TAG = /<style([^>]*)>([\s\S]*?)<\/style>/g;
const CACHE_PATH_ATTR = "data-ant-cssinjs-cache-path";

const toFirstPaintStyle = (styleTags: string) => {
  const css = [...styleTags.matchAll(STYLE_TAG)]
    .filter(([, attributes]) => !attributes.includes(CACHE_PATH_ATTR))
    .map(([, , content]) => content)
    .join("");

  return `<style id="${ANTD_SSR_STYLE_ID}">${css}</style>`;
};

const handleRequest = async (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) => {
  await i18nReady;
  const styleCache = createCache();

  const stream = await renderToReadableStream(
    <StyleProvider cache={styleCache} layer>
      <ServerRouter context={routerContext} url={request.url} />
    </StyleProvider>,
    {
      signal: request.signal,
      onError: (error: unknown) => {
        responseStatusCode = 500;
        console.error(error);
      },
    },
  );
  await stream.allReady;

  const html = await new Response(stream).text();
  const antdStyle = toFirstPaintStyle(extractStyle(styleCache));
  responseHeaders.set("Content-Type", "text/html");

  return new Response(html.replace(HEAD_CLOSE, `${antdStyle}${HEAD_CLOSE}`), {
    headers: responseHeaders,
    status: responseStatusCode,
  });
};

export default handleRequest;
