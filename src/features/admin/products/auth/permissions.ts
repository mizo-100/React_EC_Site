import type { AdminRole } from "../types/admin";

export const manageProduct = (
  role?: AdminRole,
): boolean => {
  return role === "full" || role === "register";
};

export const manageCategory = (
  role?: AdminRole,
): boolean => {
  return role === "full" || role === "register";
};

export const manageAdmins = (
  role?: AdminRole,
): boolean => {
  return role === "full";
};
