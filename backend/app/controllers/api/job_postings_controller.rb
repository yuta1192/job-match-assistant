module Api
  # 求人の CRUD。Phase 3 の中心。
  #
  # 学習テーマ: controller / request 処理 / strong parameters / JSON 応答
  # 設計:
  # - 一覧・詳細では技術スタックも含めて返す。フロントの JobPosting 型は
  #   techStacks を持つため、`techStacks` キーで付与する（job_tech_stacks の別名）。
  # - 出力は application_controller の render_json で camelCase 化される。
  class JobPostingsController < ApplicationController
    before_action :set_job_posting, only: %i[show update destroy]

    def index
      jobs = JobPosting.includes(:job_tech_stacks).order(updated_at: :desc)
      render_json(jobs.map { |job| serialize(job) })
    end

    def show
      render_json(serialize(@job_posting))
    end

    def create
      job = JobPosting.new(job_posting_params)
      job.save!
      render_json(serialize(job), status: :created)
    end

    def update
      @job_posting.update!(job_posting_params)
      render_json(serialize(@job_posting))
    end

    def destroy
      @job_posting.destroy!
      head :no_content
    end

    private

    def set_job_posting
      @job_posting = JobPosting.find(params[:id])
    end

    # フロントの JobPosting 型に合わせて techStacks を含めた hash を返す。
    def serialize(job)
      job.as_json.merge("techStacks" => job.job_tech_stacks.as_json)
    end

    def job_posting_params
      underscored_params.slice(
        "company_name", "title", "description", "url",
        "employment_type", "remote_available", "status", "memo"
      )
    end
  end
end
