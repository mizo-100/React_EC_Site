import { Link } from "react-router-dom";
import { routes } from "../../../../config/routes";
import { Logo } from "../../../ui/Logo";
import { FooterLink } from "./FooterLink";

export const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-270 px-4">
        <div className="flex flex-col gap-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:py-6">
          <div className="flex items-center gap-2">
            < Logo />
          </div>

          <nav
            aria-label="フッターナビゲーション"
            className="flex flex-wrap gap-5 text-sm text-gray-500"
          >
            {FooterLink.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-blue-600"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-100 py-4 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between sm:py-5">
          <p>© 2026 LH Shop. All rights reserved.</p>

          <Link
            to={routes.adminLogin}
            className="transition hover:text-blue-600"
          >
            管理者ページへ
          </Link>
        </div>
      </div>
    </footer>
  );
}
