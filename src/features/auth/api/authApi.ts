import { axiosInstance } from "../../../lib/axios";
import { clearCsrfToken, refreshCsrfToken, withCsrf } from "../../../lib/csrf";
import type { User } from "../../../types/user";
import type { LoginFormValues } from "../schemas/loginSchema";
import type { SignupFormValues } from "../schemas/signupSchema";


export const userName = async (): Promise<User> => {
  const { data } = await axiosInstance.get<User>("/users/me");

  return data;
};

export const userSignup = async (input: SignupFormValues) => {
  const response = await withCsrf(() =>
    axiosInstance.post("/auth/signup", input),
  );

  return response.data;
};

export const userSignin = async (input: LoginFormValues): Promise<User> => {
  await withCsrf(() => axiosInstance.post("/auth/signin", input));

  await refreshCsrfToken();

  return userName();
};

export const userSignout = async (): Promise<void> => {
  await withCsrf(() => axiosInstance.post("/auth/signout"));

  clearCsrfToken();
};
