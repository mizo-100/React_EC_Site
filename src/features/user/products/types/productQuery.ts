export type ProductSort = "createdAt" | "price";

export type SortDirection = "asc" | "desc";

export type ProductQueryParams = {
  page: number;
  size: number;
  keyword?: string;
  categorySlugs?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSort;
  direction?: SortDirection;
};
