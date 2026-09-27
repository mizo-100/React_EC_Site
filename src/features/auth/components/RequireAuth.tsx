import { Navigate, Outlet, useLocation } from "react-router-dom";
import { routes } from "../../../config/routes";
import { useAuthStore } from "../../../stores/authStore";

export const RequireAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthChecking = useAuthStore((state) => state.isAuthChecking);
  const location = useLocation();

  if (isAuthChecking) {
    return (
      <main className="mx-auto max-w-xl px-4 py-12">
        <p>読み込み中...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <Navigate
        to={routes.login}
        replace
        state={{
          from: {
            pathname: location.pathname,
            search: location.search,
          },
        }}
      />
    );
  }

  return <Outlet />;
}
