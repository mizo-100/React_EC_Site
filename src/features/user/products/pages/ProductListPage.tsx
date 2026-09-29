import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { CategorySelectButtons } from "../../../../components/CategorySelectButtons"
import { ProductFilters } from "../../../../components/ProductFilters"
import { useCategories } from "../../../categories/hooks/useCategories"
import { useProducts } from "../api/productApi"
import { ProductCard } from "../components/ProductCard"

export const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const keyword = searchParams.get("keyword") ?? ""
  const [page, setPage] = useState(1)
  const [inputKeyword, setInputKeyword] = useState(keyword)

  const [selectedCategorySlugs, setSelectedCategorySlugs] =
    useState<string[]>([])

  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [direction, setDirection] = useState<"asc" | "desc">("asc")

  const {
    data,
    isPending,
    isError,
    error,
  } = useProducts({
    page,
    size: 10,
    keyword: keyword || undefined,
    categorySlugs:
      selectedCategorySlugs.length > 0
        ? selectedCategorySlugs
        : undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort: "price",
    direction,
  })

  const {
    data: categories = [],
    isPending: isCategoriesPending,
    isError: isCategoriesError,
  } = useCategories()

  const handleKeywordChange = (value: string) => {
    setInputKeyword(value)
    setPage(1)
    const nextParams = new URLSearchParams(searchParams)
    if (value) {
      nextParams.set("keyword", value)
    } else {
      nextParams.delete("keyword")
    }
    setSearchParams(nextParams, { replace: true })
  }

  useEffect(() => {
    setInputKeyword(keyword)
    setPage(1)
  }, [keyword])


  if (isPending || isCategoriesPending) {
    return (
      <main className="mx-auto max-w-270 px-4 py-12">
        <p className="text-gray-600">
          商品を読み込み中です...
        </p>
      </main>
    )
  }

  if (isError || !data) {
    console.error(error)

    return (
      <main className="mx-auto max-w-270 px-4 py-12">
        <p className="text-red-600">
          商品の取得に失敗しました。
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-270 px-4 py-12">
      <section className="mb-8 rounded-xl border border-gray-200 bg-white p-5">
        <ProductFilters
          inputKeyword={inputKeyword}
          minPrice={minPrice}
          maxPrice={maxPrice}
          direction={direction}
          searchOnChange
          onKeywordChange={handleKeywordChange}
          onMinPriceChange={(value) => {
            setMinPrice(value);
            setPage(1);
          }}
          onMaxPriceChange={(value) => {
            setMaxPrice(value);
            setPage(1);
          }}
          onDirectionChange={(value) => {
            setDirection(value);
            setPage(1);
          }}
        />

        <div className="mt-5 flex flex-wrap items-center px-5 gap-2.5">
          <span className="mr-1 text-sm font-medium text-gray-700">
            カテゴリー
          </span>

          {isCategoriesError ? (
            <p className="text-sm text-red-600">
              カテゴリーの取得に失敗しました。
            </p>
            ) : (
              <CategorySelectButtons
                categories={categories}
                selectedSlugs={selectedCategorySlugs}
                onChange={(nextSlugs) => {
                  setPage(1);
                  setSelectedCategorySlugs(nextSlugs);
                }}
              />
            )}

        </div>
      </section>

      <div>
        <p className="text-sm text-gray-600 mb-4">
          {data.totalCount}件の商品
        </p>
      </div>

      {data.products.length === 0 ? (
        <p className="py-12 text-center text-gray-500">
          商品がありません。
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {data.products.map((product) => (
            <ProductCard
              key={product.sku}
              product={product}
            />
          ))}
        </div>
      )}

      {data.totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() =>
              setPage((current) => current - 1)
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ‹
          </button>

          {Array.from(
            { length: data.totalPages },
            (_, index) => index + 1,
          ).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => setPage(pageNumber)}
              className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium ${
                page === pageNumber
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            disabled={page >= data.totalPages}
            onClick={() =>
              setPage((current) => current + 1)
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ›
          </button>
        </div>
      )}
    </main>
  );
}
