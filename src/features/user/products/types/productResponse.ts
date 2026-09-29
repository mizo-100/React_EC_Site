import type { Product } from "./product";

export type ProductListResponse = {
  products: Product[]
  page: number
  size: number
  totalPages: number
  totalCount: number
};
