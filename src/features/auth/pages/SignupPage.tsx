import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../../../config/routes";
import { getApiMessage } from "../../../lib/getApiMessage";
import { userSignup } from "../api/authApi";
import { signupSchema, type SignupFormValues } from "../schemas/signupSchema";

export const SignupPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    clearErrors("root");

    try {
      await userSignup(values);

      navigate(routes.login, { replace: true });
    } catch (error) {
      setError("root", {
        message: getApiMessage(error),
      });
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold">新規登録</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-xl bg-white p-6 shadow-sm"
        noValidate
      >
        <div>
          <label htmlFor="name" className="block">
            名前
          </label>

          <input
            id="name"
            type="text"
            autoComplete="name"
            className="mt-1 w-full rounded border p-2"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />

          {errors.name?.message && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

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
            パスワード（8文字以上）
          </label>

          <input
            id="password"
            type="password"
            autoComplete="new-password"
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

        {errors.root?.message && (
          <p className="text-sm text-red-600" role="alert">
            {errors.root.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-blue-600 py-2 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "登録中..." : "登録する"}
        </button>

        <Link
          to={routes.login}
          className="block text-center text-sm text-blue-600"
        >
          ログインへ戻る
        </Link>
      </form>
    </main>
  );
}
