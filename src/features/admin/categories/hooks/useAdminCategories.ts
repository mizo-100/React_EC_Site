import { useQuery } from "@tanstack/react-query";
import {
  adminCategoriesQueryKeys,
  getAdminCategories,
} from "../api/categoriesApi";

export const useAdminCategories = () => {
  return useQuery({
    queryKey: adminCategoriesQueryKeys.all,
    queryFn: getAdminCategories,
  });
}
