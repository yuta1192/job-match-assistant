# 学習計画 / 教材と実装の対応表

Udemy・書籍で学んだ内容を Job Match Assistant のどの機能に落とし込むかを管理する。
各 Phase は「目的 / 教材 / 学ぶ概念 / 実装する機能 / 作成ファイル / 成果物」で構成する。

---

## 進捗

Phase 1〜7 実装済み（GitHub公開・CI緑・デプロイ準備完了）。Phase 8 仕上げ中。実デプロイ(Vercel/Render)は各自アカウントで実施。

## 全体スケジュール（〜7月末）

| Phase | 期間 | テーマ | 主な成果物 |
| --- | --- | --- | --- |
| 1 | 6/18–6/23 | TypeScript 基礎 | 主要データ型の定義 |
| 2 | 6/24–6/30 | React / Next.js 基礎 | 主要画面（仮データで表示） |
| 3 | 7/1–7/5 | Rails API / PostgreSQL | Next.js から API 呼び出しで CRUD |
| 4 | 7/6–7/10 | Docker | `docker compose up` で3サービス起動 |
| 5 | 7/11–7/16 | LLM API 連携 | 求人分析・返信文生成が動く |
| 6 | 7/17–7/21 | GitHub Actions / テスト | push でテスト実行 |
| 7 | 7/22–7/26 | AWS 基礎 / デプロイ | デモ URL 提示 |
| 8 | 7/27–7/31 | 見せる仕上げ | ポートフォリオ完成 |

---

## 教材と実装箇所の対応表

| 教材 | 学習内容 | アプリで実装した箇所 |
| --- | --- | --- |
| Understanding TypeScript（日本語版） | type / interface / union / literal / optional / generics / async | `frontend/src/types/` の各型 |
| React(v18)完全入門ガイド / りあクト！ / React完全入門 | component / props / state / hooks / form / list・条件レンダリング / App Router | 求人一覧・登録・詳細・スキルプロフィール画面、各コンポーネント |
| （既存 Rails 経験 + RSpec 調査） | API mode / model / migration / controller / serializer / validation / association / request spec | `backend/` の Rails API 一式 |
| 米国AI開発者がゼロから教えるDocker講座 | Dockerfile / docker-compose / image / container / volume / network / env | `backend/Dockerfile` / `frontend/Dockerfile` / `docker-compose.yml` |
| ChatGPT API 実践 / OpenAI・Anthropic 公式 | APIキー管理 / prompt 設計 / JSON 出力 / error / retry / timeout / cost | `backend/app/services/llm/`・分析・返信生成サービス |
| GitHub Actions と AWS で実現する DevOps 実践講座 | workflow / CI / test 自動化 / env / mock | `.github/workflows/` |
| AWS：ゼロから実践 / AWSで作るWEBアプリ | IAM / EC2 / RDS / S3 / CloudWatch / VPC / SG / env | デプロイ構成 |
| リーダブルコード / 良いコード・悪いコード | 命名 / 責務分離 / 読みやすさ / テスト容易性 | 全体のリファクタリングと README |

---

## Phase 1: TypeScript 基礎（6/18–6/23）

- **目的**: Job Match Assistant の主要データ型を TypeScript で定義し、型から仕様を表現する。
- **教材**: Understanding TypeScript（日本語版）
- **学ぶ概念**: number/string/boolean、array、object、type、interface、union、literal type、optional property、generics 基礎、async/Promise、API レスポンス型
- **実装する型**: JobPosting / SkillProfile / JobTechStack / AnalysisResult / GeneratedReply / InterviewMemo / ApplicationStatus
- **作成ファイル**:
  - `frontend/src/types/status.ts`
  - `frontend/src/types/job.ts`
  - `frontend/src/types/skill.ts`
  - `frontend/src/types/analysis.ts`
  - `frontend/src/types/reply.ts`
  - `frontend/src/types/interview.ts`
  - `frontend/src/types/api.ts`（API レスポンス共通型 / generics の練習）
- **各ファイルに残すこと**: どのレクチャーの概念を使ったか / なぜ type or interface か / union をどこで使ったか / optional property をどこで使ったか
- **成果物**: 主要データ型が定義され、後続 Phase の画面・API がこの型を参照できる状態。

---

## Phase 2: React / Next.js 基礎（6/24–6/30）

- **目的**: 仮データ or 仮 API で主要画面を表示できる状態にする。
- **学ぶ概念**: component / props / state / hooks / form / event / list・条件レンダリング / App Router / fetch / loading・error UI
- **実装**: 求人一覧 / 登録 / 詳細 / スキルプロフィール画面、分析結果カード、返信文カード
- **作成ファイル**: `frontend/src/app/job-postings/page.tsx` ほか各画面・`frontend/src/components/` 配下

---

## Phase 3: Rails API / PostgreSQL（7/1–7/5）

- **目的**: Next.js から Rails API を叩いて求人登録・一覧表示。
- **実装**: 各モデル / migration / コントローラ（`Api::JobPostingsController` ほか）/ request spec
- **学ぶ概念**: API mode / serializer / validation / association

---

## Phase 4: Docker（7/6–7/10）

- **目的**: `docker compose up` で Rails API・Next.js・PostgreSQL が起動。
- **作成ファイル**: `backend/Dockerfile` / `frontend/Dockerfile` / `docker-compose.yml` / `.env.example`
- **補足**: Kubernetes / Swarm はやらない。

---

## Phase 5: LLM API 連携（7/11–7/16）

- **目的**: メイン機能（求人分析・返信文生成）を動かす。
- **作成ファイル**: `backend/app/services/llm/client.rb` / `job_analysis_service.rb` / `reply_generation_service.rb` / `backend/app/prompts/*`
- **学ぶ概念**: APIキー管理 / prompt 設計 / JSON 出力 / error / retry / timeout / cost / response 保存

---

## Phase 6: GitHub Actions / テスト（7/17–7/21）

- **目的**: push 時にテストが走る。
- **作成ファイル**: `.github/workflows/backend-test.yml` / `frontend-check.yml` / model・request・service spec
- **ポイント**: LLM API 部分は mock する。

---

## Phase 7: AWS 基礎 / デプロイ（7/22–7/26）

- **目的**: デモ URL を提示。まず Vercel + Render/Fly.io/Railway を優先。
- **学ぶ概念**: IAM / EC2 / RDS / S3 / CloudWatch / VPC / SG / env / CORS

---

## Phase 8: 見せる仕上げ（7/27–7/31）

- **目的**: 採用担当・面接官に見せられる状態。
- **実装**: README / docs 整備、スクショ、ER 図、API 一覧、今後の改善点。

---

## 7月末までやらない教材

AWS+Terraform IaC / Docker Mastery の K8s・Swarm / Playwright 深掘り / Grafana・Prometheus / Go 入門 / Python 応用 / LangChain・LlamaIndex・LangGraph / マスタリング TCP/IP 全読破。
（必要な部分のみ辞書的に参照は OK）
