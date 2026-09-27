import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartQueryKey } from "../../hooks/useCart";
import { updateCartItem } from "../api/cartApi";

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
