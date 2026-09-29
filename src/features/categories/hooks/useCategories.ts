import { useQuery } from "@tanstack/react-query"
import type { CategoriesResponse } from "../../../types/category"
import { fetchCategories } from "../api/categoryApi"

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
