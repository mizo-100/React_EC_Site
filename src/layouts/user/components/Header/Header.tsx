import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../../../../config/routes";
import { userSignout } from "../../../../features/auth/api/authApi";
import { useCart } from "../../../../features/user/hooks/useCart";
import { useAuthStore } from "../../../../stores/authStore";
import { Logo } from "../../../ui/Logo";

export const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);

  const { data: cart } = useCart();

  const totalQuantity = cart?.itemCount ?? 0;

  const closeUserMenu = () => {
    setIsUserMenuOpen(false);
  };

  const handleSignout = async () => {
    try {
      await userSignout();

      clearUser();
      closeUserMenu();
      navigate(routes.login, { replace: true });
    } catch {
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-270 items-center gap-6 px-4">
        <Link
          to={routes.home}
          className="flex shrink-0 items-center gap-2"
          aria-label="LH Shopのトップページ"
        >
          <Logo />
        </Link>

        <div className="relative min-w-0 flex-1">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>

          <input
            type="search"
            placeholder="商品を検索..."
            className="h-10 w-full rounded-full border border-gray-300 bg-gray-50 pl-11 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 sm:w-120"
          />
        </div>

        <div className="flex shrink-0 items-center gap-5">
          <Link
            to={routes.cart}
            aria-label="カートを見る"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 hover:text-blue-600"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H6" />
              <circle cx="9" cy="19" r="1" />
              <circle cx="18" cy="19" r="1" />
            </svg>

            {totalQuantity > 0 && (
              <span className="absolute -right-2 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {totalQuantity}
              </span>
            )}
          </Link>

          <div className="relative">
            <button
              type="button"
              aria-label="ユーザーメニューを開く"
              aria-expanded={isUserMenuOpen}
              onClick={() => setIsUserMenuOpen((open) => !open)}
              className="flex items-center gap-2 rounded-full hover:bg-gray-100"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="3" />
                  <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
                </svg>
              </span>

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`h-4 w-4 text-gray-500 transition ${
                  isUserMenuOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-12 z-20 w-44 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                <Link
                  to={routes.myPage}
                  onClick={closeUserMenu}
                  className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  マイページ
                </Link>

                {user ? (
                  <button
                    type="button"
                    onClick={handleSignout}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                  >
                    ログアウト
                  </button>
                ) : (
                  <Link
                    to={routes.login}
                    onClick={closeUserMenu}
                    className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    ログイン
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
