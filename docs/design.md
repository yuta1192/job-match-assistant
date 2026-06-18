# Job Match Assistant 設計書

求人情報とスキルプロフィールをもとに、LLM API を用いて求人分析・返信文生成・応募管理を行う転職活動支援アプリの設計書。
本ドキュメントは仕様と「なぜその設計にしたか」を残し、面談で説明できる状態を目指す。

---

## 1. なぜ作るか

転職活動で複数求人を比較する際、(1) 技術スタックの読み取り、(2) 自分の経験とのマッチ整理、(3) 不足スキル・面談確認点の洗い出し、(4) 自然な返信文作成、(5) 応募状況・面談メモの管理、に時間がかかる。
これらを LLM で効率化する実用アプリであり、同時に TypeScript / React / Next.js / Rails API / Docker / LLM API / CI を実装で学ぶポートフォリオでもある。

---

## 2. 使用技術

- **フロントエンド**: Next.js (App Router) / React / TypeScript / React Hook Form / Zod / fetch ベース（or TanStack Query）/ Tailwind or シンプル CSS
- **バックエンド**: Rails (API mode) / PostgreSQL / RSpec / FactoryBot / request spec / Service Object
- **AI/LLM**: OpenAI API または Anthropic API を**直接**利用。LangChain / LlamaIndex / LangGraph は当面使わず、入力設計・出力形式・エラー処理・ログ保存を理解することを優先。
- **インフラ/開発環境**: Docker / Docker Compose / GitHub Actions / Vercel / Render(or Fly.io/Railway)。AWS 本番構成は当面必須にしない。

### スコープ外（当面）

Go / Terraform / Kubernetes / Swarm / Grafana / Prometheus / LangChain 深掘り / 本格 RAG / 複雑な AWS 本番構成。
理由: MVP の「動く・説明できる・見せられる」を最優先するため。

---

## 3. 主要機能（MVP）

1. **求人登録** — 会社名 / 求人タイトル / 求人本文 / URL / 雇用形態 / リモート可否 / ステータス / メモ
2. **スキルプロフィール登録** — 主な経験技術 / 経験年数 / 得意領域 / 学習中技術 / 希望職種 / 希望する働き方 / 職務要約
3. **技術スタック抽出** — 求人本文から LLM で抽出（Ruby/Rails/TypeScript/React/AWS/Docker 等）
4. **マッチ分析** — マッチ点 / 足りない点 / 面談確認点 / 想定懸念 / 面談での見せ方
5. **返信文生成** — 丁寧・盛りすぎない・AI 感を出さない・経験との接点を明確に・「まずカジュアルに話したい」温度感
6. **応募ステータス管理** — interested / replied / casual_interview / screening / coding_test / final_interview / offered / rejected / declined
7. **面談メモ管理** — 面談日 / 担当者 / 内容 / 技術的印象 / 懸念点 / 次回アクション / 志望度

### 余裕があれば

認証 / 求人 URL から本文取得 / 分析履歴 / 返信文の複数パターン / 学習提案 / GitHub 連携 / FastAPI 切り出し / Playwright E2E / AWS デプロイ / RAG。

---

## 4. データモデル

### SkillProfile（自分のスキル情報）
`id` / `summary` / `main_skills` / `learning_skills` / `strong_points` / `desired_roles` / `desired_work_style` / `created_at` / `updated_at`

### JobPosting（求人情報）
`id` / `company_name` / `title` / `url` / `description` / `employment_type` / `remote_available` / `status` / `memo` / `created_at` / `updated_at`

### JobTechStack（求人から抽出した技術）
`id` / `job_posting_id` / `name` / `category` / `importance` / `created_at` / `updated_at`
- category: `backend` / `frontend` / `infrastructure` / `database` / `ai` / `testing` / `devops` / `other`
- importance: `required` / `preferred` / `mentioned`

### AnalysisResult（LLM 分析結果）
`id` / `job_posting_id` / `matched_points` / `weak_points` / `concerns` / `interview_questions` / `suggested_positioning` / `raw_response` / `created_at` / `updated_at`
- `raw_response` を保存する理由: 出力の再現性・デバッグ性・プロンプト改善の根拠を残すため。

### GeneratedReply（生成した返信文）
`id` / `job_posting_id` / `body` / `tone`(casual/polite/concise) / `created_at` / `updated_at`

### InterviewMemo（面談メモ）
`id` / `job_posting_id` / `interview_date` / `interviewer` / `memo` / `technical_notes` / `concerns` / `next_action` / `motivation_level` / `created_at` / `updated_at`

### User（将来の認証用、MVP では任意）
`id` / `name` / `email` / `created_at` / `updated_at`

---

## 5. API 設計

### JobPosting
- `GET /api/job_postings`
- `GET /api/job_postings/:id`
- `POST /api/job_postings`
- `PATCH /api/job_postings/:id`
- `DELETE /api/job_postings/:id`

### SkillProfile
- `GET /api/skill_profile`
- `POST /api/skill_profile`
- `PATCH /api/skill_profile`

### Analysis
- `POST /api/job_postings/:id/analyze`
  1. job_posting 取得 → 2. skill_profile 取得 → 3. LLM へ送信 → 4. 技術スタック・マッチ理由・懸念点・質問案を生成 → 5. AnalysisResult 保存 → 6. JobTechStack 保存 → 7. JSON 返却

### Reply
- `POST /api/job_postings/:id/generate_reply`
  1. job_posting 取得 → 2. skill_profile 取得 → 3. analysis_result 取得 → 4. LLM へ送信 → 5. GeneratedReply 保存 → 6. JSON 返却

### InterviewMemo
- `GET /api/job_postings/:id/interview_memos`
- `POST /api/job_postings/:id/interview_memos`
- `PATCH /api/interview_memos/:id`
- `DELETE /api/interview_memos/:id`

---

## 6. 画面設計

1. **求人一覧** — 会社名 / タイトル / ステータス / リモート可否 / 主な技術スタック / 最終更新日。操作: 新規登録・詳細遷移・ステータス変更
2. **求人登録** — 会社名 / タイトル / URL / 本文 / リモート可否 / メモ
3. **求人詳細** — 求人情報 / 技術スタック / マッチ分析 / 返信文 / 面談メモ。操作: 分析実行・返信文生成・メモ追加・ステータス変更
4. **スキルプロフィール** — 職務要約 / 主な経験技術 / 得意領域 / 学習中技術 / 希望職種 / 希望する働き方
5. **分析結果**（求人詳細内でも可）— マッチ点 / 足りない点 / 懸念点 / 面談質問 / 自分の見せ方

---

## 7. ディレクトリ構成

monorepo 構成。`README.md` の「リポジトリ構成」を参照。
`backend/`(Rails API) と `frontend/`(Next.js) を分け、`docs/` に設計・学習計画・AI 利用方針・面談スクリプトを置く。

---

## 8. LLM 連携の設計方針

- **入力**: 求人本文 + スキルプロフィールを構造化して渡す
- **出力**: JSON 固定。スキーマを定義し、パース失敗時のフォールバックを用意
- **エラー処理**: timeout / retry / レート制限を考慮
- **ログ保存**: `raw_response` を保存（再現性・デバッグ・コスト分析）
- **コスト意識**: モデル選定・トークン量・呼び出し回数

---

## 9. コメント方針

過剰なコメントは入れない。ただし学習目的の重要ファイルには「このファイルの役割 / 学習した概念 / なぜこの設計にしたか」を記載する。
（例は `docs/learning-plan.md` の各 Phase を参照）
