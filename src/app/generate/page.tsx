import { Suspense } from "react";
import GenerateClient from "./GenerateClient";

export default function GeneratePage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-sm text-ink-3">加载中…</div>
      }
    >
      <GenerateClient />
    </Suspense>
  );
}
