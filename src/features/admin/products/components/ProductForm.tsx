import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CategorySelectButtons } from "../../../../components/CategorySelectButtons";
import { useCategories } from "../../../../hooks/useCategories";
import { uploadProductImage } from "../api/productsApi";
import type { ProductFormValues } from "../types/productFormValues";

type ProductFormProps = {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (data: ProductFormValues) => void | Promise<void>;
  submitLabel?: string;
  isSkuDisabled?: boolean;
};

const initialValues: ProductFormValues = {
  sku: "",
  name: "",
  description: "",
  price: 0,
  imageKey: "",
  categorySlugs: [],
  publicationStatus: "published",
};

export const ProductForm = ({
  defaultValues,
  onSubmit,
  submitLabel = "商品を登録",
  isSkuDisabled = false,
}: ProductFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    defaultValues: {
      ...initialValues,
      ...defaultValues,
    },
  });

  const selectedCategorySlugs = watch("categorySlugs") ?? [];

  const {
    data: categories = [],
    isPending: isCategoriesPending,
    isError: isCategoriesError,
  } = useCategories();

  useEffect(() => {
    reset({
      ...initialValues,
      ...defaultValues,
    });
  }, [defaultValues, reset]);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const image = event.target.files?.[0];

    if (!image) {
      return;
    }

    setImageError("");

    const sku = getValues("sku").trim();

    if (!sku) {
      setImageError(
        "先にSKUを入力してから商品画像を選択してください。",
      );
      event.target.value = "";
      return;
    }

    if (image.type !== "image/png") {
      setImageError("PNG形式の画像を選択してください。");
      event.target.value = "";
      return;
    }

    const maxFileSize = 20 * 1024 * 1024;

    if (image.size > maxFileSize) {
      setImageError("画像サイズは20MB以下にしてください。");
      event.target.value = "";
      return;
    }

    try {
      setIsUploadingImage(true);

      const uploadedImage = await uploadProductImage(sku, image);

      setValue("imageKey", uploadedImage.key, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setImagePreviewUrl(uploadedImage.url);
    } catch {
      setImageError(
        "画像のアップロードに失敗しました。もう一度お試しください。",
      );
      event.target.value = "";
    } finally {
      setIsUploadingImage(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label
          htmlFor="sku"
          className="block text-sm font-medium text-gray-700"
        >
          SKU
        </label>

        <input
          id="sku"
          type="text"
          disabled={isSkuDisabled}
          placeholder="例: COFFEE-MORNING-200"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
          aria-invalid={Boolean(errors.sku)}
          {...register("sku", {
            required: "SKUを入力してください。",
          })}
        />

        {errors.sku?.message && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.sku.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700"
        >
          商品画像
        </label>

        <input
          id="image"
          ref={fileInputRef}
          type="file"
          accept="image/png"
          disabled={isUploadingImage}
          className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700 disabled:opacity-50"
          onChange={handleImageChange}
        />

        <input
          type="hidden"
          {...register("imageKey", {
            required: "商品画像をアップロードしてください。",
          })}
        />

        <p className="mt-1 text-xs text-gray-500">
          PNG形式、20MB以下。SKU入力後に画像を選択してください。
        </p>

        {isUploadingImage && (
          <p className="mt-2 text-sm text-blue-600">
            画像をアップロードしています...
          </p>
        )}

        {imageError && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {imageError}
          </p>
        )}

        {errors.imageKey?.message && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {errors.imageKey.message}
          </p>
        )}

        {imagePreviewUrl && (
          <div className="mt-4">
            <img
              src={imagePreviewUrl}
              alt="商品画像プレビュー"
              className="max-h-64 rounded-lg border border-gray-200 object-contain"
            />
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          商品名
        </label>

        <input
          id="name"
          type="text"
          placeholder="例: モーニングブレンド 200g"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          aria-invalid={Boolean(errors.name)}
          {...register("name", {
            required: "商品名を入力してください。",
          })}
        />

        {errors.name?.message && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          価格
        </label>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-gray-600">¥</span>

          <input
            id="price"
            type="number"
            min="1"
            placeholder="例: 1880"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            aria-invalid={Boolean(errors.price)}
            {...register("price", {
              valueAsNumber: true,
              required: "価格を入力してください。",
              min: {
                value: 1,
                message: "価格は1円以上で入力してください。",
              },
            })}
          />
        </div>

        {errors.price?.message && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.price.message}
          </p>
        )}
      </div>

      <div>
        <p className="block text-sm font-medium text-gray-700">
          カテゴリ
        </p>

        <input type="hidden" {...register("categorySlugs")} />

        <div className="mt-2">
          {isCategoriesPending && (
            <p className="text-sm text-gray-500">
              カテゴリーを読み込み中です...
            </p>
          )}

          {isCategoriesError && (
            <p className="text-sm text-red-600">
              カテゴリーの取得に失敗しました。
            </p>
          )}

          {!isCategoriesPending && !isCategoriesError && (
            <CategorySelectButtons
              categories={categories}
              selectedSlugs={selectedCategorySlugs}
              onChange={(nextSlugs) => {
                setValue("categorySlugs", nextSlugs, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
            />
          )}
        </div>
        {errors.categorySlugs?.message && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.categorySlugs.message}
          </p>
        )}

        <p className="mt-1 text-xs text-gray-500">
          複数のカテゴリーを選択できます。
        </p>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          商品説明
        </label>

        <textarea
          id="description"
          rows={5}
          placeholder="商品の説明を入力してください。"
          className="mt-1 w-full resize-y rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          aria-invalid={Boolean(errors.description)}
          {...register("description", {
            required: "商品説明を入力してください。",
          })}
        />

        {errors.description?.message && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.description.message}
          </p>
        )}
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-gray-700">
          公開状態
        </legend>

        <div className="mt-2 flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              value="published"
              {...register("publicationStatus")}
            />
            公開
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              value="unpublished"
              {...register("publicationStatus")}
            />
            非公開
          </label>
        </div>
      </fieldset>

      <div className="flex justify-end border-t border-gray-200 pt-6">
        <button
          type="submit"
          disabled={isSubmitting || isUploadingImage}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "登録中..."
            : isUploadingImage
              ? "画像アップロード中..."
              : submitLabel}
        </button>
      </div>
    </form>
  );
}
