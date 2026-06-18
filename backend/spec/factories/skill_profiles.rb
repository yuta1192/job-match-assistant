FactoryBot.define do
  factory :skill_profile do
    summary { "Rails中心に業務開発を経験。" }
    main_skills { ["Ruby", "Ruby on Rails"] }
    learning_skills { ["TypeScript", "React"] }
    strong_points { ["既存コード調査"] }
    desired_roles { ["バックエンドエンジニア"] }
    desired_work_style { "フルリモート" }
  end
end
