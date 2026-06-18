# シードデータ
#
# フロントの Phase 2 モックデータ(frontend/src/lib/mockData.ts)と内容を合わせ、
# API 切替直後に同じ画面が実データで表示されることを確認できるようにする。
# 何度実行しても同じ状態になるよう、いったん全削除してから作り直す（開発用途）。

puts "Seeding..."

InterviewMemo.delete_all
GeneratedReply.delete_all
AnalysisResult.delete_all
JobTechStack.delete_all
JobPosting.delete_all
SkillProfile.delete_all

SkillProfile.create!(
  summary: "Ruby on Rails を中心に業務系 Web アプリの開発・改修・保守運用を経験。既存コード調査と安全な改修が得意。",
  main_skills: ["Ruby", "Ruby on Rails", "JavaScript", "PostgreSQL", "RSpec"],
  learning_skills: ["TypeScript", "React", "Next.js", "Docker", "LLM API"],
  strong_points: ["既存コードの調査", "影響範囲の整理", "テストを伴う安全な改修"],
  desired_roles: ["Webアプリケーションエンジニア", "バックエンドエンジニア"],
  desired_work_style: "フルリモート / フレックス",
  experience_years: 5
)

job1 = JobPosting.create!(
  company_name: "株式会社サンプルテック",
  title: "Webアプリケーションエンジニア（Rails / React）",
  description: "Ruby on Rails によるバックエンド開発と、React / TypeScript を用いたフロントエンド開発をお任せします。AWS 上で稼働するサービスの開発・運用経験があると尚可。",
  url: "https://example.com/jobs/1",
  employment_type: "full_time",
  remote_available: true,
  status: "casual_interview",
  memo: "カジュアル面談で技術スタックの詳細を確認したい。"
)

job1.job_tech_stacks.create!([
  { name: "Ruby on Rails", category: "backend", importance: "required" },
  { name: "TypeScript", category: "frontend", importance: "required" },
  { name: "AWS", category: "infrastructure", importance: "preferred" }
])

job1.create_analysis_result!(
  matched_points: [
    "Rails の実務経験が求人の必須要件に合致している",
    "TypeScript / React を現在学習中で、フロント要件に前向きに取り組める"
  ],
  weak_points: ["AWS の実務経験が浅い", "大規模トラフィックの運用経験が不明"],
  concerns: ["フロントエンドの実務比率がどの程度求められるか"],
  interview_questions: [
    "フロントとバックの担当比率はどのくらいですか？",
    "AWS のどのサービスを主に利用していますか？"
  ],
  suggested_positioning: "Rails での開発・改修・保守の実績を軸に、TypeScript / React は学習中だが既に個人開発で実装している点を伝える。"
)

job1.generated_replies.create!(
  body: "はじめまして。求人を拝見しご連絡しました。Rails を中心に業務開発を行ってきており、現在は TypeScript / React も個人開発で扱っています。まずはカジュアルにお話を伺えればと思います。",
  tone: "casual"
)

job1.interview_memos.create!(
  interview_date: "2026-06-16",
  interviewer: "技術責任者 田中様",
  memo: "チーム構成と開発フローについて説明を受けた。",
  technical_notes: "CI は GitHub Actions、レビュー文化あり。",
  concerns: "フロントの比率が想定より高そう。",
  next_action: "コーディングテストの案内待ち。",
  motivation_level: 4
)

JobPosting.create!(
  company_name: "合同会社デモワークス",
  title: "バックエンドエンジニア（Go / Kubernetes）",
  description: "Go によるマイクロサービス開発、Kubernetes での運用が中心です。インフラ自動化に興味のある方を歓迎します。",
  url: "https://example.com/jobs/2",
  employment_type: "full_time",
  remote_available: false,
  status: "interested"
)

puts "Done. JobPostings=#{JobPosting.count}, SkillProfiles=#{SkillProfile.count}"
