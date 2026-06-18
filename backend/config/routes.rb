Rails.application.routes.draw do
  # ヘルスチェック（デプロイ先の死活監視・動作確認用）
  get "up" => "rails/health#show", as: :rails_health_check

  # API は /api 名前空間にまとめる。フロントの fetch 先と対応させる。
  namespace :api do
    resources :job_postings, only: %i[index show create update destroy] do
      # 求人にぶら下がる読み取り系
      resource :analysis_result, only: :show
      resources :generated_replies, only: :index
      resources :interview_memos, only: %i[index create]

      # 生成系(LLM) — Phase 5
      member do
        post :analyze, to: "analyses#create"
        post :generate_reply, to: "generated_replies#create"
      end
    end

    # スキルプロフィールは1件のみなので単数リソース（id 無し）。
    resource :skill_profile, only: %i[show create update]

    # 面談メモの更新・削除は id 直接指定。
    resources :interview_memos, only: %i[update destroy]
  end
end
