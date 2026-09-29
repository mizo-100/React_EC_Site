import { axiosInstance } from "../../../../libs/axios";
import { withCsrf } from "../../../../libs/csrf";
import type {
    CategoriesResponse,
    Category,
} from "../../../../types/category";
import type { CategorySaveInput } from "../types/categorySave";

export const adminCategoriesQueryKeys = {
  all: ["admin", "categories"] as const,
};

export const getAdminCategories = async (): Promise<Category[]> => {
  const { data } = await axiosInstance.get<CategoriesResponse>(
    "/admin/categories",
  );

  return data.categories;
};

export const saveCategories = async (
  categories: CategorySaveInput[],
): Promise<Category[]> => {
  const { data } = await withCsrf(() =>
    axiosInstance.put<CategoriesResponse>(
      "/admin/categories",
      { categories },
    ),
  );

  return data.categories;
};

export const deleteCategory = async (
  slug: string,
): Promise<void> => {
  await withCsrf(() =>
    axiosInstance.delete(`/admin/categories/${slug}`),
  );
};
