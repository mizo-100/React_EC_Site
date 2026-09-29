import { Link, useNavigate, useParams } from "react-router-dom";
import { adminRoutes } from "../../../../config/admin/routes";
import { getApiMessage } from "../../../../libs/getApiMessage";
import { useCurrentAdmin } from "../../admins/api/adminAdminsApi";
import { useAdminProduct, useDeleteProduct } from "../api/productsApi";

export const ProductDetailPage = () => {
  const { sku } = useParams<{ sku: string }>();
  const navigate = useNavigate();
  const { data: admin, isPending: isAdminPending } = useCurrentAdmin();
  const deleteProductMutation = useDeleteProduct();

  const {
    data: product,
    isPending,
    isError,
    error,
  } = useAdminProduct(sku ?? "");

  if (!sku) {
    return (
      <main className="mx-auto max-w-270 px-4 py-12">
        商品が見つかりません。
      </main>
    );
  }

  if (isPending || isAdminPending) {
    return (
      <main className="mx-auto max-w-270 px-4 py-12">
        商品を読み込み中です...
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="mx-auto max-w-270 px-4 py-12">
        <p className="text-red-600">{getApiMessage(error)}</p>
      </main>
    );
  }

  const canManage = admin?.role === "full" || admin?.role === "register";

  const handleDelete = () => {
    if (!window.confirm(`「${product.name}」を削除します。よろしいですか？`)) {
      return;
    }

    deleteProductMutation.mutate(product.sku, {
      onSuccess: () => navigate(adminRoutes.products),
    });
  };

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">商品管理</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            {product.name}
          </h1>
        </div>
        <Link
          to={adminRoutes.products}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          商品一覧へ戻る
        </Link>
      </div>

      <article className="grid gap-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <img src={product.image} alt={product.name} className="w-full rounded-lg object-cover" />

        <div className="space-y-4">
          <p className="text-sm text-gray-500">SKU: {product.sku}</p>
          <p className="text-2xl font-bold text-blue-600">
            ¥{product.price.toLocaleString()}
          </p>
          <p className="whitespace-pre-wrap text-gray-700">
            {product.description}
          </p>
          <p className="text-sm text-gray-700">
            公開状態: {product.publicationStatus === "published" ? "公開" : "非公開"}
          </p>
          <div className="flex flex-wrap gap-2">
            {product.categories.map((category) => (
              <span
                key={category.slug}
                className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
              >
                {category.name}
              </span>
            ))}
          </div>

          {deleteProductMutation.isError && (
            <p className="text-sm text-red-600">
              {getApiMessage(deleteProductMutation.error)}
            </p>
          )}

          {canManage && (
            <div className="flex gap-3 pt-2">
              <Link
                to={adminRoutes.productEdit(product.sku)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
              >
                編集
              </Link>
              <button
                type="button"
                disabled={deleteProductMutation.isPending}
                onClick={handleDelete}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {deleteProductMutation.isPending ? "削除中..." : "削除"}
              </button>
            </div>
          )}
        </div>
      </article>
    </main>
  );
}
