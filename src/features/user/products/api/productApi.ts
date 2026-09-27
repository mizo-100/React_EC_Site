import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "../../../../lib/axios";
import { withCsrf } from "../../../../lib/csrf";
import type { ProductDetail } from "../../../../types/product";
import type { ProductQueryParams } from "../types/productQuery";
import type { ProductListResponse } from "../types/productResponse";

const productQueryKey = (params: ProductQueryParams) =>
  ["products", params] as const;

export const fetchProducts = async (
  params: ProductQueryParams,
): Promise<ProductListResponse> => {
  const { data } = await axiosInstance.get<ProductListResponse>(
    "/products",
    {
      params: {
        page: params.page,
        size: params.size,
        keyword: params.keyword || undefined,
        categorySlugs:
          params.categorySlugs && params.categorySlugs.length > 0
            ? params.categorySlugs
            : undefined,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        sort: params.sort,
        direction: params.direction,
      },
      paramsSerializer: {
        indexes: null,
      },
    },
  );

  return data;
};

export const fetchProduct = async (
  sku: string,
): Promise<ProductDetail> => {
  const { data } = await axiosInstance.get<ProductDetail>(
    `/products/${sku}`,
  );

  return data;
};

export const useProduct = (sku: string) => {
  return useQuery({
    queryKey: ["product", sku],
    queryFn: () => fetchProduct(sku),
    enabled: Boolean(sku),
  });
};

export const useProducts = (params: ProductQueryParams) => {
  return useQuery({
    queryKey: productQueryKey(params),
    queryFn: () => fetchProducts(params),
    placeholderData: keepPreviousData,
  });
};

export const updateProductLike = async ({
  sku,
  liked,
}: {
  sku: string;
  liked: boolean;
}) => {
  return withCsrf(() =>
    liked
      ? axiosInstance.post(`/products/${sku}/likes`)
      : axiosInstance.delete(`/products/${sku}/likes`),
  );
};

export const useProductLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProductLike,

    onMutate: async ({ sku, liked }) => {
      await queryClient.cancelQueries({
        queryKey: ["products"],
      });

      const previousQueries = queryClient.getQueriesData<ProductListResponse>({
        queryKey: ["products"],
      });

      queryClient.setQueriesData<ProductListResponse>({
          queryKey: ["products"],
        },
        (old) => {
          if (!old) {
            return old;
          }

          return {
            ...old,
            products: old.products.map((product) =>
              product.sku === sku
                ? { ...product, liked }
                : product,
            ),
          };
        },
      );

      return { previousQueries };
    },

    onError: (_error, _variables, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}
