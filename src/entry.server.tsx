import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import { renderToReadableStream } from "react-dom/server";
import { ServerRouter, type EntryContext } from "react-router";
import { i18nReady } from "./lib/i18n";

const HEAD_CLOSE = "</head>";

const handleRequest = async (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) => {
  await i18nReady;
  const styleCache = createCache();

  const stream = await renderToReadableStream(
    <StyleProvider cache={styleCache}>
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
  responseHeaders.set("Content-Type", "text/html");

  return new Response(html.replace(HEAD_CLOSE, `${extractStyle(styleCache)}${HEAD_CLOSE}`), {
    headers: responseHeaders,
    status: responseStatusCode,
  });
};

export default handleRequest;
