/**
 * JobPostingForm / 求人登録フォーム
 *
 * 学習テーマ:
 * - "use client"（フォームは状態とイベントを持つのでクライアントコンポーネント）
 * - useState による制御コンポーネント（入力値を React state で管理）
 * - イベントハンドリング（onChange / onSubmit）
 * - 簡易バリデーションと条件レンダリング（エラーメッセージ表示）
 *
 * 設計理由:
 * - 送信値は Phase 1 の JobPostingInput 型に合わせる。型に沿わない項目は持たない。
 * - Phase 2 では実 API が無いので、送信時は onSubmit コールバックに値を渡すだけにし、
 *   「保存処理」は呼び出し側 / Phase 3 の API 連携に委ねる（責務分離）。
 */

"use client";

import { useState } from "react";
import type { JobPostingInput } from "@/types/job";

type Props = {
  // 送信された入力値を親に渡す。保存方法は親が決める。
  onSubmit: (input: JobPostingInput) => void;
};

export function JobPostingForm({ onSubmit }: Props) {
  // 制御コンポーネント: 各入力値を state で保持する。
  const [companyName, setCompanyName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [remoteAvailable, setRemoteAvailable] = useState(false);
  const [memo, setMemo] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // ブラウザのデフォルト送信(リロード)を止める

    // 簡易バリデーション: 必須項目が空なら送信しない。
    if (!companyName.trim() || !title.trim() || !description.trim()) {
      setError("会社名・求人タイトル・求人本文は必須です。");
      return;
    }
    setError(null);

    onSubmit({
      companyName: companyName.trim(),
      title: title.trim(),
      description: description.trim(),
      url: url.trim() || undefined, // 空なら optional として undefined にする
      employmentType: "full_time", // Phase 2 では固定。Phase 後半でセレクト化
      remoteAvailable,
      status: "interested", // 新規登録時の初期ステータス
      memo: memo.trim() || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 条件レンダリング: エラーがあるときだけ表示 */}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <Field label="会社名 *">
        <input
          className="w-full rounded border px-3 py-2"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </Field>

      <Field label="求人タイトル *">
        <input
          className="w-full rounded border px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Field>

      <Field label="求人URL">
        <input
          className="w-full rounded border px-3 py-2"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </Field>

      <Field label="求人本文 *">
        <textarea
          className="h-32 w-full rounded border px-3 py-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={remoteAvailable}
          onChange={(e) => setRemoteAvailable(e.target.checked)}
        />
        リモート可
      </label>

      <Field label="メモ">
        <textarea
          className="h-20 w-full rounded border px-3 py-2"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </Field>

      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        登録する
      </button>
    </form>
  );
}

// ラベルと入力をまとめる小さなレイアウト部品。フォーム内の重複を減らす。
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
