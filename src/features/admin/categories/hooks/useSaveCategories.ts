import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminCategoriesQueryKeys,
  saveCategories,
} from "../api/categoriesApi";
import type { CategorySaveInput } from "../types/categorySave";


export const useSaveCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categories: CategorySaveInput[]) =>
      saveCategories(categories),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminCategoriesQueryKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
}
