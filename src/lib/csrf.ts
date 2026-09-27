import { axiosInstance } from "./axios";
import type { CsrfResponse } from "./types/csrf";

let csrfToken: CsrfResponse | null = null;

export const refreshCsrfToken = async (): Promise<CsrfResponse> => {
  const { data } = await axiosInstance.get<CsrfResponse>("/csrf");

  csrfToken = data;

  return data;
};

export const clearCsrfToken = (): void => {
  csrfToken = null;
};

export const withCsrf = async <T>(
  request: () => Promise<T>,
): Promise<T> => {
  const csrf = csrfToken ?? (await refreshCsrfToken());

  axiosInstance.defaults.headers.common[csrf.headerName] = csrf.token;

  return request();
};
