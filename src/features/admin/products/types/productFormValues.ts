export type ProductFormValues = {
  sku: string;
  name: string;
  description: string;
  price: number;
  imageKey: string;
  categorySlugs: string[];
  publicationStatus: "published" | "unpublished";
}
