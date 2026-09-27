import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCartItem } from "../cart/api/cartApi";

export const useAddCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCartItem,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
}
