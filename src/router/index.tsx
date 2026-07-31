import { createBrowserRouter } from "react-router";
import { Routes } from "./routes";
import AuthWrapper from "../wrappers/AuthWrapper.tsx";
import { MainLayout } from "../components/layout/MainLayout.tsx";

export const router = createBrowserRouter([
  {
    path: Routes.Login,
    lazy: () => import("../pages/LoginPage").then((m) => ({ Component: m.LoginPage })),
  },
  {
    path: Routes.Register,
    lazy: () => import("../pages/RegisterPage").then((m) => ({ Component: m.RegisterPage })),
  },
  {
    path: Routes.GoogleCallback,
    lazy: () =>
      import("../pages/GoogleCallbackPage").then((m) => ({ Component: m.GoogleCallbackPage })),
  },
  {
    element: <AuthWrapper />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: Routes.Home,
            lazy: () => import("../pages/AnimalsPage").then((m) => ({ Component: m.AnimalsPage })),
          },
          {
            path: Routes.Animals,
            lazy: () => import("../pages/AnimalsPage").then((m) => ({ Component: m.AnimalsPage })),
          },
          {
            path: Routes.Profile,
            lazy: () => import("../pages/ProfilePage").then((m) => ({ Component: m.ProfilePage })),
          },
          {
            path: Routes.Settings,
            lazy: () =>
              import("../pages/SettingsPage").then((m) => ({ Component: m.SettingsPage })),
          },
          {
            path: Routes.Payment + "/:invoiceId",
            lazy: () => import("../pages/PaymentPage").then((m) => ({ Component: m.PaymentPage })),
          },
          {
            path: Routes.Chat,
            lazy: () =>
              import("../pages/EmptyChatPage").then((m) => ({ Component: m.EmptyChatPage })),
          },
          {
            path: Routes.ChatSession,
            lazy: () => import("../pages/ChatPage").then((m) => ({ Component: m.ChatPage })),
          },
        ],
      },
    ],
  },
]);
