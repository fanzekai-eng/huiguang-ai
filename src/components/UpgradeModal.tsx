"use client";

import { useState } from "react";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  credits?: number;
  signedInToday?: boolean;
  onSignIn?: () => Promise<unknown>;
}

export default function UpgradeModal({
  open,
  onClose,
  credits,
  signedInToday,
  onSignIn,
}: UpgradeModalProps) {
  const [signing, setSigning] = useState(false);

  if (!open) return null;

  async function handleSignIn() {
    if (!onSignIn || signing) return;
    setSigning(true);
    try {
      await onSignIn();
      onClose(); // 签到成功积分到账，关闭弹窗即可继续生成
    } finally {
      setSigning(false);
    }
  }

  const canSignIn = !signedInToday && !!onSignIn;

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
          ，生成一张图片需要 1 积分。
        </p>

        {canSignIn ? (
          <button
            onClick={handleSignIn}
            disabled={signing}
            className="mt-4 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {signing ? "签到中…" : "签到领 5 积分，马上就能生成 🎁"}
          </button>
        ) : (
          <>
            <div className="mt-4 rounded-xl border border-dashed border-primary/40 bg-primary-light/60 px-4 py-3 text-center text-sm text-primary">
              今日已签到，明天再来领 5 积分；
              升级方案即将上线，敬请期待 🎉
            </div>
            <button
              title="第一版暂未开放支付，入口已预留"
              className="mt-3 w-full cursor-not-allowed rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white opacity-60"
            >
              去升级
            </button>
          </>
        )}

        <div className="mt-3">
          <button
            onClick={onClose}
            className="w-full rounded-xl border border-border px-4 py-2.5 text-sm text-ink-2 transition hover:bg-bg"
          >
            稍后再试
          </button>
        </div>
      </div>
    </div>
  );
}
