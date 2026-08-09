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
