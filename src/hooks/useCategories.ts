import { useQuery } from "@tanstack/react-query"
import { fetchCategories } from "../features/user/cart/api/categoryApi"
import type { CategoriesResponse } from "../types/category"

export const useCategories = () => {
  const { data, ...rest } = useQuery<CategoriesResponse>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  })

  return {
    data: data?.categories ?? [],
    ...rest,
  }
}
