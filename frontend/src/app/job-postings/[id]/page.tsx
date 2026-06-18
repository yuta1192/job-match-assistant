/**
 * 求人詳細画面（"/job-postings/[id]"）
 *
 * 学習テーマ:
 * - 動的ルート [id] とパラメータ取得（Next.js 16 では params が Promise。
 *   クライアントコンポーネントでは useParams() で読むのが簡潔）
 * - 複数の非同期取得を並行実行（Promise.all）
 * - loading / error / 成功 の条件レンダリング
 * - 子コンポーネント（AnalysisResultCard / GeneratedReplyCard）への props 受け渡し
 *
 * 設計理由:
 * - 求人本体・分析結果・返信文・面談メモを別々の取得関数にし、責務を分けている。
 *   実 API でもエンドポイントが分かれる想定なので、その構造を先に再現しておく。
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { STATUS_LABELS } from "@/types/status";
import type { JobPosting } from "@/types/job";
import type { AnalysisResult } from "@/types/analysis";
import type { GeneratedReply } from "@/types/reply";
import type { InterviewMemo } from "@/types/interview";
import {
  fetchJobPosting,
  fetchAnalysisResult,
  fetchReplies,
  fetchInterviewMemos,
  analyzeJob,
  generateReply,
} from "@/lib/api";
import { AnalysisResultCard } from "@/components/AnalysisResultCard";
import { GeneratedReplyCard } from "@/components/GeneratedReplyCard";

export default function JobPostingDetailPage() {
  // useParams は文字列を返すため number へ変換する（URL は常に文字列）
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [job, setJob] = useState<JobPosting | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [replies, setReplies] = useState<GeneratedReply[]>([]);
  const [memos, setMemos] = useState<InterviewMemo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // LLM 実行中の状態。ボタンの二重押下防止とエラー表示に使う。
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // 求人本体・分析・返信・メモをまとめて取得する。分析/生成の後にも呼び直す。
  const load = useCallback(async () => {
    const [jobRes, analysisRes, repliesRes, memosRes] = await Promise.all([
      fetchJobPosting(id),
      fetchAnalysisResult(id),
      fetchReplies(id),
      fetchInterviewMemos(id),
    ]);
    if (!jobRes.ok) {
      setError(jobRes.message);
    } else {
      setJob(jobRes.data);
      if (analysisRes.ok) setAnalysis(analysisRes.data);
      if (repliesRes.ok) setReplies(repliesRes.data);
      if (memosRes.ok) setMemos(memosRes.data);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  // 分析実行 → 成功したら再取得して画面を更新
  async function handleAnalyze() {
    setBusy(true);
    setActionError(null);
    const res = await analyzeJob(id);
    if (res.ok) {
      await load();
    } else {
      setActionError(res.message);
    }
    setBusy(false);
  }

  async function handleGenerateReply() {
    setBusy(true);
    setActionError(null);
    const res = await generateReply(id, "casual");
    if (res.ok) {
      await load();
    } else {
      setActionError(res.message);
    }
    setBusy(false);
  }

  if (loading) return <p className="text-gray-500">読み込み中...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!job) return null;

  return (
    <div className="space-y-8">
      {/* 求人情報 */}
      <section>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{job.companyName}</h1>
          <span className="rounded bg-gray-100 px-2 py-0.5 text-sm">
            {STATUS_LABELS[job.status]}
          </span>
        </div>
        <p className="mt-1 text-gray-700">{job.title}</p>
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block text-sm text-blue-600 hover:underline"
          >
            求人ページを開く
          </a>
        )}
        <p className="mt-3 whitespace-pre-wrap text-sm">{job.description}</p>
      </section>

      {/* 技術スタック */}
      <section>
        <h2 className="font-semibold">技術スタック</h2>
        <div className="mt-2 flex flex-wrap gap-1">
          {job.techStacks && job.techStacks.length > 0 ? (
            job.techStacks.map((tech) => (
              <span
                key={tech.id}
                className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800"
              >
                {tech.name}（{tech.importance}）
              </span>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              まだ抽出されていません。（Phase 5 で抽出を実装予定）
            </p>
          )}
        </div>
      </section>

      {actionError && <p className="text-sm text-red-600">{actionError}</p>}

      {/* マッチ分析 */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold">マッチ分析</h2>
          <button
            onClick={handleAnalyze}
            disabled={busy}
            className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {busy ? "実行中..." : "分析実行"}
          </button>
        </div>
        <AnalysisResultCard analysis={analysis} />
      </section>

      {/* 返信文 */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold">返信文案</h2>
          <button
            onClick={handleGenerateReply}
            disabled={busy}
            className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {busy ? "生成中..." : "返信文を生成"}
          </button>
        </div>
        <GeneratedReplyCard replies={replies} />
      </section>

      {/* 面談メモ */}
      <section>
        <h2 className="mb-2 font-semibold">面談メモ</h2>
        {memos.length === 0 ? (
          <p className="text-sm text-gray-500">まだ面談メモがありません。</p>
        ) : (
          <ul className="space-y-3">
            {memos.map((memo) => (
              <li key={memo.id} className="rounded-lg border p-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">{memo.interviewDate}</span>
                  {memo.interviewer && (
                    <span className="text-gray-500">{memo.interviewer}</span>
                  )}
                </div>
                <p className="mt-1 whitespace-pre-wrap">{memo.memo}</p>
                {memo.nextAction && (
                  <p className="mt-1 text-gray-600">次回: {memo.nextAction}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
