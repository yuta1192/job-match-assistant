module Api
  # マッチ分析結果の読み取り。生成(POST)は Phase 5(LLM連携)で追加する。
  #
  # 設計: 1求人につき1件(has_one)。未分析なら null を返す
  #       （フロントの fetchAnalysisResult は AnalysisResult | null を期待）。
  class AnalysisResultsController < ApplicationController
    def show
      job = JobPosting.find(params[:job_posting_id])
      render_json(job.analysis_result)
    end
  end
end
