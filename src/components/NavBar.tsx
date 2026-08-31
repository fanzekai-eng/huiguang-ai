"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./AuthProvider";

export default function NavBar() {
  const { user, logout, signInDaily } = useAuth();
  const pathname = usePathname();
  const [signing, setSigning] = useState(false);
  const [signMsg, setSignMsg] = useState("");

  async function handleSignIn() {
    if (!user || signing) return;
    setSigning(true);
    const res = await signInDaily();
    setSigning(false);
    setSignMsg(res.ok ? `+5 积分已到账` : res.already ? "今天已经签过啦" : "签到失败");
    setTimeout(() => setSignMsg(""), 2000);
  }

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
              <button
                onClick={handleSignIn}
                disabled={user.signedInToday || signing}
                className={`ml-1 flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  user.signedInToday
                    ? "cursor-default bg-bg text-ink-3"
                    : "bg-primary text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                }`}
                title={
                  user.signedInToday
                    ? "今天已签到，明天再来吧"
                    : "每日签到领 5 积分"
                }
              >
                {signing
                  ? "签到中…"
                  : signMsg
                    ? signMsg
                    : user.signedInToday
                      ? "今日已签到 ✓"
                      : "签到 +5"}
              </button>
              <span
                title="每次生成消耗 1 积分"
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
