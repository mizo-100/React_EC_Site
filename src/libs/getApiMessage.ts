import axios from "axios";

type ApiErrorResponseProps = {
  message?: string;
};

const DEFAULT_API_ERROR_MESSAGE =
  "処理に失敗しました。入力内容を確認してください。";

export const getApiMessage = (error: unknown) => {
  if (axios.isAxiosError<ApiErrorResponseProps>(error)) {
    return error.response?.data?.message ?? DEFAULT_API_ERROR_MESSAGE;
  }

  return "通信に失敗しました。";
};
