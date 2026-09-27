import { axiosInstance } from "../../../../lib/axios";
import type { CategoriesResponse } from "../../../../types/category";

export const fetchCategories = async (): Promise<CategoriesResponse> => {
  const { data } = await axiosInstance.get<CategoriesResponse>("/categories")
  return data
}
