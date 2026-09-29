import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { adminRoutes } from "../../../../config/admin/routes";
import { createProduct } from "../api/productsApi";

export const useCreateProduct = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "products"],
      });

      navigate(adminRoutes.products);
    },
  });
}
