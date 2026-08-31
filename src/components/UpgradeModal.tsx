"use client";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  credits?: number;
}

export default function UpgradeModal({
  open,
  onClose,
  credits,
}: UpgradeModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary-light text-2xl">
          ⚡
        </div>
        <h2 className="mt-3 text-center text-lg font-bold text-ink">
          积分不足
        </h2>
        <p className="mt-2 text-center text-sm leading-relaxed text-ink-2">
          当前余额{" "}
          <span className="font-semibold text-primary">
            {credits ?? 0} 积分
          </span>
          ，生成一张图片需要 20 积分。
        </p>

        <div className="mt-4 rounded-xl border border-dashed border-primary/40 bg-primary-light/60 px-4 py-3 text-center text-sm text-primary">
          升级方案即将上线，敬请期待 🎉
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm text-ink-2 transition hover:bg-bg"
          >
            稍后再试
          </button>
          <button
            title="第一版暂未开放支付，入口已预留"
            className="flex-1 cursor-not-allowed rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white opacity-60"
          >
            去升级
          </button>
        </div>
      </div>
    </div>
  );
}
