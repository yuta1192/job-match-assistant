# デプロイ手順（Vercel + Render）

フロントエンドを **Vercel**、バックエンド(API)と PostgreSQL を **Render** にデプロイする手順。
無料枠で「デモURLを提示できる」状態を目標にする（AWS本番構成は対象外）。

> 注意: これらの操作は各サービスの**自分のアカウント**で行う必要があります。
> Render 無料Webサービスは無アクセス時にスリープし、初回アクセスで数十秒のコールドスタートがあります。

---

## 全体の流れ（依存関係）

CORS と API URL が相互参照になるため、次の順で行う。

1. **バックエンド(Render)を先にデプロイ** → API の URL を得る
2. その URL を使って **フロントエンド(Vercel)をデプロイ** → フロントの URL を得る
3. フロントの URL を Render の `FRONTEND_ORIGIN` に設定し、API を再デプロイ

---

## 1. バックエンド + DB（Render）

1. [Render](https://render.com) でアカウント作成 → GitHubと連携。
2. **New + → Blueprint** → このリポジトリ(`job-match-assistant`)を選択。
   ルートの `render.yaml` が読み込まれ、`job-match-assistant-api`(Web) と `job-match-assistant-db`(Postgres) が作成される。
3. 作成時に求められる/後から設定する環境変数（`sync: false` のもの）:

   | 変数 | 値 |
   | --- | --- |
   | `RAILS_MASTER_KEY` | ローカルの `backend/config/master.key` の中身（1行） |
   | `FRONTEND_ORIGIN` | いったん仮で空 or `http://localhost:3000`（手順3で更新） |
   | `ANTHROPIC_API_KEY` | 任意。未設定ならスタブ応答のまま |

   `DATABASE_URL` は Postgres から自動注入される（手入力不要）。
4. デプロイ完了後、API の URL（例 `https://job-match-assistant-api.onrender.com`）を控える。
   `https://<api>/up` が 200、`https://<api>/api/job_postings` が JSON を返せばOK。
5. （任意）デモ用サンプルデータを入れる場合は、Render の Shell で一度だけ:
   ```
   bundle exec rails db:seed
   ```

---

## 2. フロントエンド（Vercel）

1. [Vercel](https://vercel.com) でアカウント作成 → GitHubと連携 → このリポジトリを Import。
2. **Root Directory を `frontend` に設定**（モノレポのため）。Framework は Next.js が自動検出される。
3. 環境変数を設定:

   | 変数 | 値 |
   | --- | --- |
   | `NEXT_PUBLIC_API_BASE_URL` | `https://<api>.onrender.com/api`（手順1のURL + `/api`） |

4. Deploy。完了後フロントの URL（例 `https://job-match-assistant.vercel.app`）を控える。

---

## 3. CORS を確定（Render 側を更新）

1. Render の `job-match-assistant-api` の環境変数 `FRONTEND_ORIGIN` を、手順2の Vercel URL に更新。
2. API を再デプロイ（環境変数変更で自動再デプロイされる）。
3. ブラウザでフロントURLを開き、求人一覧→詳細→登録、分析実行/返信生成（キー設定時は実LLM）が動けば完了。

---

## トラブルシュート

- **CORSエラー**: `FRONTEND_ORIGIN` が Vercel の URL と完全一致しているか（`https://`・末尾スラッシュ無し）。
- **APIが500/起動しない**: `RAILS_MASTER_KEY` 未設定の可能性（credentials 復号に必須）。
- **初回アクセスが遅い**: Render無料枠のコールドスタート。数十秒待つ。
- **分析がスタブのまま**: `ANTHROPIC_API_KEY` 未設定。設定して再デプロイ。

---

## 代替（必要なら）

- バックエンドを **Fly.io** にする場合は `fly launch` で `fly.toml` を生成し、`fly postgres` をアタッチ、`DATABASE_URL`/`RAILS_MASTER_KEY`/`FRONTEND_ORIGIN` を `fly secrets set` で設定する構成に置き換える。
