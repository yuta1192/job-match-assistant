/**
 * ホーム / ダッシュボード（ルート "/"）
 *
 * 学習テーマ:
 * - Next.js App Router: app/page.tsx が "/" に対応する
 * - server component（状態を持たない静的画面はデフォルトのサーバー描画でよい）
 * - next/link によるクライアントサイド遷移
 */

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Job Match Assistant</h1>
        <p className="mt-2 text-gray-600">
          求人とスキルプロフィールから、技術スタック抽出・マッチ分析・返信文案を生成する転職活動支援アプリです。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/job-postings"
          className="rounded-lg border p-4 hover:bg-gray-50"
        >
          <h2 className="font-semibold">求人一覧</h2>
          <p className="mt-1 text-sm text-gray-600">
            登録した求人の確認・分析・返信文の管理
          </p>
        </Link>
        <Link
          href="/skill-profile"
          className="rounded-lg border p-4 hover:bg-gray-50"
        >
          <h2 className="font-semibold">スキルプロフィール</h2>
          <p className="mt-1 text-sm text-gray-600">
            分析に使う自分のスキル情報を登録
          </p>
        </Link>
      </div>
    </div>
  );
}
