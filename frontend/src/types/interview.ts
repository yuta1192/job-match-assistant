/**
 * InterviewMemo 型 / 面談メモ
 *
 * Udemy: Understanding TypeScript
 * 対応レクチャー: interface / literal type / optional property / Omit
 *
 * 設計理由:
 * - 面談メモはドメインの実体なので interface。
 * - 志望度(motivationLevel)は 1〜5 の段階評価。数値の literal union で範囲を型で縛り、
 *   6 や 0 のような不正値をコンパイル時に弾く。
 * - interviewDate は日付だが、API(JSON)では文字列で来るため string("YYYY-MM-DD")で受ける。
 *   Date 型に変換するのは表示直前に行い、型の境界では文字列に統一する。
 * - 担当者・次回アクション等は未記入を許容するため optional。
 */

// 志望度。1=低い 〜 5=高い の5段階に限定。
export type MotivationLevel = 1 | 2 | 3 | 4 | 5;

// 面談1回分のメモ。
export interface InterviewMemo {
  id: number;
  jobPostingId: number;
  interviewDate: string; // "YYYY-MM-DD" 形式の文字列
  interviewer?: string; // 担当者名（不明な場合があるため optional）
  memo: string; // 話した内容
  technicalNotes?: string; // 技術的な印象
  concerns?: string; // 懸念点
  nextAction?: string; // 次回アクション
  motivationLevel?: MotivationLevel; // 志望度（未評価を許容）
  createdAt: string;
  updatedAt: string;
}

/**
 * 面談メモ登録・編集フォームの入力型。
 * id / タイムスタンプは除外。jobPostingId はどの求人のメモかを示すため残す。
 */
export type InterviewMemoInput = Omit<
  InterviewMemo,
  "id" | "createdAt" | "updatedAt"
>;
