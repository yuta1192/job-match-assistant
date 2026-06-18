# JobPosting のテストデータ生成。
# 学習テーマ: FactoryBot で「有効なレコード」の最小定義を1か所に集約する。
FactoryBot.define do
  factory :job_posting do
    company_name { "株式会社テスト" }
    title { "Webアプリケーションエンジニア" }
    description { "Ruby on Rails と React を用いた開発。" }
    employment_type { "full_time" }
    remote_available { true }
    status { "interested" }
  end
end
