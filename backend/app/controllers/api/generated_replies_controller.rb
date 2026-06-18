module Api
  # 返信文の読み取り(index)と生成(create / LLM)。
  class GeneratedRepliesController < ApplicationController
    def index
      job = JobPosting.find(params[:job_posting_id])
      render_json(job.generated_replies.order(created_at: :desc))
    end

    # POST /api/job_postings/:id/generate_reply （member ルートなので :id）
    def create
      job = JobPosting.find(params[:id])
      tone = underscored_params["tone"] || "casual"
      reply = ReplyGenerationService.new.call(job, tone: tone)
      render_json(reply, status: :created)
    rescue Llm::Error => e
      render json: { message: e.message }, status: :bad_gateway
    end
  end
end
