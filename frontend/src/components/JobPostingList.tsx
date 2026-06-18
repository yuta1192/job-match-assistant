/**
 * JobPostingList / 求人一覧の表示専用コンポーネント
 *
 * 学習テーマ:
 * - props で受け取る presentational component（データ取得は持たない）
 * - list rendering（map + key）
 * - 条件レンダリング（空のときの表示）
 * - next/link によるページ遷移
 *
 * 設計理由:
 * - データ取得(loading/error)は呼び出し側のページが担当し、このコンポーネントは
 *   「受け取った配列を描画するだけ」に責務を絞る。テストしやすく再利用しやすい。
 */

import Link from "next/link";
import type { JobPosting } from "@/types/job";
import { STATUS_LABELS } from "@/types/status";

type Props = {
  jobs: JobPosting[];
};

export function JobPostingList({ jobs }: Props) {
  // 条件レンダリング: 0件のときは一覧ではなく案内文を出す。
  if (jobs.length === 0) {
    return <p className="text-gray-500">求人がまだ登録されていません。</p>;
  }

  return (
    <ul className="space-y-3">
      {/* list rendering: 各要素に一意な key を渡す（React の差分更新に必要） */}
      {jobs.map((job) => (
        <li key={job.id} className="rounded-lg border p-4 hover:bg-gray-50">
          <Link href={`/job-postings/${job.id}`} className="block">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{job.companyName}</span>
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">
                {STATUS_LABELS[job.status]}
              </span>
            </div>
            <p className="mt-1 text-sm">{job.title}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {job.remoteAvailable && (
                <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-800">
                  リモート可
                </span>
              )}
              {/* 抽出済み技術スタックをバッジ表示。未抽出(undefined)は表示しない */}
              {job.techStacks?.map((tech) => (
                <span
                  key={tech.id}
                  className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
