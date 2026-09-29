import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCartItem } from "../api/cartApi";
import { cartQueryKey } from "./useCart";

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
