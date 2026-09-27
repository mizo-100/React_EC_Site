import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "名前を入力してください。"),
  email: z
    .string()
    .min(1, "メールアドレスを入力してください。")
    .email("メールアドレスの形式が正しくありません。"),
  password: z
    .string()
    .min(1, "パスワードを入力してください。"),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
