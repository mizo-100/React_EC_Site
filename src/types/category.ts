export type Category = {
  slug: string;
  name: string;
  createdAt: string;
}

export type CategoriesResponse = {
  categories: Category[];
}
