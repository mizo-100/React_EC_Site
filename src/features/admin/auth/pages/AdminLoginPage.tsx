import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../../../../config/routes";
import { getApiMessage } from "../../../../lib/getApiMessage";
import { adminAuthStore } from "../../../../stores/adminAuthStore ";
import { LoginForm } from "../../../auth/components/LoginForm";
import { loginSchema, type LoginFormValues } from "../../../auth/schemas/loginSchema";
import { adminSignin } from "../api/adminAuthApi";

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const setAdmin = adminAuthStore((state) => state.setAdmin);

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
      const admin = await adminSignin(values);

      setAdmin(admin);
      navigate("/admin/products", { replace: true });
    } catch (error) {
      setError("root", {
        message: getApiMessage(error),
      });
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold">管理者ログイン</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-xl bg-white p-6 shadow-sm"
        noValidate
      >
        <LoginForm
          register={register}
          errors={errors}
          isSubmitting={isSubmitting}
          submitLabel="管理者としてログイン"
          rootError={errors.root?.message}
        />

        <Link
          to={routes.login}
          className="block text-center text-sm text-blue-600"
        >
          ユーザーページはこちら
        </Link>
        <p>デモアカウント</p>
        <p>ID: admin1@example.com  PW: admin1-password</p>
        <p>ID: admin2@example.com  PW: admin2-password</p>
        <p>ID: admin3@example.com  PW: admin3-password</p>
      </form>
    </main>
  );
}
