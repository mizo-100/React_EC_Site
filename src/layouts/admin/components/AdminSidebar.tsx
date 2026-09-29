import { NavLink } from "react-router-dom";
import { useCurrentAdmin } from "../../../features/admin/admins/api/adminAdminsApi";
import { adminIconItems, type AdminRole } from "../../../libs/const/iconItems";

export const AdminSidebar = () => {
  const {
    data: me,
  } = useCurrentAdmin();

  const role: AdminRole = me?.role;
  const iconItems = adminIconItems(role);


  const roleLabel =
    role === "full"
      ? "Full Admin"
      : role === "register"
        ? "Register"
        : role === "viewer"
          ? "Viewer"
          : "";

  return (
    <aside className="flex min-h-[calc(100vh-4rem)] w-52 shrink-0 flex-col border-r border-[#d9dfe6] bg-white">
      <nav className="pt-2">
        {iconItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 border-r-2 px-4 py-3 text-sm transition",
                isActive
                  ? "border-[#1976c8] bg-[#e4f2fc] font-bold text-[#1769c2]"
                  : "border-transparent text-gray-700 hover:bg-gray-50",
              ].join(" ")
            }
          >
            <img
              src={item.icon}
              alt=""
              aria-hidden="true"
              className="h-5 w-5 object-contain"
            />

            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-gray-200 px-3 py-4">
        <p className="text-xs text-gray-400">ログイン中</p>
        <p className="mt-1 truncate text-xs text-gray-700">
          {me?.email ?? ""}
        </p>
        {roleLabel && (
          <span className="mt-2 inline-block rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700">
            {roleLabel}
          </span>
        )}
      </div>
    </aside>
  );
}
