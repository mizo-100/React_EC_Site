import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { adminRoutes } from "../../../../config/admin/routes";
import { useCurrentAdmin } from "../../admins/api/adminAdminsApi";
import { useAdminCategories } from "../hooks/useAdminCategories";
import { useDeleteCategory } from "../hooks/useDeleteCategory";
import { useSaveCategories } from "../hooks/useSaveCategories";
import type { CategorySaveInput } from "../types/categorySave";

const createEmptyCategory = (): CategorySaveInput => ({
  slug: "",
  name: "",
});

export const CategoriesPage = () => {
  const { data: me } = useCurrentAdmin();
  const isViewer = me?.role === "viewer";

  const {
    data: categories = [],
    isPending,
    isError,
  } = useAdminCategories();

  const {
    mutate: saveCategories,
    isPending: isSaving,
    isSuccess: isSaveSuccess,
    isError: isSaveError,
  } = useSaveCategories();

  const {
    mutate: deleteCategory,
    isPending: isDeleting,
  } = useDeleteCategory();

  const [editableCategories, setEditableCategories] = useState<
    CategorySaveInput[]
  >([]);

  const [pageError, setPageError] = useState("");

  useEffect(() => {
    setEditableCategories(
      categories.map((category) => ({
        slug: category.slug,
        name: category.name,
      })),
    );
  }, [categories]);

  if (isViewer) {
    return <Navigate to={adminRoutes.products} replace />;
  }

  const updateCategory = (
    index: number,
    key: keyof CategorySaveInput,
    value: string,
  ) => {
    setPageError("");

    setEditableCategories((current) =>
      current.map((category, categoryIndex) =>
        categoryIndex === index
          ? {
              ...category,
              [key]: value,
            }
          : category,
      ),
    );
  };

  const addCategory = () => {
    setPageError("");

    setEditableCategories((current) => [
      ...current,
      createEmptyCategory(),
    ]);
  };

  const removeUnsavedCategory = (index: number) => {
    setPageError("");

    setEditableCategories((current) =>
      current.filter((_, categoryIndex) => categoryIndex !== index),
    );
  };

  const handleDelete = (slug: string) => {
    const isConfirmed = window.confirm(
      `「${slug}」を削除します。よろしいですか？`,
    );

    if (!isConfirmed) {
      return;
    }

    deleteCategory(slug);
  };

  const handleSave = () => {
    setPageError("");

    const normalizedCategories = editableCategories.map((category) => ({
      slug: category.slug.trim(),
      name: category.name.trim(),
    }));

    if (
      normalizedCategories.some(
        (category) => !category.slug || !category.name,
      )
    ) {
      setPageError(
        "すべてのカテゴリーに slug とカテゴリー名を入力してください。",
      );
      return;
    }

    const slugs = normalizedCategories.map((category) => category.slug);

    if (new Set(slugs).size !== slugs.length) {
      setPageError("slug が重複しています。");
      return;
    }

    saveCategories(normalizedCategories);
  };

  if (isPending) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <p className="text-sm text-gray-600">
          カテゴリーを読み込み中です...
        </p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <p className="text-sm text-red-600">
          カテゴリーの取得に失敗しました。
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">商品管理</p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            カテゴリー管理
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            商品に設定するカテゴリーを管理します。
          </p>
        </div>

        {!isViewer && (
          <button
            type="button"
            onClick={addCategory}
            disabled={isSaving || isDeleting}
            className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-bold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ＋ カテゴリーを追加
          </button>
        )}
      </div>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">
          <span>スラッグ</span>
          <span>カテゴリー名</span>
          <span>操作</span>
        </div>

        <div className="divide-y divide-gray-200">
          {editableCategories.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              カテゴリーがありません。
            </div>
          ) : (
            editableCategories.map((category, index) => {
              const isExistingCategory = categories.some(
                (existingCategory) =>
                  existingCategory.slug === category.slug,
              );

              return (
                <div
                  key={`${category.slug}-${index}`}
                  className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-4 px-4 py-3"
                >
                  <input
                    value={category.slug}
                    onChange={(event) =>
                      updateCategory(
                        index,
                        "slug",
                        event.target.value,
                      )
                    }
                    placeholder="例：coffee-beans"
                    className="min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />

                  <input
                    value={category.name}
                    onChange={(event) =>
                      updateCategory(
                        index,
                        "name",
                        event.target.value,
                      )
                    }
                    placeholder="例：コーヒー豆"
                    className="min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />

                  {!isViewer && (
                    <>
                      {isExistingCategory ? (
                        <button
                          type="button"
                          disabled={isSaving || isDeleting}
                          onClick={() => handleDelete(category.slug)}
                          className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          削除
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isSaving || isDeleting}
                          onClick={() => removeUnsavedCategory(index)}
                          className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          取り消し
                        </button>
                      )}
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-gray-200 px-4 py-4">
          <div>
            {pageError && (
              <p className="text-sm text-red-600">{pageError}</p>
            )}

            {isSaveError && (
              <p className="text-sm text-red-600">
                カテゴリーの保存に失敗しました。
              </p>
            )}

            {isSaveSuccess && (
              <p className="text-sm text-green-600">
                カテゴリーを保存しました。
              </p>
            )}
          </div>

          {!isViewer && (
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isDeleting}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "保存中..." : "変更を保存"}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
