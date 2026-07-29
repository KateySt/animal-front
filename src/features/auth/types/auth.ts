export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export type User = {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  roles: [];
};

export type AccessToken = {
  access_token: string;
  token_type: "bearer";
};
