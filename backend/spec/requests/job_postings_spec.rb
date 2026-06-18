require "rails_helper"

# JobPostings の request spec（APIの入出力を検証）
# 学習テーマ: request spec / JSONレスポンスのキー(camelCase) / バリデーションエラー(422)
RSpec.describe "Api::JobPostings", type: :request do
  describe "GET /api/job_postings" do
    it "一覧を camelCase で返す" do
      create(:job_posting, company_name: "一覧テスト社")

      get "/api/job_postings"

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body.first).to include("companyName", "techStacks")
    end
  end

  describe "POST /api/job_postings" do
    it "camelCase の入力を受け取り作成する" do
      params = {
        companyName: "新規作成社",
        title: "エンジニア",
        description: "本文",
        employmentType: "full_time",
        status: "interested"
      }

      expect {
        post "/api/job_postings", params: params, as: :json
      }.to change(JobPosting, :count).by(1)

      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)["companyName"]).to eq("新規作成社")
    end

    it "必須項目が無ければ 422 を返す" do
      post "/api/job_postings", params: { title: "会社名なし" }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)).to have_key("message")
    end
  end

  describe "GET /api/job_postings/:id" do
    it "存在しない id は 404 を返す" do
      get "/api/job_postings/999999"
      expect(response).to have_http_status(:not_found)
    end
  end
end
