"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import UpgradeModal from "@/components/UpgradeModal";
import {
  OPTION_GROUPS,
  DEFAULT_OPTIONS,
  type OptionKey,
} from "@/lib/options";
import { TEMPLATES, getTemplate } from "@/lib/templates";
import { buildPrompt } from "@/lib/promptBuilder";

type Selections = Record<OptionKey, string>;

export default function GenerateClient() {
  const { user, refresh, signInDaily } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");

  const [selections, setSelections] = useState<Selections>({
    ...DEFAULT_OPTIONS,
  });
  const [subject, setSubject] = useState("");
  const [extra, setExtra] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{
    imageUrl: string;
    prompt: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // 从首页/模板条进入时自动填充
  useEffect(() => {
    if (templateId) {
      const t = getTemplate(templateId);
      if (t) {
        queueMicrotask(() => {
          setSelections({ ...t.options });
          setSubject(t.subject);
          setExtra(t.extra ?? "");
        });
      }
    }
  }, [templateId]);

  const promptPreview = useMemo(
    () => buildPrompt({ ...selections, subject, extra }),
    [selections, subject, extra],
  );

  function toggle(key: OptionKey, id: string) {
    setSelections((s) => ({ ...s, [key]: s[key] === id ? s[key] : id }));
  }

  async function handleGenerate() {
    if (!subject.trim()) {
      setError("请先填写画面主体（要画什么）");
      return;
    }
    if (!user) {
      router.push("/login?next=/generate");
      return;
    }
    setError("");
    setGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...selections, subject, extra }),
      });
      const data = await res.json();
      if (res.status === 402) {
        setShowUpgrade(true);
        await refresh();
        return;
      }
      if (!res.ok) {
        setError(data.error || "生成失败，请稍后重试");
        return;
      }
      setResult({ imageUrl: data.imageUrl, prompt: data.prompt });
      await refresh();
      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);
    } catch {
      setError("网络异常，请稍后重试");
    } finally {
      setGenerating(false);
    }
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(promptPreview);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 剪贴板不可用时忽略
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* 模板快捷条 */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">热门模板</h2>
          <span className="text-xs text-ink-3">点一下自动填好选项，改一句话就能生成</span>
        </div>
        <div className="thin-scroll -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setSelections({ ...t.options });
                setSubject(t.subject);
                setExtra(t.extra ?? "");
                setResult(null);
              }}
              className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-ink-2 transition hover:border-primary hover:text-primary"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: t.accent }}
              />
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        {/* 左：创作设置 */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <h1 className="text-lg font-bold text-ink">创作设置</h1>

          <div className="mt-4 space-y-5">
            {OPTION_GROUPS.map((group) => (
              <div key={group.key}>
                <div className="mb-2 text-sm font-medium text-ink-2">
                  {group.label}
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => {
                    const active = selections[group.key] === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggle(group.key, item.id)}
                        className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                          active
                            ? "border border-primary bg-primary text-white"
                            : "border border-border bg-card text-ink-2 hover:border-primary/50 hover:text-primary"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div>
              <label className="mb-2 block text-sm font-medium text-ink-2">
                画面主体 <span className="text-primary">*</span>
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="比如：一只微笑的橘色小猫"
                className="w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-ink-2">
                补充要求（可选）
              </label>
              <textarea
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
                placeholder="比如：柔和光线，脸部特写"
                rows={2}
                className="w-full resize-none rounded-xl border border-border bg-bg px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-primary"
              />
            </div>
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <div className="mb-3 text-xs text-ink-3">
              每次生成消耗 <span className="font-semibold text-ink-2">1 积分</span>
              {user && (
                <span>
                  {" "}· 当前余额{" "}
                  <span className="font-semibold text-primary">
                    {user.credits}
                  </span>{" "}
                  积分
                </span>
              )}
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {generating ? "生成中，请稍候（约 10~30 秒）…" : "生成图片"}
            </button>
            {error && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                {error}
              </p>
            )}
          </div>
        </section>

        {/* 右：结果区 */}
        <section className="space-y-4">
          <div
            ref={resultRef}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <h2 className="mb-3 text-sm font-semibold text-ink">生成结果</h2>
            {result ? (
              <img
                src={result.imageUrl}
                alt="生成结果"
                className="w-full rounded-xl border border-border"
              />
            ) : (
              <div className="grid aspect-square w-full place-items-center rounded-xl border border-dashed border-border bg-bg">
                <div className="text-center">
                  <div className="text-4xl">🖼️</div>
                  <p className="mt-2 text-sm text-ink-3">
                    生成结果会显示在这里
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">
                自动组装的提示词
              </h2>
              <button
                onClick={copyPrompt}
                className="rounded-lg border border-border px-2.5 py-1 text-xs text-ink-2 transition hover:border-primary hover:text-primary"
              >
                {copied ? "已复制 ✓" : "复制"}
              </button>
            </div>
            <p className="rounded-xl bg-bg p-3 font-mono text-xs leading-relaxed text-ink-2">
              {promptPreview}
            </p>
          </div>
        </section>
      </div>

      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        credits={user?.credits}
        signedInToday={user?.signedInToday}
        onSignIn={signInDaily}
      />
    </div>
  );
}
