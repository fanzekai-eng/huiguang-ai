"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

interface HistoryItem {
  id: string;
  imageUrl: string;
  subject: string;
  prompt: string;
  size: string;
  createdAt: string;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<HistoryItem | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      setItems(data.items ?? []);
      setCredits(data.credits ?? 0);
    } catch {
      // 忽略错误
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const totalGenerated = items.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-xl font-bold text-ink">生成历史</h1>

      {/* 统计卡片 */}
      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-xs text-ink-3">累计生成</div>
          <div className="mt-1 text-2xl font-bold text-ink">
            {totalGenerated}
            <span className="ml-1 text-sm font-normal text-ink-3">张</span>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-xs text-ink-3">剩余积分</div>
          <div className="mt-1 text-2xl font-bold text-primary">
            {credits ?? user?.credits ?? 0}
            <span className="ml-1 text-sm font-normal text-ink-3">分</span>
          </div>
        </div>
      </div>

      {/* 列表 */}
      {loading ? (
        <div className="mt-10 text-center text-sm text-ink-3">加载中…</div>
      ) : items.length === 0 ? (
        <div className="mt-14 rounded-2xl border border-dashed border-border bg-card py-16 text-center">
          <div className="text-4xl">🎨</div>
          <p className="mt-3 text-sm text-ink-2">还没有生成记录</p>
          <Link
            href="/generate"
            className="mt-4 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark"
          >
            去创作第一张
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setLightbox(item)}
              className="group overflow-hidden rounded-2xl border border-border bg-card text-left transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="aspect-square overflow-hidden bg-bg">
                <img
                  src={item.imageUrl}
                  alt={item.subject}
                  loading="lazy"
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <div className="truncate text-sm font-medium text-ink">
                  {item.subject}
                </div>
                <div className="mt-0.5 text-xs text-ink-3">
                  {new Date(item.createdAt).toLocaleString("zh-CN", {
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  · {item.size} · 20 积分
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 大图查看 */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-card p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.imageUrl}
              alt={lightbox.subject}
              className="max-h-[60vh] w-full rounded-xl object-contain"
            />
            <div className="mt-3 text-sm font-semibold text-ink">
              {lightbox.subject}
            </div>
            <p className="mt-1 line-clamp-2 font-mono text-xs leading-relaxed text-ink-2">
              {lightbox.prompt}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-ink-3">
                {new Date(lightbox.createdAt).toLocaleString("zh-CN")}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setLightbox(null)}
                  className="rounded-lg border border-border px-3.5 py-1.5 text-xs text-ink-2 transition hover:bg-bg"
                >
                  关闭
                </button>
                <a
                  href={lightbox.imageUrl}
                  download={`huiguang-${lightbox.id}.png`}
                  className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-primary-dark"
                >
                  下载图片
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
