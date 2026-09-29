import { axiosInstance } from "./axios";

type CsrfResponseProps = {
  headerName: string;
  token: string;
};

let csrfToken: CsrfResponseProps | null = null;

export const refreshCsrfToken = async (): Promise<CsrfResponseProps> => {
  const { data } = await axiosInstance.get<CsrfResponseProps>("/csrf");

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
