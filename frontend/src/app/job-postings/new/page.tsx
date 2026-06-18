/**
 * 求人登録画面（"/job-postings/new"）
 *
 * 学習テーマ:
 * - "use client"（フォーム送信後にルーター遷移するため）
 * - useRouter によるプログラム的なページ遷移（next/navigation）
 * - 子コンポーネント(JobPostingForm)からの onSubmit コールバック受け取り
 *
 * 設計理由:
 * - フォームの入力・バリデーションは JobPostingForm に閉じ込め、
 *   この画面は「送信後にどうするか（保存・遷移）」だけを担当する。
 * - Phase 2 では保存先 API が無いので、いったん console 出力＋一覧へ戻すだけ。
 *   Phase 3 で onSubmit 内を実 API 呼び出しに差し替える。
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { JobPostingForm } from "@/components/JobPostingForm";
import { createJobPosting } from "@/lib/api";
import type { JobPostingInput } from "@/types/job";

export default function NewJobPostingPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(input: JobPostingInput) {
    const res = await createJobPosting(input);
    if (res.ok) {
      // 登録成功 → 一覧へ戻る。refresh で再取得させる
      router.push("/job-postings");
      router.refresh();
    } else {
      setError(res.message);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">求人登録</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <JobPostingForm onSubmit={handleSubmit} />
    </div>
  );
}
