export type LoginDto = {
  username: string;
  password: string;
};

export type RegisterDto = {
  name: string;
  email: string;
  password: string;
};

export type UserRole = {
  id: string;
  name: string;
  description: string | null;
};

export type User = {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  roles: UserRole[];
};

export type AccessToken = {
  access_token: string;
  token_type: "bearer";
};
