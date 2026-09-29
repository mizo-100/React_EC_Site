import { axiosInstance } from "../../../../libs/axios";

export const getDashboardStats = async () => {
  const [categories, products] = await Promise.all([
    axiosInstance.get("/admin/categories"),
    axiosInstance.get("/admin/products"),
  ]);

  return {
    categoryCount: categories.data.length,
    productCount: products.data.length,
  };
}
