import { useQuery } from "@tanstack/react-query";
import { fetchCart } from "../cart/api/cartApi";

export const cartQueryKey = ["cart"] as const;

export const useCart = () => {
  return useQuery({
    queryKey: cartQueryKey,
    queryFn: fetchCart,
    retry: false,
  });
};
