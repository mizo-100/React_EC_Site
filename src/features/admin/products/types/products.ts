export type PublicationStatus = "published" | "unpublished";

export type AdminProductsParams = {
  page: number;
  size: number;
  keyword?: string;
  categorySlugs?: string[];
  minPrice?: number;
  maxPrice?: number;
  publicationStatus?: PublicationStatus;
  sort?: string;
  direction?: "asc" | "desc";
};

export type AdminProductCategory = {
  slug: string;
  name: string;
};

export type AdminProduct = {
  sku: string;
  name: string;
  price: number;
  image: string;
  publicationStatus: PublicationStatus;
  likeCount: number;
  categories: AdminProductCategory[];
  createdAt: string;
};

export type AdminProductsResponse = {
  products: AdminProduct[];
  page: number;
  size: number;
  totalPages: number;
  totalCount: number;
  unfilteredCount: number;
};

export type Product = {
  sku: string;
  name: string;
  description: string;
  price: number;
  image: string;
  publicationStatus?: PublicationStatus;
  likeCount?: number;
  categories: AdminProductCategory[];
  createdAt: string;
  updatedAt: string;
};

export type ProductImageUploadResponse = {
  key: string;
  url: string;
};

export type ProductCreateResponse = {
  sku: string;
};
