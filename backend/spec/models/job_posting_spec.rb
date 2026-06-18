require "rails_helper"

# JobPosting の model spec
# 学習テーマ: validation のテスト / association の dependent: :destroy
RSpec.describe JobPosting, type: :model do
  it "有効なファクトリは保存できる" do
    expect(build(:job_posting)).to be_valid
  end

  it "company_name / title / description は必須" do
    job = build(:job_posting, company_name: "", title: "", description: "")
    expect(job).not_to be_valid
    expect(job.errors.attribute_names).to include(:company_name, :title, :description)
  end

  it "status は定義済みの値しか許可しない" do
    expect(build(:job_posting, status: "unknown")).not_to be_valid
  end

  it "employment_type は定義済みの値しか許可しない" do
    expect(build(:job_posting, employment_type: "invalid")).not_to be_valid
  end

  it "削除すると紐づく技術スタックも一緒に消える(dependent: :destroy)" do
    job = create(:job_posting)
    job.job_tech_stacks.create!(name: "Rails", category: "backend", importance: "required")

    expect { job.destroy }.to change(JobTechStack, :count).by(-1)
  end
end
