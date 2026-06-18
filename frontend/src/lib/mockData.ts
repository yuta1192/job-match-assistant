/**
 * モックデータ / Phase 2 用の仮データ
 *
 * 役割:
 * - Phase 3 で Rails API を作るまでの間、画面表示を確認するための仮データ。
 * - Phase 1 で定義した型（@/types/*）にそのまま適合させることで、
 *   「型を先に決める → 画面とデータが型に従う」という流れを実地で確認する。
 *
 * 設計理由:
 * - 実 API ができたら、このファイルへの import を API 呼び出しに差し替えるだけで済むよう、
 *   データ定義（ここ）と取得処理（mockApi.ts）を分けている。
 */

import type { JobPosting } from "@/types/job";
import type { SkillProfile } from "@/types/skill";
import type { AnalysisResult } from "@/types/analysis";
import type { GeneratedReply } from "@/types/reply";
import type { InterviewMemo } from "@/types/interview";

export const mockSkillProfile: SkillProfile = {
  id: 1,
  summary:
    "Ruby on Rails を中心に業務系 Web アプリの開発・改修・保守運用を経験。既存コード調査と安全な改修が得意。",
  mainSkills: ["Ruby", "Ruby on Rails", "JavaScript", "PostgreSQL", "RSpec"],
  learningSkills: ["TypeScript", "React", "Next.js", "Docker", "LLM API"],
  strongPoints: ["既存コードの調査", "影響範囲の整理", "テストを伴う安全な改修"],
  desiredRoles: ["Webアプリケーションエンジニア", "バックエンドエンジニア"],
  desiredWorkStyle: "フルリモート / フレックス",
  experienceYears: 5,
  createdAt: "2026-06-01T00:00:00Z",
  updatedAt: "2026-06-10T00:00:00Z",
};

export const mockJobPostings: JobPosting[] = [
  {
    id: 1,
    companyName: "株式会社サンプルテック",
    title: "Webアプリケーションエンジニア（Rails / React）",
    description:
      "Ruby on Rails によるバックエンド開発と、React / TypeScript を用いたフロントエンド開発をお任せします。AWS 上で稼働するサービスの開発・運用経験があると尚可。",
    url: "https://example.com/jobs/1",
    employmentType: "full_time",
    remoteAvailable: true,
    status: "casual_interview",
    memo: "カジュアル面談で技術スタックの詳細を確認したい。",
    techStacks: [
      {
        id: 1,
        jobPostingId: 1,
        name: "Ruby on Rails",
        category: "backend",
        importance: "required",
        createdAt: "2026-06-12T00:00:00Z",
        updatedAt: "2026-06-12T00:00:00Z",
      },
      {
        id: 2,
        jobPostingId: 1,
        name: "TypeScript",
        category: "frontend",
        importance: "required",
        createdAt: "2026-06-12T00:00:00Z",
        updatedAt: "2026-06-12T00:00:00Z",
      },
      {
        id: 3,
        jobPostingId: 1,
        name: "AWS",
        category: "infrastructure",
        importance: "preferred",
        createdAt: "2026-06-12T00:00:00Z",
        updatedAt: "2026-06-12T00:00:00Z",
      },
    ],
    createdAt: "2026-06-12T00:00:00Z",
    updatedAt: "2026-06-15T00:00:00Z",
  },
  {
    id: 2,
    companyName: "合同会社デモワークス",
    title: "バックエンドエンジニア（Go / Kubernetes）",
    description:
      "Go によるマイクロサービス開発、Kubernetes での運用が中心です。インフラ自動化に興味のある方を歓迎します。",
    url: "https://example.com/jobs/2",
    employmentType: "full_time",
    remoteAvailable: false,
    status: "interested",
    techStacks: [],
    createdAt: "2026-06-14T00:00:00Z",
    updatedAt: "2026-06-14T00:00:00Z",
  },
];

export const mockAnalysisResults: AnalysisResult[] = [
  {
    id: 1,
    jobPostingId: 1,
    matchedPoints: [
      "Rails の実務経験が求人の必須要件に合致している",
      "TypeScript / React を現在学習中で、フロント要件に前向きに取り組める",
    ],
    weakPoints: ["AWS の実務経験が浅い", "大規模トラフィックの運用経験が不明"],
    concerns: ["フロントエンドの実務比率がどの程度求められるか"],
    interviewQuestions: [
      "フロントとバックの担当比率はどのくらいですか？",
      "AWS のどのサービスを主に利用していますか？",
    ],
    suggestedPositioning:
      "Rails での開発・改修・保守の実績を軸に、TypeScript / React は学習中だが既に個人開発で実装している点を伝える。",
    createdAt: "2026-06-15T00:00:00Z",
    updatedAt: "2026-06-15T00:00:00Z",
  },
];

export const mockReplies: GeneratedReply[] = [
  {
    id: 1,
    jobPostingId: 1,
    body: "はじめまして。求人を拝見しご連絡しました。Rails を中心に業務開発を行ってきており、現在は TypeScript / React も個人開発で扱っています。まずはカジュアルにお話を伺えればと思います。",
    tone: "casual",
    createdAt: "2026-06-15T00:00:00Z",
    updatedAt: "2026-06-15T00:00:00Z",
  },
];

export const mockInterviewMemos: InterviewMemo[] = [
  {
    id: 1,
    jobPostingId: 1,
    interviewDate: "2026-06-16",
    interviewer: "技術責任者 田中様",
    memo: "チーム構成と開発フローについて説明を受けた。",
    technicalNotes: "CI は GitHub Actions、レビュー文化あり。",
    concerns: "フロントの比率が想定より高そう。",
    nextAction: "コーディングテストの案内待ち。",
    motivationLevel: 4,
    createdAt: "2026-06-16T00:00:00Z",
    updatedAt: "2026-06-16T00:00:00Z",
  },
];
