/**
 * SkillProfile 型 / 自分のスキル情報
 *
 * Udemy: Understanding TypeScript
 * 対応レクチャー: interface / array / optional property / type alias
 *
 * 設計理由:
 * - SkillProfile は「アプリのドメインモデル（オブジェクトの形）」なので interface で定義する。
 *   interface は宣言マージや implements ができ、ドメインの実体を表すのに向く。
 *   （一方、union や複合型の別名には type を使う、と方針を分けている。例: status.ts）
 * - 経験技術・学習中技術・得意領域は複数持つので array(string[]) にする。
 * - 入力フォームから作る時点では id / created_at / updated_at は未確定なので、
 *   それらを除いた SkillProfileInput を Omit で派生させ、作成と取得の責務を型で分ける。
 */

export interface SkillProfile {
  id: number;
  summary: string; // 職務要約
  mainSkills: string[]; // 主な経験技術（例: Ruby, Rails, JavaScript）
  learningSkills: string[]; // 現在学習中の技術（例: TypeScript, React）
  strongPoints: string[]; // 得意領域（例: 既存コード調査, 影響範囲整理）
  desiredRoles: string[]; // 希望職種
  desiredWorkStyle: string; // 希望する働き方（例: フルリモート）
  experienceYears?: number; // 経験年数。未入力を許容するため optional
  createdAt: string; // ISO8601 文字列。JSON では日付も文字列で来るため string で受ける
  updatedAt: string;
}

/**
 * 登録・更新フォームから送る入力値の型。
 * サーバが採番/付与する id とタイムスタンプは含めない。
 * Omit を使うことで「SkillProfile の形が変わってもフォーム型が自動追従する」ようにする。
 */
export type SkillProfileInput = Omit<
  SkillProfile,
  "id" | "createdAt" | "updatedAt"
>;
