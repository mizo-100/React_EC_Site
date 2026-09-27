import type { Category } from "./category";

export type Product = {
  sku: string;
  name: string;
  price: number;
  image: string;
  createdAt: string;
  liked: boolean;
  categories: Category[];
}

export type ProductDetail = Product & {
  description: string;
  updatedAt: string;
}
