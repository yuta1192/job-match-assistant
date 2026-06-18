/**
 * JobPosting / JobTechStack 型 / 求人情報と抽出技術スタック
 *
 * Udemy: Understanding TypeScript
 * 対応レクチャー: interface / union type / literal type / optional property / Omit
 *
 * 設計理由:
 * - JobPosting / JobTechStack はドメインの実体なので interface で定義する。
 * - 雇用形態(employmentType)・技術カテゴリ(category)・重要度(importance)は
 *   取りうる値が有限なので literal union で固定する（status.ts と同じ考え方）。
 * - remoteAvailable は boolean。未取得を許容したい場面のため optional にしている。
 * - 求人本文から抽出した技術は JobTechStack[] として JobPosting にぶら下げ、
 *   「求人」と「その求人に紐づく技術」の親子関係を型で表現する。
 */

import type { ApplicationStatus } from "./status";

// 雇用形態。求人で頻出する区分に限定。該当なしは other で吸収する。
export type EmploymentType =
  | "full_time"
  | "contract"
  | "part_time"
  | "freelance"
  | "other";

// 技術スタックのカテゴリ。設計書 §8 の category 例に対応。
export type TechCategory =
  | "backend"
  | "frontend"
  | "infrastructure"
  | "database"
  | "ai"
  | "testing"
  | "devops"
  | "other";

// 求人内での技術の重要度。設計書 §8 の importance 例に対応。
export type TechImportance = "required" | "preferred" | "mentioned";

// 求人本文から LLM が抽出した技術1件。
export interface JobTechStack {
  id: number;
  jobPostingId: number;
  name: string; // 技術名（例: Rails, TypeScript, AWS）
  category: TechCategory;
  importance: TechImportance;
  createdAt: string;
  updatedAt: string;
}

// 求人情報の本体。
export interface JobPosting {
  id: number;
  companyName: string;
  title: string;
  description: string; // 求人本文。LLM 分析の入力になる
  url?: string; // 求人 URL。手入力時に無い場合があるため optional
  employmentType: EmploymentType;
  remoteAvailable?: boolean; // リモート可否。未取得を許容
  status: ApplicationStatus; // 応募ステータス（status.ts の union を参照）
  memo?: string; // 自由メモ
  techStacks?: JobTechStack[]; // 分析前は未抽出なので optional
  createdAt: string;
  updatedAt: string;
}

/**
 * 求人登録・編集フォームの入力型。
 * id / タイムスタンプ / 抽出結果(techStacks) はユーザーが入力しないので除外する。
 * status は登録時に "interested" 既定値を入れる想定で残している。
 */
export type JobPostingInput = Omit<
  JobPosting,
  "id" | "techStacks" | "createdAt" | "updatedAt"
>;
