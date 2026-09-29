import { axiosInstance } from "../../../../libs/axios";
import { clearCsrfToken, refreshCsrfToken, withCsrf } from "../../../../libs/csrf";
import type { User } from "../../../../types/user";
import type { LoginFormValues } from "../../../auth/schemas/loginSchema";
import type { Admin } from "../../admins/api/adminAdminsApi";

export const adminName = async (): Promise<Admin> => {
  const { data } = await axiosInstance.get<Admin>("/admin/admins/me");
  return data;
};

export const adminSignin = async (input: LoginFormValues): Promise<User> => {
  await withCsrf(() => axiosInstance.post("/admin/auth/signin", input));

  await refreshCsrfToken();

  return adminName();
};

export const adminSignout = async (): Promise<void> => {
  await withCsrf(() => axiosInstance.post("/admin/auth/signout"));

  clearCsrfToken();
};
