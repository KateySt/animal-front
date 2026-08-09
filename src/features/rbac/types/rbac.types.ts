export type Resource = {
  id: string;
  name: string;
  description: string | null;
};

export type Permission = {
  id: string;
  resource_id: string;
  action: string;
  scope: string;
};

export type Role = {
  id: string;
  name: string;
  description: string | null;
};

export type RoleDetail = Role & {
  permissions: Permission[];
};

export type ListResponse<T> = {
  data: T[];
};

export type ResourceCreateDto = {
  name: string;
  description?: string | null;
};

export type ResourceUpdateDto = {
  description?: string | null;
};

export type PermissionCreateDto = {
  resource_id: string;
  action: string;
};

export type RoleCreateDto = {
  name: string;
  description?: string | null;
};

export type RoleUpdateDto = {
  name?: string | null;
  description?: string | null;
};
