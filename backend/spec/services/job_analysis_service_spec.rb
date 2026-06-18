require "rails_helper"

# JobAnalysisService の service spec
# 学習テーマ:
# - LLM部分のモック化（fake client を注入してネットワーク/課金なしでテスト）
# - 「LLM応答(JSON文字列) → パース → 保存」の責務を検証する
RSpec.describe JobAnalysisService do
  # complete(...) が固定のJSON文字列を返すだけの fake クライアント。
  # 実APIを呼ばないので高速・無料・決定的。
  class FakeLlmClient
    def initialize(response)
      @response = response
    end

    def complete(**)
      @response
    end
  end

  let(:job) { create(:job_posting) }

  let(:llm_json) do
    {
      tech_stacks: [
        { name: "Ruby on Rails", category: "backend", importance: "required" },
        { name: "TypeScript", category: "frontend", importance: "preferred" }
      ],
      matched_points: ["Railsの実務経験が要件に合致"],
      weak_points: ["AWS経験が浅い"],
      concerns: ["フロント比率が不明"],
      interview_questions: ["担当比率は?"],
      suggested_positioning: "Railsの実績を軸に伝える"
    }.to_json
  end

  subject(:service) { described_class.new(client: FakeLlmClient.new(llm_json)) }

  it "分析結果(AnalysisResult)を保存する" do
    service.call(job)

    result = job.reload.analysis_result
    expect(result).to be_present
    expect(result.matched_points).to eq(["Railsの実務経験が要件に合致"])
    expect(result.suggested_positioning).to eq("Railsの実績を軸に伝える")
  end

  it "技術スタックを保存する" do
    expect { service.call(job) }.to change { job.job_tech_stacks.count }.from(0).to(2)
    expect(job.job_tech_stacks.pluck(:name)).to contain_exactly("Ruby on Rails", "TypeScript")
  end

  it "再現性のため raw_response を保存する" do
    service.call(job)
    expect(job.reload.analysis_result.raw_response).to eq(llm_json)
  end

  it "再実行すると古い技術スタックを入れ替える(重複しない)" do
    service.call(job)
    service.call(job)
    expect(job.reload.job_tech_stacks.count).to eq(2)
  end

  context "LLMが不正なJSONを返したとき" do
    subject(:service) { described_class.new(client: FakeLlmClient.new("これはJSONではない")) }

    it "Llm::Error を上げる" do
      expect { service.call(job) }.to raise_error(Llm::Error)
    end
  end
end
