import { useNavigate } from "react-router-dom";
import { ProductForm } from "../components/ProductForm";
import { useCreateProduct } from "../hooks/useCreateProduct";
import type { ProductFormValues } from "../types/productFormValues";

export const ProductNewPage = () => {
  const navigate = useNavigate();
  const createProductMutation = useCreateProduct();

  const handleSubmit = async (
    data: ProductFormValues,
  ): Promise<void> => {
    try {
      await createProductMutation.mutateAsync(data);

      navigate("/admin/products", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "商品の登録に失敗しました。",
        error,
      );
    }
  };

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6">
        <p className="text-sm text-gray-500">
          商品管理
        </p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          商品新規登録
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          新しい商品情報を入力してください。
        </p>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        submitLabel="商品を登録"
      />
    </main>
  );
}
