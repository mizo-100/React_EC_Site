import { createBrowserRouter } from "react-router-dom";
import { adminRoutePatterns } from "../config/admin/routes";
import { routePatterns, routes } from "../config/routes";
import { AdminsPage } from "../features/admin/admins/pages/AdminsPage";
import { AdminLoginPage } from "../features/admin/auth/pages/AdminLoginPage";
import { CategoriesPage } from "../features/admin/categories/pages/CategoriesPage";
import { DashboardPage } from "../features/admin/dashboard/pages/DashboardPage";
import { RequireAdminAuth } from "../features/admin/products/components/RequireAdminAuth";
import { RequireFullAdmin } from "../features/admin/products/components/RequireFullAdmin";
import { ProductDetailPage as AdminProductDetailPage } from "../features/admin/products/pages/ProductDetailPage";
import { AdminProductEditPage } from "../features/admin/products/pages/ProductEditPage";
import { ProductNewPage } from "../features/admin/products/pages/ProductNewPage";
import { ProductsPage } from "../features/admin/products/pages/ProductsPage";
import { RequireAuth } from "../features/auth/components/RequireAuth";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { MyPage } from "../features/auth/pages/MyPage";
import { SignupPage } from "../features/auth/pages/SignupPage";
import { CartPage } from "../features/user/cart/pages/CartPage";
import { ProductDetailPage } from "../features/user/products/pages/ProductDetailPage";
import { ProductListPage } from "../features/user/products/pages/ProductListPage";
import { AdminLayout } from "../layouts/admin/AdminLayout";
import { UserLayout } from "../layouts/user/UserLayout";


export const router = createBrowserRouter([
  {
    path: routes.login,
    element: <LoginPage />,
  },
  {
    path: routes.signup,
    element: <SignupPage />,
  },

  {
    path: routes.adminLogin,
    element: <AdminLoginPage />,
  },

  {
    element: <UserLayout />,
    children: [
      {
        path: routes.home,
        element: <ProductListPage />,
      },
      {
        path: routePatterns.productDetail,
        element: <ProductDetailPage />,
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: routes.cart,
            element: <CartPage />,
          },
          {
            path: routes.myPage,
            element: <MyPage />,
          },
        ],
      },
    ],
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        element: <RequireAdminAuth />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: "products",
            element: <ProductsPage />,
          },
          {
            path: "products/new",
            element: <ProductNewPage />,
          },
          {
            path: adminRoutePatterns.productDetail,
            element: <AdminProductDetailPage />,
          },
          {
            path: "products/:sku/edit",
            element: <AdminProductEditPage />,
          },
          {
            path: "categories",
            element: <CategoriesPage />,
          },
          {
            path: "admins",
            element: (
              <RequireFullAdmin>
                <AdminsPage />
              </RequireFullAdmin>
            ),
          },
        ],
      },
    ],
  },
]);
