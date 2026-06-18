/**
 * GeneratedReply 型 / LLM が生成した返信文案
 *
 * Udemy: Understanding TypeScript
 * 対応レクチャー: interface / literal type / union type
 *
 * 設計理由:
 * - 返信文の本体はドメインの実体なので interface。
 * - tone（文体）は有限の選択肢なので literal union で固定し、
 *   将来「複数トーンを出し分ける」機能でもタイプミスを型で防ぐ。
 * - 1求人に対して複数の返信文案を持てるよう、配列で扱える単位として設計する。
 */

// 返信文の文体。設計書 §8 GeneratedReply の tone 例に対応。
export type ReplyTone =
  | "casual" // カジュアル（まずは話したい温度感）
  | "polite" // 丁寧
  | "concise"; // 簡潔

// tone のラベル。セレクトボックス等の表示用。Record で網羅性を型チェック。
export const REPLY_TONE_LABELS: Record<ReplyTone, string> = {
  casual: "カジュアル",
  polite: "丁寧",
  concise: "簡潔",
};

// 生成された返信文1件。
export interface GeneratedReply {
  id: number;
  jobPostingId: number;
  body: string; // 返信文本文
  tone: ReplyTone;
  createdAt: string;
  updatedAt: string;
}
