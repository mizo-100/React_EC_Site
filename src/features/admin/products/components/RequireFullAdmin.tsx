import { Navigate } from "react-router-dom";
import { useCurrentAdmin } from "../../admins/api/adminAdminsApi";

export const RequireFullAdmin = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: me, isPending } = useCurrentAdmin();

  if (isPending) {
    return <div>読み込み中...</div>;
  }

  if (!me || me.role !== "full") {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
