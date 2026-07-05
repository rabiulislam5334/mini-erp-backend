export const USER_ROLE = {
  ADMIN: "admin",
  MANAGER: "manager",
  EMPLOYEE: "employee",
} as const;

export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const USER_ROLES_ARRAY = Object.values(USER_ROLE);
