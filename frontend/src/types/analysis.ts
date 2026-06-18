/**
 * AnalysisResult 型 / LLM によるマッチ分析結果
 *
 * Udemy: Understanding TypeScript
 * 対応レクチャー: interface / array(string[]) / optional property
 *
 * 設計理由:
 * - 分析結果はドメインの実体なので interface。
 * - 「マッチ点」「足りない点」などは箇条書きで複数返るので string[] で受ける。
 *   画面ではそのまま <ul><li> で並べられる形にしておく。
 * - rawResponse は LLM の生レスポンス文字列を保持する。保存する理由:
 *   (1) 出力の再現性・デバッグ、(2) プロンプト改善の根拠、(3) パース失敗時の調査。
 *   画面表示には使わないので optional（一覧取得では省く想定）。
 */

// 求人とスキルプロフィールを突き合わせた分析結果1件。
export interface AnalysisResult {
  id: number;
  jobPostingId: number;
  matchedPoints: string[]; // マッチしている点
  weakPoints: string[]; // 足りない点 / 不足スキル
  concerns: string[]; // 想定される懸念
  interviewQuestions: string[]; // 面談で確認すべき質問
  suggestedPositioning: string; // 面談での自分の見せ方（まとまった文章）
  rawResponse?: string; // LLM の生レスポンス。デバッグ・再現用
  createdAt: string;
  updatedAt: string;
}

/**
 * 分析 API(POST /api/job_postings/:id/analyze) が返す本体の型。
 * 分析結果に加え、同時に抽出・保存された技術スタックも返す想定。
 * （job.ts の JobTechStack を再利用し、型の二重定義を避ける）
 */
export type { JobTechStack } from "./job";
