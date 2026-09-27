export type PublicationStatus = "published" | "unpublished";

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
