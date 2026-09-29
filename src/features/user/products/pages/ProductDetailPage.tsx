import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../../../../config/routes";
import { useAuthStore } from "../../../../stores/authStore";
import { useAddCartItem } from "../../cart/hooks/useAddCartItem";
import { useProduct } from "../api/productApi";

export const ProductDetailPage = () => {
  const { sku } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const addCartItemMutation = useAddCartItem();

  const {
    data: product,
    isPending,
    isError,
  } = useProduct(sku ?? "");

  if (!sku) {
    return (
      <main className="mx-auto max-w-270 px-4 py-12">
        商品が見つかりません。
      </main>
    );
  }

  if (isPending) {
    return (
      <main className="mx-auto max-w-270 px-4 py-12">
        商品を読み込み中です...
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="mx-auto max-w-270 px-4 py-12">
        商品が見つかりません。
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-270 px-4 py-12">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-blue-600"
      >
        ← 商品一覧へ戻る
      </button>

      <article className="grid gap-8 rounded-xl bg-white p-6 shadow-sm md:grid-cols-2">
        <img
          src={product.image}
          alt={product.name}
          className="aspect-square w-full rounded-lg object-cover"
        />

        <div>
          {product.categories.length > 0 && (
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
          )}

          <h1 className="mt-4 text-2xl font-bold">{product.name}</h1>

          <p className="mt-5 whitespace-pre-wrap text-gray-700">
            {product.description}
          </p>

          <p className="mt-6 text-2xl font-bold text-blue-600">
            ¥{product.price.toLocaleString()}
          </p>

          <button
            type="button"
            disabled={addCartItemMutation.isPending}
            onClick={() => {
              if (!user) {
                navigate(routes.login);
                return;
              }

              addCartItemMutation.mutate(
                {
                  sku: product.sku,
                  quantity: 1,
                },
                {
                  onSuccess: () => {
                    navigate(routes.cart);
                  },
                },
              );
            }}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {addCartItemMutation.isPending
              ? "追加中..."
              : "カートに追加"}
          </button>
        </div>
      </article>
    </main>
  );
}
