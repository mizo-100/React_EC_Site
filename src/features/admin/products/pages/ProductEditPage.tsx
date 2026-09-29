import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { CategorySelectButtons } from "../../../../components/CategorySelectButtons";
import { adminRoutes } from "../../../../config/admin/routes";
import { getApiMessage } from "../../../../libs/getApiMessage";
import { adminAuthStore } from "../../../../stores/adminAuthStore";
import { useCategories } from "../../../categories/hooks/useCategories";
import {
    uploadProductImage,
    useAdminProduct,
    useUpdateProduct,
} from "../api/productsApi";
import type { ProductFormValues } from "../types/productFormValues";

type ModalState =
  | { open: false }
  | {
      open: true;
      type: "success" | "error";
      message: string;
    };

export const AdminProductEditPage = () => {
  const { sku } = useParams<{ sku: string }>();
  const admin = adminAuthStore((state) => state.admin);
  const navigate = useNavigate();
  const [modal, setModal] = useState<ModalState>({ open: false });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [loadedSku, setLoadedSku] = useState("");
  const [form, setForm] = useState<ProductFormValues>({
    sku: "",
    name: "",
    description: "",
    price: 0,
    imageKey: "",
    categorySlugs: [],
    publicationStatus: "published",
  });
  const updateProductMutation = useUpdateProduct();
  const { data: product, isPending, isError } = useAdminProduct(sku ?? "");
  const {
    data: categories = [],
    isPending: isCategoriesPending,
    isError: isCategoriesError,
  } = useCategories();

  if (product && loadedSku !== product.sku) {
    setLoadedSku(product.sku);
    setForm({
      sku: product.sku,
      name: product.name,
      description: product.description,
      price: product.price,
      imageKey: `products/${product.sku}/main.png`,
      categorySlugs: product.categories.map((category) => category.slug),
      publicationStatus: product.publicationStatus ?? "published",
    });
  }

  if (admin?.role === "viewer") {
    return <Navigate to={adminRoutes.products} replace />;
  }

  if (!sku) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <p className="text-sm text-red-600">商品が見つかりません。</p>
      </main>
    );
  }

  if (isPending || isCategoriesPending) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <p className="text-sm text-gray-600">商品を読み込み中です...</p>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <p className="text-sm text-red-600">商品の取得に失敗しました。</p>
      </main>
    );
  }

  if (isCategoriesError) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <p className="text-sm text-red-600">
          カテゴリーを読み込めなかったため、商品を編集できません。
        </p>
      </main>
    );
  }

  if (loadedSku !== product.sku) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <p className="text-sm text-gray-600">商品を読み込み中です...</p>
      </main>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setImageError("");

    if (file.type !== "image/png") {
      setImageFile(null);
      setImagePreview(null);
      setImageError("PNG形式の画像を選択してください。");
      e.target.value = "";
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setImageFile(null);
      setImagePreview(null);
      setImageError("画像サイズは20MB以下にしてください。");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploadingImage(true);
    try {
      const imageKey = imageFile
        ? (await uploadProductImage(form.sku, imageFile)).key
        : form.imageKey;

      await updateProductMutation.mutateAsync({ ...form, imageKey });
      setModal({
        open: true,
        type: "success",
        message: "商品を更新しました。",
      });
    } catch (error) {
      setModal({
        open: true,
        type: "error",
        message: getApiMessage(error),
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6">
        <p className="text-sm text-gray-500">商品管理</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">商品編集</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                SKU
              </label>
              <input
                type="text"
                value={form.sku}
                readOnly
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-500 bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                商品名
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                説明
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                価格
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                min={1}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                画像
              </label>
              <div className="mt-2">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="プレビュー"
                    className="h-48 w-48 object-cover rounded-lg"
                  />
                ) : (
                  <img
                    src={product.image}
                    alt={form.name}
                    className="h-48 w-48 object-cover rounded-lg"
                  />
                )}
              </div>
              <label className="mt-2 inline-flex cursor-pointer items-center justify-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200">
                画像を選択
                <input
                  type="file"
                  accept="image/png"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {imageError && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {imageError}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                新しい画像を選択すると、現在の画像が置き換わります。
              </p>
            </div>

            <div>
              <p className="block text-sm font-medium text-gray-700">
                カテゴリー
              </p>

              {isCategoriesPending ? (
                <p className="mt-2 text-sm text-gray-500">
                  カテゴリーを読み込み中です...
                </p>
              ) : (
                <div className="mt-2">
                  <CategorySelectButtons
                    categories={categories}
                    selectedSlugs={form.categorySlugs}
                    onChange={(nextSlugs) => {
                      setForm((previous) => ({
                        ...previous,
                        categorySlugs: nextSlugs,
                      }));
                    }}
                  />
                </div>
              )}
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700">
                公開ステータス
              </label>
              <select
                value={form.publicationStatus}
                onChange={(e) =>
                  setForm({ ...form, publicationStatus: e.target.value as "published" | "unpublished" })
                }
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="published">公開</option>
                <option value="unpublished">非公開</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate(adminRoutes.productDetail(sku!))}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
                disabled={updateProductMutation.isPending || isUploadingImage}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
            >
                {isUploadingImage || updateProductMutation.isPending
                  ? "保存中..."
                  : "保存する"}
            </button>
          </div>
        </section>
      </form>

      {modal.open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <p className="text-sm font-medium text-gray-900">{modal.message}</p>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  const wasSuccessful = modal.type === "success";
                  setModal({ open: false });
                  if (wasSuccessful) {
                    navigate(adminRoutes.productDetail(sku));
                  }
                }}
                className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
