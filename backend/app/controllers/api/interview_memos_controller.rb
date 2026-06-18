module Api
  # 面談メモの CRUD。LLM を使わない純粋な CRUD なので Phase 3 で実装する。
  #
  # 学習テーマ: ネストしたリソース(求人配下の index/create) と単独リソース(update/destroy)
  class InterviewMemosController < ApplicationController
    def index
      job = JobPosting.find(params[:job_posting_id])
      render_json(job.interview_memos.order(interview_date: :desc))
    end

    def create
      job = JobPosting.find(params[:job_posting_id])
      memo = job.interview_memos.create!(interview_memo_params)
      render_json(memo, status: :created)
    end

    def update
      memo = InterviewMemo.find(params[:id])
      memo.update!(interview_memo_params)
      render_json(memo)
    end

    def destroy
      InterviewMemo.find(params[:id]).destroy!
      head :no_content
    end

    private

    def interview_memo_params
      underscored_params.slice(
        "interview_date", "interviewer", "memo", "technical_notes",
        "concerns", "next_action", "motivation_level"
      )
    end
  end
end
