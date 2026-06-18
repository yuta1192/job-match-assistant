module Api
  # スキルプロフィール。アプリ全体で1件のみ運用するため単数リソース（id 無し）。
  #
  # 学習テーマ: 単数リソースの controller / strong parameters
  # 設計: show は唯一のプロフィールを返す。update も既存の1件を対象にする。
  class SkillProfilesController < ApplicationController
    def show
      render_json(SkillProfile.first)
    end

    def create
      profile = SkillProfile.create!(skill_profile_params)
      render_json(profile, status: :created)
    end

    def update
      profile = SkillProfile.first!
      profile.update!(skill_profile_params)
      render_json(profile)
    end

    private

    def skill_profile_params
      underscored_params.slice(
        "summary", "main_skills", "learning_skills",
        "strong_points", "desired_roles", "desired_work_style",
        "experience_years"
      )
    end
  end
end
