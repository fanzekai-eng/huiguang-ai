"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

export default function NavBar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // 登录页不展示导航
  if (pathname === "/login") return null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-sm font-bold text-white">
            绘
          </span>
          <span className="text-base font-semibold text-ink">绘光 AI</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="hidden rounded-lg px-3 py-2 text-sm text-ink-2 transition hover:bg-primary-light hover:text-primary sm:block"
          >
            首页
          </Link>
          <Link
            href="/generate"
            className="rounded-lg px-3 py-2 text-sm text-ink-2 transition hover:bg-primary-light hover:text-primary"
          >
            开始创作
          </Link>
          {user && (
            <Link
              href="/history"
              className="rounded-lg px-3 py-2 text-sm text-ink-2 transition hover:bg-primary-light hover:text-primary"
            >
              生成历史
            </Link>
          )}

          {user ? (
            <>
              <span
                title="每次生成消耗 20 积分"
                className="ml-1 flex items-center gap-1 rounded-full bg-primary-light px-3 py-1.5 text-xs font-semibold text-primary"
              >
                ⚡ {user.credits} 积分
              </span>
              <button
                onClick={logout}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-ink-2 transition hover:bg-bg"
              >
                退出
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark"
            >
              登录 / 注册
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
