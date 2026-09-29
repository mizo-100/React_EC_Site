import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../../libs/axios";
import { withCsrf } from "../../../../libs/csrf";
import type { ProductFormValues } from "../types/productFormValues";
import type {
    AdminProductsResponse,
    PublicationStatus,
} from "../types/products";


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

export type Product = {
  sku: string;
  name: string;
  description: string;
  price: number;
  image: string;
  publicationStatus?: PublicationStatus;
  likeCount?: number;
  categories: { slug: string; name: string }[];
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

export const getAdminProducts = async (
  params: AdminProductsParams,
): Promise<AdminProductsResponse> => {
  const { data } = await axiosInstance.get<AdminProductsResponse>(
    "/admin/products",
    {
      params,
      paramsSerializer: {
        indexes: null,
      },
    },
  );

  return data;
};

export const uploadProductImage = async (
  sku: string,
  image: File,
): Promise<ProductImageUploadResponse> => {
  const formData = new FormData();

  formData.append("sku", sku);
  formData.append("image", image, image.name);

  const { data } = await withCsrf(() =>
    axiosInstance.post<ProductImageUploadResponse>(
      "/admin/product-images",
      formData,
    ),
  );

  return data;
};

export const createProduct = async (
  formValues: ProductFormValues,
): Promise<ProductCreateResponse> => {
  const requestBody = {
    sku: formValues.sku,
    name: formValues.name,
    description: formValues.description,
    price: formValues.price,
    imageKey: formValues.imageKey,
    categorySlugs: formValues.categorySlugs,
  };

  const { data } = await withCsrf(() =>
    axiosInstance.post<ProductCreateResponse>("/admin/products", requestBody),
  );

  return data;
};

export const updateProduct = async (
  formValues: ProductFormValues,
): Promise<void> => {
  const { sku, name, description, price, imageKey, publicationStatus, categorySlugs } = formValues;

  await withCsrf(() =>
    axiosInstance.put<void>(`/admin/products/${sku}`, {
      name,
      description,
      price,
      imageKey,
      publicationStatus,
      categorySlugs,
    }),
  );
};

export const adminProductsQueryKeys = {
  all: ["admin", "products"] as const,

  list: (params: AdminProductsParams) =>
    [...adminProductsQueryKeys.all, "list", params] as const,
};

export const useAdminProducts = (
  params: AdminProductsParams,
) => {
  return useQuery({
    queryKey: adminProductsQueryKeys.list(params),
    queryFn: () => getAdminProducts(params),
  });
};

export const getAdminProduct = async (sku: string): Promise<Product> => {
  const { data } = await axiosInstance.get<Product>(`/admin/products/${sku}`);
  return data;
};

export const useAdminProduct = (sku: string) => {
  return useQuery({
    queryKey: [...adminProductsQueryKeys.all, "detail", sku],
    queryFn: () => getAdminProduct(sku),
    enabled: Boolean(sku),
  });
};


export const deleteProduct = async (sku: string): Promise<void> => {
  await withCsrf(() => axiosInstance.delete(`/admin/products/${sku}`));
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminProductsQueryKeys.all,
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProductsQueryKeys.all });
    },
  });
};
