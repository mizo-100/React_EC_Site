import type { CartItem } from "./cart";

export type CartResponse = {
  cartItems: CartItem[];
  totalAmount: number;
  itemCount: number;
}
