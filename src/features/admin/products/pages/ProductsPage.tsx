import { useState } from "react";
import { Link } from "react-router-dom";
import { CategorySelectButtons } from "../../../../components/CategorySelectButtons";
import { ProductFilters } from "../../../../components/ProductFilters";
import { adminRoutes } from "../../../../config/admin/routes";
import { useCategories } from "../../../../hooks/useCategories";
import { useCurrentAdmin } from "../../admins/api/adminAdminsApi";
import { useAdminProducts } from "../api/productsApi";
import { CsvButtons } from "../components/CsvButtons";
import { ProductTable } from "../components/ProductTable";

export const ProductsPage = () => {
  const { data: me } = useCurrentAdmin();

  const isRestricted = me?.role === "viewer";

  const [page, setPage] = useState(1);

  const [keyword, setKeyword] = useState("");
  const [inputKeyword, setInputKeyword] = useState("");

  const [selectedCategorySlugs, setSelectedCategorySlugs] =
    useState<string[]>([]);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const {
    data,
    isPending,
    isError,
    error,
  } = useAdminProducts({
    page,
    size: 10,
    keyword: keyword || undefined,
    categorySlugs:
      selectedCategorySlugs.length > 0
        ? selectedCategorySlugs
        : undefined,
    minPrice: minPrice
      ? Number(minPrice)
      : undefined,
    maxPrice: maxPrice
      ? Number(maxPrice)
      : undefined,
  });

  const {
    data: categories = [],
    isPending: isCategoriesPending,
    isError: isCategoriesError,
  } = useCategories();

  const handleSearch = () => {
    setPage(1);
    setKeyword(inputKeyword);
  };

  const handleCategoryChange = (
    nextSlugs: string[],
  ) => {
    setPage(1);
    setSelectedCategorySlugs(nextSlugs);
  };

  if (isPending || isCategoriesPending) {
    return (
      <main className="mx-auto max-w-7xl p-6">
        <p className="text-sm text-gray-600">
          商品を読み込み中です...
        </p>
      </main>
    );
  }

  if (isError || !data) {
    console.error(error);

    return (
      <main className="mx-auto max-w-7xl p-6">
        <p className="text-sm text-red-600">
          商品の取得に失敗しました。
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            商品管理
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {data.totalCount}件の商品
          </p>
        </div>

        <div className="flex gap-2">
          {!isRestricted && (
            <Link
              to={adminRoutes.productNew}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              ＋ 商品新規登録
            </Link>
          )}

          <CsvButtons />
        </div>
      </div>

      <section className="mb-8 rounded-xl border border-gray-200 bg-white p-5">
        <ProductFilters
          inputKeyword={inputKeyword}
          minPrice={minPrice}
          maxPrice={maxPrice}
          direction="desc"
          onKeywordChange={setInputKeyword}
          onSearch={handleSearch}
          onMinPriceChange={(value) => {
            setMinPrice(value);
            setPage(1);
          }}
          onMaxPriceChange={(value) => {
            setMaxPrice(value);
            setPage(1);
          }}
          onDirectionChange={() => {
            setPage(1);
          }}
        />

        <div className="mt-5 px-6 flex flex-wrap items-center gap-2.5">
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
              onChange={handleCategoryChange}
            />
          )}
        </div>
      </section>

      <section className="mt-4">
        <ProductTable
          products={data.products}
          isRestricted={isRestricted}
        />
      </section>

      {data.totalPages > 1 && (
        <nav
          aria-label="商品一覧のページネーション"
          className="mt-8 flex items-center justify-center gap-2"
        >
          <button
            type="button"
            disabled={page === 1}
            onClick={() => {
              setPage((current) => current - 1);
            }}
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
              onClick={() => {
                setPage(pageNumber);
              }}
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
            onClick={() => {
              setPage((current) => current + 1);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ›
          </button>
        </nav>
      )}
    </main>
  );
}
