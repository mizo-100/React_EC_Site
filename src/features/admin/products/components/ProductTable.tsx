import { Link } from "react-router-dom";
import { adminRoutes } from "../../../../config/admin/routes";
import type { AdminProduct } from "../types/products";

type ProductTableProps = {
  products: AdminProduct[];
  isRestricted?: boolean;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(price);
};

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
};

const publicationStatusLabel = {
  published: "公開",
  unpublished: "非公開",
} as const;

export const ProductTable = ({
  products,
  isRestricted = false,
}: ProductTableProps) => {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500">
        条件に一致する商品はありません。
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <th className="px-4 py-3">商品</th>
            <th className="px-4 py-3">SKU</th>
            <th className="px-4 py-3">カテゴリー</th>
            <th className="px-4 py-3">価格</th>
            <th className="px-4 py-3">公開状態</th>
            <th className="px-4 py-3">登録日</th>
            <th className="px-4 py-3">いいね</th>
            <th className="px-4 py-3">操作</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {products.map((product) => (
            <tr key={product.sku} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="flex min-w-52 items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-10 w-10 shrink-0 rounded object-cover"
                  />

                  <span className="line-clamp-1 text-sm font-medium text-gray-900">
                    {product.name}
                  </span>
                </div>
              </td>

              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                {product.sku}
              </td>

              <td className="px-4 py-3">
                <div className="flex min-w-40 flex-wrap gap-1">
                  {product.categories.map((category) => (
                    <span
                      key={category.slug}
                      className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </td>

              <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-blue-700">
                {formatPrice(product.price)}
              </td>

              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <span
                  className={
                    product.publicationStatus === "published"
                      ? "font-semibold text-blue-600"
                      : "font-semibold text-gray-500"
                  }
                >
                  {publicationStatusLabel[product.publicationStatus]}
                </span>
              </td>

              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                {formatDate(product.createdAt)}
              </td>

              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                ♥ {product.likeCount}
              </td>

              <td className="whitespace-nowrap px-4 py-3">
                {!isRestricted && (
                  <Link
                    to={adminRoutes.productDetail(product.sku)}
                    className="rounded border border-blue-600 px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                  >
                    編集
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
