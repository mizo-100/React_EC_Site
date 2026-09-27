import { Link, useNavigate } from "react-router-dom";
import { routes } from "../../../../config/routes";
import { useAuthStore } from "../../../../stores/authStore";
import type { Product } from "../../../../types/product";
import { useAddCartItem } from "../../hooks/useAddCartItem";
import { useProductLike } from "../api/productApi";

type ProductCardProps = {
  product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);

  const likeMutation = useProductLike();
  const addCartItemMutation = useAddCartItem();
  const productDetailPath = routes.productDetail(product.sku);

  const isLikeUpdating =
    likeMutation.isPending &&
    likeMutation.variables?.sku === product.sku;

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative">
        <Link
          to={productDetailPath}
          aria-label={`${product.name}の商品詳細を見る`}
          className="block"
        >
          <div className="flex h-48 items-center justify-center bg-gray-100">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm text-gray-400">
                商品画像なし
              </span>
            )}
          </div>
        </Link>

        <button
          type="button"
          aria-label={
            product.liked
              ? `${product.name}のいいねを解除`
              : `${product.name}にいいねする`
          }
          disabled={isLikeUpdating}
          onClick={() => {
            likeMutation.mutate({
              sku: product.sku,
              liked: !product.liked,
            });
          }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl shadow-sm transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span
            className={
              product.liked ? "text-red-500" : "text-gray-400"
            }
          >
            {product.liked ? "♥" : "♡"}
          </span>
        </button>
      </div>

      <div className="p-4">
        {product.categories.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {product.categories.map((category) => (
              <span
                key={category.slug}
                className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        <Link to={productDetailPath} className="block">
          <h2 className="min-h-12 text-sm font-bold leading-6 text-gray-900 hover:text-blue-600">
            {product.name}
          </h2>

          <p className="mt-2 text-lg font-bold text-blue-600">
            ¥{product.price.toLocaleString()}
          </p>
        </Link>

        <div className="mt-4 flex items-center gap-2">
          <Link
            to={productDetailPath}
            className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-bold text-white transition hover:bg-blue-700"
          >
            詳細を見る
          </Link>

          <button
            type="button"
            aria-label={`${product.name}をカートに追加`}
            disabled={addCartItemMutation.isPending}
            onClick={() => {
              if (!user) {
                navigate(routes.login);
                return;
              }

              addCartItemMutation.mutate({
                sku: product.sku,
                quantity: 1,
              });
            }}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-500 transition hover:border-blue-500 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            🛒
          </button>
        </div>
      </div>
    </article>
  );
}
