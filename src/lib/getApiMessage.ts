import axios from "axios";
import type { ApiErrorResponse } from "./types/getApiMessage";

const DEFAULT_API_ERROR_MESSAGE =
  "処理に失敗しました。入力内容を確認してください。";

export const getApiMessage = (error: unknown) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message ?? DEFAULT_API_ERROR_MESSAGE;
  }

  return "通信に失敗しました。";
};
