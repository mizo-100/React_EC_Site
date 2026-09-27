import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartQueryKey } from "../../hooks/useCart";
import { deleteCartItem } from "../api/cartApi";

export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCartItem,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: cartQueryKey,
      });
    },
  });
};
