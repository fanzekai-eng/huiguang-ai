import Link from "next/link";
import { TEMPLATES } from "@/lib/templates";

const STEPS = [
  {
    icon: "🎯",
    title: "选模板或勾选设置",
    desc: "图片类型、比例、风格、场景、留白，点点就选好",
  },
  {
    icon: "✏️",
    title: "填一句画面主体",
    desc: "用大白话描述想画什么，不用懂任何专业术语",
  },
  {
    icon: "✨",
    title: "一键生成图片",
    desc: "系统自动组装专业提示词，AI 帮你出图",
  },
];

const FEATURES = [
  {
    icon: "🧠",
    title: "自动组装专业提示词",
    desc: "不用学 prompt，系统把选项翻译成 GPT Image 专业指令",
  },
  {
    icon: "🎨",
    title: "10 大热门模板",
    desc: "头像、壁纸、海报、商品图、表情包，套模板 10 秒出图",
  },
  {
    icon: "🎁",
    title: "每天签到领 5 积分",
    desc: "每天签到送 5 积分，生成一张图只需 1 积分",
  },
  {
    icon: "☁️",
    title: "生成历史云保存",
    desc: "所有作品自动保存，随时查看和下载",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-8">
        <div className="rounded-3xl bg-gradient-to-br from-primary via-accent to-primary-dark px-6 py-14 text-center text-white sm:py-16">
          <p className="mx-auto mb-3 inline-block rounded-full bg-white/15 px-4 py-1 text-xs font-medium backdrop-blur">
            无需懂提示词 · 人人都会用的 AI 图片工具
          </p>
          <h1 className="mx-auto max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
            把想法变成图片，
            <br className="sm:hidden" />
            只需 10 秒
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
            选模板、改一句话、点生成。系统自动帮你组装专业提示词，
            头像、壁纸、海报、商品图都能做。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/generate"
              className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-primary shadow-lg transition hover:bg-primary-light"
            >
              开始创作
            </Link>
            <a
              href="#templates"
              className="rounded-full border border-white/40 px-7 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              浏览模板
            </a>
          </div>
        </div>
      </section>

      {/* 三步流程 */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-light text-xl">
                  {s.icon}
                </span>
                <span className="text-xs font-bold text-ink-3">
                  第 {i + 1} 步
                </span>
              </div>
              <h3 className="mt-3 text-base font-semibold text-ink">
                {s.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 热门模板 */}
      <section id="templates" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-8">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-ink">热门模板</h2>
            <p className="mt-1 text-sm text-ink-2">
              点击模板进入创作，选项自动填好，改一句话就能生成
            </p>
          </div>
          <Link
            href="/generate"
            className="hidden rounded-full border border-border px-4 py-2 text-sm text-primary transition hover:bg-primary-light sm:block"
          >
            自定义创作 →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {TEMPLATES.map((t) => (
            <Link
              key={t.id}
              href={`/generate?template=${t.id}`}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className="relative flex aspect-[4/3] items-center justify-center overflow-hidden"
                style={{ background: t.preview }}
              >
                <span
                  className="absolute h-20 w-20 rounded-full opacity-80 transition group-hover:scale-110"
                  style={{
                    background: `radial-gradient(circle, ${t.accent}66, transparent 70%)`,
                  }}
                />
                <span className="relative text-3xl">🎨</span>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-ink">{t.name}</h3>
                  <span className="rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-medium text-primary">
                    {t.audience}
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink-2">{t.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 功能亮点 */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <span className="text-2xl">{f.icon}</span>
              <h3 className="mt-2 text-sm font-semibold text-ink">{f.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-ink-2">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/generate"
            className="inline-block rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            立即免费创作 →
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-ink-3">
        © 2026 绘光 AI · 让 AI 帮你出图
      </footer>
    </div>
  );
}
