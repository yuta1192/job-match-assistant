/**
 * 求人一覧画面（"/job-postings"）
 *
 * 学習テーマ:
 * - "use client"（useState/useEffect を使うためクライアントコンポーネント）
 * - データ取得の3状態管理: loading / error / 成功（条件レンダリングで出し分け）
 * - useEffect でマウント時に非同期取得（@/lib/api 経由で Rails API を fetch）
 * - 判別可能 union（res.ok）で成功/失敗を型安全に分岐
 *
 * 設計理由:
 * - 取得処理(loading/error)はこのページが持ち、描画は JobPostingList に委ねる。
 * - Phase 2 の mockApi から @/lib/api(実 fetch)へ差し替えたが、画面構造は無変更で済んだ。
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { JobPostingList } from "@/components/JobPostingList";
import { fetchJobPostings } from "@/lib/api";
import type { JobPosting } from "@/types/job";

export default function JobPostingsPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // マウント時に一度だけ取得する（依存配列が空）
    let active = true; // アンマウント後の state 更新を防ぐフラグ
    fetchJobPostings().then((res) => {
      if (!active) return;
      if (res.ok) {
        setJobs(res.data);
      } else {
        setError(res.message);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">求人一覧</h1>
        <Link
          href="/job-postings/new"
          className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
        >
          新規登録
        </Link>
      </div>

      {/* 条件レンダリングで loading / error / 成功 を出し分ける */}
      {loading && <p className="text-gray-500">読み込み中...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && <JobPostingList jobs={jobs} />}
    </div>
  );
}
