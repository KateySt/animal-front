import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./lib/query-client";
import "./lib/i18n";
import ThemeWrapper from "./wrappers/ThemeWrapper.tsx";

const container = document.getElementById("app");

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Suspense>
        <QueryClientProvider client={queryClient}>
          <ThemeWrapper />
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </Suspense>
    </React.StrictMode>,
  );
}
