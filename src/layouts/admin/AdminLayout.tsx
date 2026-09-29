import { Outlet } from "react-router-dom";
import { AdminHeader } from "./components/AdminHeader";
import { AdminSidebar } from "./components/AdminSidebar";

export const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <AdminHeader />

      <div className="flex">
        <AdminSidebar />

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
