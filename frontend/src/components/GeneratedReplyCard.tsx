/**
 * GeneratedReplyCard / 生成された返信文の表示カード
 *
 * 学習テーマ:
 * - props / list rendering / 条件レンダリング
 * - literal union (ReplyTone) のラベル変換（REPLY_TONE_LABELS）
 *
 * 設計理由:
 * - 1求人に複数トーンの返信文を持てる設計なので、配列を受け取り map で並べる。
 */

import type { GeneratedReply } from "@/types/reply";
import { REPLY_TONE_LABELS } from "@/types/reply";

type Props = {
  replies: GeneratedReply[];
};

export function GeneratedReplyCard({ replies }: Props) {
  if (replies.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        まだ返信文がありません。（Phase 5 で「返信文生成」を実装予定）
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {replies.map((reply) => (
        <div key={reply.id} className="rounded-lg border p-4">
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">
            {REPLY_TONE_LABELS[reply.tone]}
          </span>
          {/* whitespace-pre-wrap で改行を保持して表示 */}
          <p className="mt-2 whitespace-pre-wrap text-sm">{reply.body}</p>
        </div>
      ))}
    </div>
  );
}
