import { useNavigate } from "react-router-dom";
import { routes } from "../../../config/routes";
import { adminSignout } from "../../../features/admin/auth/api/adminAuthApi";
import { adminAuthStore } from "../../../stores/adminAuthStore";

export const AdminHeader = () => {
  const navigate = useNavigate();

  const admin = adminAuthStore(
    (state) => state.admin,
  );

  const clearAdmin = adminAuthStore(
    (state) => state.clearAdmin,
  );

  const handleSignout = async () => {
    try {
      await adminSignout();
    } finally {
      clearAdmin();

      navigate(routes.adminLogin, {
        replace: true,
      });
    }
  };

  return (
    <header className="flex h-16 items-center justify-between bg-[#1769c2] px-5 text-white shadow-sm">
      <div className="flex items-center gap-3">
        <img
          src="/icons/admin.svg"
          alt=""
          aria-hidden="true"
          className="h-5 w-5 object-contain"
        />

        <span className="text-lg font-bold">
          LH Admin
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-bold">
            {admin?.name ?? "管理者"}
          </p>

          {admin?.email && (
            <p className="text-xs text-white/80">
              {admin.email}
            </p>
          )}
        </div>

        <div className="h-8 w-px bg-white/25" />

        <button
          type="button"
          onClick={handleSignout}
          className="flex items-center gap-2 rounded px-2 py-2 text-sm font-semibold transition hover:bg-white/10"
        >
          <span aria-hidden="true">
            ⇥
          </span>

          ログアウト
        </button>
      </div>
    </header>
  );
}
