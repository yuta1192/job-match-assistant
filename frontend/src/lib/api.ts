/**
 * API クライアント / Rails API への実 fetch
 *
 * 役割:
 * - Phase 2 の mockApi.ts を置き換える本物の通信層。関数シグネチャ（戻り値 ApiResult<T>）は
 *   mockApi と同じに保つため、画面コンポーネントは変更なしで実 API に切り替わる。
 *
 * 学習テーマ:
 * - fetch / async / Promise
 * - generics（request<T> で中身の型だけ差し替える）
 * - 判別可能 union（HTTP の成否を ApiResult<T> の ok に変換し、画面で型安全に分岐）
 * - 環境変数（NEXT_PUBLIC_ 接頭辞でブラウザに露出する接続先）
 */

import type { ApiPromise } from "@/types/api";
import type { JobPosting, JobPostingInput } from "@/types/job";
import type { SkillProfile, SkillProfileInput } from "@/types/skill";
import type { AnalysisResult } from "@/types/analysis";
import type { GeneratedReply } from "@/types/reply";
import type { InterviewMemo } from "@/types/interview";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api";

// 全リクエスト共通の薄いラッパ。HTTP の成否を ApiResult<T> に変換する。
async function request<T>(path: string, init?: RequestInit): ApiPromise<T> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...init,
    });

    if (!res.ok) {
      // Rails 側はエラー時 { message } を返す。無ければステータスを表示。
      const body = await res.json().catch(() => null);
      return {
        ok: false,
        message: body?.message ?? `通信エラー (HTTP ${res.status})`,
        status: res.status,
      };
    }

    // 204 No Content（削除など）は本文が無い
    if (res.status === 204) {
      return { ok: true, data: undefined as T };
    }

    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch {
    // ネットワーク到達不可（サーバー未起動など）
    return { ok: false, message: "サーバーに接続できませんでした" };
  }
}

// --- JobPosting ---
export function fetchJobPostings(): ApiPromise<JobPosting[]> {
  return request<JobPosting[]>("/job_postings");
}

export function fetchJobPosting(id: number): ApiPromise<JobPosting> {
  return request<JobPosting>(`/job_postings/${id}`);
}

export function createJobPosting(
  input: JobPostingInput,
): ApiPromise<JobPosting> {
  return request<JobPosting>("/job_postings", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// --- SkillProfile ---
export function fetchSkillProfile(): ApiPromise<SkillProfile> {
  return request<SkillProfile>("/skill_profile");
}

export function updateSkillProfile(
  input: SkillProfileInput,
): ApiPromise<SkillProfile> {
  return request<SkillProfile>("/skill_profile", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

// --- 生成系（LLM / Phase 5）---
export function analyzeJob(id: number): ApiPromise<AnalysisResult> {
  return request<AnalysisResult>(`/job_postings/${id}/analyze`, {
    method: "POST",
  });
}

export function generateReply(
  id: number,
  tone: GeneratedReply["tone"] = "casual",
): ApiPromise<GeneratedReply> {
  return request<GeneratedReply>(`/job_postings/${id}/generate_reply`, {
    method: "POST",
    body: JSON.stringify({ tone }),
  });
}

// --- 求人にぶら下がる読み取り系 ---
export function fetchAnalysisResult(
  jobPostingId: number,
): ApiPromise<AnalysisResult | null> {
  return request<AnalysisResult | null>(
    `/job_postings/${jobPostingId}/analysis_result`,
  );
}

export function fetchReplies(
  jobPostingId: number,
): ApiPromise<GeneratedReply[]> {
  return request<GeneratedReply[]>(
    `/job_postings/${jobPostingId}/generated_replies`,
  );
}

export function fetchInterviewMemos(
  jobPostingId: number,
): ApiPromise<InterviewMemo[]> {
  return request<InterviewMemo[]>(
    `/job_postings/${jobPostingId}/interview_memos`,
  );
}
