import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import type { User } from "../../../../types/user";
import { adminName } from "../../../admin/auth/api/adminAuthApi";

export const RequireAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    adminName()
      .then((user: User) => {
        setIsAdmin(
          user.role === "full" ||
          user.role === "register" ||
          user.role === "viewer"
        );
      })
      .catch(() => {
        setIsAdmin(false);
      });
  }, []);

  if (isAdmin === null) {
    return <div>読み込み中...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};
