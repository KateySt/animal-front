import { type RouteConfig, route, index, layout } from "@react-router/dev/routes";

export const Routes = {
  Home: "/",
  Animals: "/animals",
  AnimalDetail: "/animals/:animalId",
  Profile: "/profile",
  Settings: "/settings",
  Payment: "/payment",
  Invoices: "/invoices",
  Login: "/login",
  Register: "/register",
  GoogleCallback: "/auth/google/callback",
  Chat: "/chat",
  ChatSession: "/chat/:sessionId",
} as const;

const rel = (path: string) => path.slice(1);

export default [
  route(rel(Routes.Login), "./pages/LoginPage.tsx"),
  route(rel(Routes.Register), "./pages/RegisterPage.tsx"),
  route(rel(Routes.GoogleCallback), "./pages/GoogleCallbackPage.tsx"),

  layout("./wrappers/AuthWrapper.tsx", [
    layout("./components/layout/MainLayout.tsx", [
      index("./pages/HomePage.tsx"),
      route(rel(Routes.Animals), "./pages/AnimalsPage.tsx"),
      route(rel(Routes.AnimalDetail), "./pages/AnimalDetailPage.tsx"),
      route(rel(Routes.Profile), "./pages/ProfilePage.tsx"),
      layout("./wrappers/AdminWrapper.tsx", [
        route(rel(Routes.Settings), "./pages/SettingsPage.tsx"),
      ]),
      route(`${rel(Routes.Payment)}/:invoiceId`, "./pages/PaymentPage.tsx"),
      route(rel(Routes.Invoices), "./pages/InvoicesPage.tsx"),
      route(rel(Routes.Chat), "./pages/EmptyChatPage.tsx"),
      route(rel(Routes.ChatSession), "./pages/ChatPage.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
