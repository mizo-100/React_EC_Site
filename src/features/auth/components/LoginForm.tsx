import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { LoginFormValues } from "../schemas/loginSchema";

type LoginFormProps = {
  register: UseFormRegister<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  isSubmitting: boolean;
  submitLabel: string;
  rootError?: string;
};

export const LoginForm = ({
  register,
  errors,
  isSubmitting,
  submitLabel,
  rootError,
}: LoginFormProps) => {
  return (
    <>
      <div>
        <label htmlFor="email" className="block">
          メールアドレス
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          className="mt-1 w-full rounded border p-2"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />

        {errors.email?.message && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block">
          パスワード
        </label>

        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="mt-1 w-full rounded border p-2"
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
        />

        {errors.password?.message && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {rootError && (
        <p className="text-sm text-red-600" role="alert">
          {rootError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded bg-blue-600 py-2 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "ログイン中..." : submitLabel}
      </button>
    </>
  );
}
