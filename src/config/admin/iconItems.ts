import { adminRoutes } from "./routes";

export type AdminRole =
  | "full"
  | "register"
  | "viewer"
  | undefined;

export type AdminIconItem = {
  to: string;
  label: string;
  icon: string;
  show: boolean;
};

export const adminIconItems = (
  role: AdminRole,
): AdminIconItem[] => {
  const items: AdminIconItem[] = [
    {
      to: adminRoutes.products,
      label: "商品一覧",
      icon: "/icons/product.svg",
      show: true,
    },
    {
      to: adminRoutes.productNew,
      label: "商品新規登録",
      icon: "/icons/productNew.svg",
      show: role !== "viewer",
    },
    {
      to: "/admin/categories",
      label: "カテゴリー管理",
      icon: "/icons/categorie.svg",
      show: role !== "viewer",
    },
    {
      to: "/admin/admins",
      label: "管理者管理",
      icon: "/icons/admins.svg",
      show: role === "full",
    },
  ];

  return items.filter((item) => item.show);
};
