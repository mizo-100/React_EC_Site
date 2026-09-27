import { Link } from "react-router-dom";
import { routes } from "../../../../config/routes";
import { getApiMessage } from "../../../../lib/getApiMessage";
import { useCart } from "../../hooks/useCart";
import { useDeleteCartItem } from "../hooks/useDeleteCartItem";
import { useUpdateCartItem } from "../hooks/useUpdateCartItem";

export const CartPage = () => {

  const {
    data: cart,
    isPending,
    isError,
  } = useCart();

  const updateCartItemMutation = useUpdateCartItem();
  const deleteCartItemMutation = useDeleteCartItem();

  if (isPending) {
    return (
      <main className="mx-auto max-w-270 px-4 py-12">
        カートを読み込み中です...
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-270 px-4 py-12">
        <h1 className="text-2xl font-bold">カート</h1>
        <p className="mt-6 text-red-600">
          カートの取得に失敗しました。
        </p>
      </main>
    );
  }

  if (!cart?.cartItems.length) {
    return (
      <main className="mx-auto max-w-270 px-4 py-12">
        <h1 className="text-2xl font-bold">カート</h1>
        <p className="mt-6">カートに商品がありません。</p>
      </main>
    );
  }

  const handleUpdateQuantity = (sku: string, quantity: number) => {
    updateCartItemMutation.mutate(
      { sku, quantity },
      {
        onError: (error) => window.alert(getApiMessage(error)),
      },
    );
  };

  const handleDelete = (sku: string) => {
    deleteCartItemMutation.mutate(sku, {
      onError: (error) => window.alert(getApiMessage(error)),
    });
  };

  return (
    <main className="mx-auto max-w-270 px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold">カート</h1>

      <div className="space-y-3">
        {cart.cartItems.map((item) => {
          const isUpdating =
            updateCartItemMutation.isPending &&
            updateCartItemMutation.variables?.sku === item.sku;

          const isDeleting =
            deleteCartItemMutation.isPending &&
            deleteCartItemMutation.variables === item.sku;

          return (
            <article
              key={item.sku}
              className="flex gap-4 rounded-xl bg-white p-4 shadow-sm"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-20 w-20 rounded object-cover"
              />

              <div className="flex-1">
                <Link
                  to={routes.productDetail(item.sku)}
                  className="font-bold"
                >
                  {item.name}
                </Link>

                <p>¥{item.price.toLocaleString()}</p>

                {!item.available && (
                  <p className="text-sm text-red-600">
                    現在購入できません
                  </p>
                )}
              </div>

              <select
                aria-label={`${item.name}の数量`}
                value={item.quantity}
                disabled={isUpdating || isDeleting}
                onChange={(event) =>
                  handleUpdateQuantity(item.sku, Number(event.target.value))
                }
                className="h-10 rounded border px-2 text-center disabled:cursor-not-allowed disabled:opacity-50"
              >
                {Array.from({ length: 50 }, (_, index) => index + 1).map(
                  (quantity) => (
                    <option key={quantity} value={quantity}>
                      {quantity}
                    </option>
                  ),
                )}
              </select>

              <button
                type="button"
                disabled={isUpdating || isDeleting}
                onClick={() => handleDelete(item.sku)}
                className="text-sm text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "削除中..." : "削除する"}
              </button>
            </article>
          );
        })}
      </div>

      <p className="mt-6 text-right text-xl font-bold">
        合計 ¥{cart.totalAmount.toLocaleString()}
      </p>
    </main>
  );
}
