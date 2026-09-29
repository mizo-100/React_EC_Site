export const routePatterns = {
  productDetail: "products/:sku",
} as const;

export const routes = {
  home: "/",
  login: "/login",
  signup: "/signup",
  cart: "/cart",
  myPage: "/mypage",
  productDetail: (sku: string) => `/products/${sku}`,
  adminLogin: "/admin/login",
  adminDashboard: "/admin",
} as const;
