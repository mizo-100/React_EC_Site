import type { Product } from "../../../../types/product";

export type ProductListResponse = {
  products: Product[]
  page: number
  size: number
  totalPages: number
  totalCount: number
};
