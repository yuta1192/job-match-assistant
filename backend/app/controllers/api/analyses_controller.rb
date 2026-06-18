module Api
  # 求人分析の実行（LLM）。POST /api/job_postings/:job_posting_id/analyze
  #
  # 学習テーマ: コントローラは薄く / Service に処理を委譲 / LLMエラーの扱い
  class AnalysesController < ApplicationController
    def create
      # member ルート(/job_postings/:id/analyze)なので id は :id で渡る
      job = JobPosting.find(params[:id])
      result = JobAnalysisService.new.call(job)
      # 抽出した技術スタックも一緒に返す（フロントが詳細画面を更新しやすいように）
      render_json(result.as_json.merge("techStacks" => job.job_tech_stacks.reload.as_json),
                  status: :created)
    rescue Llm::Error => e
      # 外部API起因の失敗は 502 で返す
      render json: { message: e.message }, status: :bad_gateway
    end
  end
end
