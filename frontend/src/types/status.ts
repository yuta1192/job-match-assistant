/**
 * ApplicationStatus 型 / 応募ステータス
 *
 * Udemy: Understanding TypeScript
 * 対応レクチャー: literal type / union type / `as const`
 *
 * 設計理由:
 * - ステータスは「取りうる値が有限の集合」なので、文字列リテラルの union で固定する。
 *   これにより、存在しないステータス文字列をコンパイル時に弾ける（タイプミス防止）。
 * - enum ではなく union を選んだ理由: 値が文字列そのもので十分で、API(JSON)とそのまま
 *   やり取りできるため。enum は実行時コードを生成し、JSON との変換に一手間かかる。
 * - 画面表示用ラベルは `STATUS_LABELS` に分離し、「値」と「見せ方」の責務を分ける。
 */

// 応募ステータスの取りうる値。設計書 §6 の status 例と対応。
export type ApplicationStatus =
  | "interested" // 興味あり（未応募）
  | "replied" // 返信済み
  | "casual_interview" // カジュアル面談
  | "screening" // 書類選考
  | "coding_test" // コーディングテスト
  | "final_interview" // 最終面接
  | "offered" // 内定
  | "rejected" // 不採用
  | "declined"; // 辞退

/**
 * 画面のセレクトボックス等で全ステータスを列挙したいときに使う配列。
 * `as const` で各要素を読み取り専用のリテラル型に固定し、
 * 下の readonly 配列が `ApplicationStatus[]` と一致することを型で保証する。
 */
export const APPLICATION_STATUSES = [
  "interested",
  "replied",
  "casual_interview",
  "screening",
  "coding_test",
  "final_interview",
  "offered",
  "rejected",
  "declined",
] as const satisfies readonly ApplicationStatus[];

// 各ステータスの日本語表示ラベル。Record でキーの網羅性を型チェックできる
// （ApplicationStatus に値を増やすと、ここの定義漏れがコンパイルエラーになる）。
export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  interested: "興味あり",
  replied: "返信済み",
  casual_interview: "カジュアル面談",
  screening: "書類選考",
  coding_test: "コーディングテスト",
  final_interview: "最終面接",
  offered: "内定",
  rejected: "不採用",
  declined: "辞退",
};
