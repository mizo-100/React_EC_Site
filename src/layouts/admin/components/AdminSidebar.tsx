import { NavLink } from "react-router-dom";
import { adminRoutes } from "../../../config/admin/routes";
import { useCurrentAdmin } from "../../../features/admin/admins/api/adminAdminsApi";

const getMenuItems = (role: "full" | "register" | "viewer" | undefined) => {
  const items = [
    {
      to: adminRoutes.products,
      label: "商品一覧",
      icon: "▣",
      show: true,
    },
    {
      to: adminRoutes.productNew,
      label: "商品新規登録",
      icon: "+",
      show: role !== "viewer",
      },
    {
      to: "/admin/categories",
      label: "カテゴリー管理",
      icon: "◇",
      show: role !== "viewer",
    },
    {
      to: "/admin/admins",
      label: "管理者管理",
      icon: "♧",
      show: role === "full",
    },
  ];

  return items.filter((item) => item.show);
};

export const AdminSidebar = () => {

  const { data: me, error, isPending } = useCurrentAdmin();
  const role = me?.role;
  console.log("AdminSidebar: me =", me);
  console.log("AdminSidebar: role =", role);
  console.log("AdminSidebar: error =", error);
  console.log("AdminSidebar: isPending =", isPending);

  const menuItems = getMenuItems(role);


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
        {menuItems.map((item) => (
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
            <span
              aria-hidden="true"
              className="w-4 text-center text-base text-gray-500"
            >
              {item.icon}
            </span>
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
