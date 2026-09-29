import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../../../config/routes";
import { getApiMessage } from "../../../libs/getApiMessage";
import { useAuthStore } from "../../../stores/authStore";
import { userSignin } from "../api/authApi";
import { LoginForm } from "../components/LoginForm";
import { loginSchema, type LoginFormValues, } from "../schemas/loginSchema";

export const LoginPage = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
    email: "",
    password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    clearErrors("root");
    try {
      const user = await userSignin(values);

      setUser(user);
      navigate(routes.home, { replace: true });
    } catch (error) {
      setError("root", {
        message: getApiMessage(error),
      });
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold">ログイン</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-xl bg-white p-6 shadow-sm"
        noValidate
      >

        <LoginForm
          register={register}
          errors={errors}
          isSubmitting={isSubmitting}
          submitLabel="ログイン"
          rootError={errors.root?.message}
        />

        <Link
          to={routes.signup}
          className="block text-center text-sm text-blue-600"
        >
          新規登録はこちら
        </Link>

        <Link
          to={routes.adminLogin}
          className="block text-center text-sm text-blue-600"
        >
          管理者ページはこちら
        </Link>
      </form>
    </main>
  );
}
