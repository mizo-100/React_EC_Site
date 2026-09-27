import { Link } from "react-router-dom";
import { adminRoutes } from "../../../../config/admin/routes";
import { adminAuthStore } from "../../../../stores/adminAuthStore ";

const summaryCards = [
  {
    label: "登録商品数",
    value: "-",
    description: "登録されている商品",
  },
  {
    label: "公開中の商品",
    value: "-",
    description: "ユーザー側に表示中",
  },
  {
    label: "非公開の商品",
    value: "-",
    description: "下書き・非公開の商品",
  },
  {
    label: "カテゴリ数",
    value: "-",
    description: "登録されているカテゴリ",
  },
] as const;

export const DashboardPage = () => {
  const admin = adminAuthStore((state) => state.admin);

  return (
    <div className="mx-auto max-w-7xl p-6">
      <section className="mb-8">
        <p className="text-sm text-slate-500">ダッシュボード</p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          {admin?.name ?? "管理者"}さん、おかえりなさい
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          商品・カテゴリの登録や公開状態の管理を行えます。
        </p>
      </section>

      <section
        aria-label="集計"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {summaryCards.map((card) => (
          <article
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">
              {card.label}
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {card.value}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              {card.description}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            クイック操作
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            よく使う管理機能へすぐに移動できます。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Link
            to={adminRoutes.productNew}
            className="group rounded-xl border border-blue-200 bg-blue-600 p-5 text-white shadow-sm transition hover:bg-blue-700 hover:shadow"
          >
            <p className="text-sm text-blue-100">商品管理</p>

            <p className="mt-2 text-lg font-bold">
              商品を新規登録
            </p>

            <p className="mt-4 text-sm text-blue-100 group-hover:text-white">
              登録画面へ →
            </p>
          </Link>

          <Link
            to={adminRoutes.products}
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow"
          >
            <p className="text-sm text-slate-500">商品管理</p>

            <p className="mt-2 text-lg font-bold text-slate-900">
              商品一覧を確認
            </p>

            <p className="mt-4 text-sm font-semibold text-blue-600">
              商品一覧へ →
            </p>
          </Link>

          <Link
            to={adminRoutes.categories}
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow"
          >
            <p className="text-sm text-slate-500">カテゴリ管理</p>

            <p className="mt-2 text-lg font-bold text-slate-900">
              カテゴリを管理
            </p>

            <p className="mt-4 text-sm font-semibold text-blue-600">
              カテゴリ管理へ →
            </p>
          </Link>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          お知らせ
        </h2>

        <div className="mt-4 rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          現在、お知らせはありません。
        </div>
      </section>
    </div>
  );
}
