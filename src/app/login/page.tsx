"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [mockCode, setMockCode] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSendCode() {
    if (!/^1\d{10}$/.test(phone)) {
      setError("请输入正确的 11 位手机号");
      return;
    }
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "发送失败");
        return;
      }
      setMockCode(data.code);
      setCode(data.code); // 测试环境自动填入
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } finally {
      setSending(false);
    }
  }

  async function handleLogin() {
    if (!/^1\d{10}$/.test(phone)) {
      setError("请输入正确的 11 位手机号");
      return;
    }
    if (!code) {
      setError("请先获取验证码");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "登录失败");
        return;
      }
      await refresh();
      const next = searchParams.get("next");
      router.push(next ? decodeURIComponent(next) : "/generate");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-0px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-border bg-card p-7 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-sm font-bold text-white">
              绘
            </span>
            <span className="text-lg font-semibold text-ink">绘光 AI</span>
          </div>
          <h1 className="mt-5 text-xl font-bold text-ink">登录 / 注册</h1>
          <p className="mt-1 text-sm text-ink-2">
            新用户登录即送{" "}
            <span className="font-semibold text-primary">500 积分</span>
          </p>

          <div className="mt-6 space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-2">
                手机号
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入 11 位手机号"
                inputMode="numeric"
                maxLength={11}
                className="w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-2">
                验证码
              </label>
              <div className="flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="请输入验证码"
                  inputMode="numeric"
                  maxLength={6}
                  className="w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-primary"
                />
                <button
                  onClick={handleSendCode}
                  disabled={sending || countdown > 0}
                  className="shrink-0 rounded-xl border border-primary px-3.5 text-xs font-medium text-primary transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {countdown > 0 ? `${countdown}s 后重发` : sending ? "发送中…" : "获取验证码"}
                </button>
              </div>
            </div>

            {mockCode && (
              <div className="rounded-xl bg-primary-light px-3.5 py-2.5 text-xs text-primary">
                🔑 测试环境验证码：<span className="font-mono font-bold">{mockCode}</span>
                （已自动填入，正式版接入短信后此提示消失）
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 px-3.5 py-2.5 text-xs text-red-600">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={submitting}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "登录中…" : "登录 / 注册"}
            </button>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-ink-3">
          登录即代表同意使用条款与隐私政策（第一版为演示环境）
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-sm text-ink-3">加载中…</div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
