import { axiosInstance } from "../../../../libs/axios";
import { withCsrf } from "../../../../libs/csrf";
import type { CartResponse } from "../../../../types/cartResponse";
import type {
    AddCartItemInput,
    UpdateCartItemInput,
} from "../types/cartRequest";

export const fetchCart = async (): Promise<CartResponse> => {
  const { data } = await axiosInstance.get<CartResponse>("/cart-items");

  return data;
};

export const addCartItem = async ({
  sku,
  quantity,
}: AddCartItemInput): Promise<void> => {
  await withCsrf(() =>
    axiosInstance.post("/cart-items", {
      sku,
      quantity,
    }),
  );
};

export const updateCartItem = async ({
  sku,
  quantity,
}: UpdateCartItemInput): Promise<void> => {
  await withCsrf(() =>
    axiosInstance.put(`/cart-items/${sku}`, {
      quantity,
    }),
  );
};

export const deleteCartItem = async (sku: string): Promise<void> => {
  await withCsrf(() => axiosInstance.delete(`/cart-items/${sku}`));
};
