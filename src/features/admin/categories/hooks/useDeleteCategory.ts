import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminCategoriesQueryKeys,
  deleteCategory,
} from "../api/categoriesApi";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => deleteCategory(slug),

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
