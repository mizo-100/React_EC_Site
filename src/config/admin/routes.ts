export const adminRoutePatterns = {
  productDetail: "products/:sku",
} as const;

export const adminRoutes = {
  dashboard: "/admin",
  products: "/admin/products",
  productNew: "/admin/products/new",
  productDetail: (sku: string) => `/admin/products/${sku}`,
  categories: "/admin/categories",
  productEdit: (sku: string) => `/admin/products/${sku}/edit`,
} as const;
