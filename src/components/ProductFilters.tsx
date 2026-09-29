type ProductFiltersProps = {
  inputKeyword: string;
  minPrice: string;
  maxPrice: string;
  direction: "asc" | "desc";
  searchOnChange?: boolean;
  onKeywordChange: (value: string) => void;
  onSearch?: () => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onDirectionChange: (value: "asc" | "desc") => void;
};

export const ProductFilters = ({
  inputKeyword,
  minPrice,
  maxPrice,
  direction,
  searchOnChange = false,
  onKeywordChange,
  onSearch,
  onMinPriceChange,
  onMaxPriceChange,
  onDirectionChange,
}: ProductFiltersProps) => {
  return (
    <section className="mb-2 rounded-xl bg-white p-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div>
          <div className="flex gap-2">
            <input
              id="keyword"
              type="search"
              value={inputKeyword}
              onChange={(event) => {
                onKeywordChange(event.target.value);
              }}
              onKeyDown={(event) => {
                if (!searchOnChange && event.key === "Enter") {
                  onSearch?.();
                }
              }}
              placeholder="商品名を入力"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <input
            id="min-price"
            type="number"
            min="0"
            value={minPrice}
            onChange={(event) => {
              onMinPriceChange(event.target.value);
            }}
            placeholder="最低金額"
            aria-label="最低金額"
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          <span
            aria-hidden="true"
            className="text-gray-500"
          >
            ～
          </span>

          <input
            id="max-price"
            type="number"
            min="0"
            value={maxPrice}
            onChange={(event) => {
              onMaxPriceChange(event.target.value);
            }}
            placeholder="最高金額"
            aria-label="最高金額"
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          <select
            id="price-direction"
            value={direction}
            onChange={(event) => {
              onDirectionChange(
                event.target.value as "asc" | "desc",
              );
            }}
            className="rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="asc">安い順</option>
            <option value="desc">高い順</option>
          </select>
        </div>
      </div>
    </section>
  );
}
