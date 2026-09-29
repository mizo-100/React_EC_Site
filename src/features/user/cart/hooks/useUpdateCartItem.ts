import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCartItem } from "../api/cartApi";
import { cartQueryKey } from "./useCart";

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItem,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: cartQueryKey,
      });
    },
  });
};
