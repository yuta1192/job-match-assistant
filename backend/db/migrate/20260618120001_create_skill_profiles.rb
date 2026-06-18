# SkillProfile テーブル / 自分のスキル情報（1件のみ運用）
#
# 設計理由:
# - main_skills 等の「複数の文字列」は Postgres の配列型(text[])で保持する。
#   中間テーブルを作らずフロントの string[] にそのまま対応でき、最小構成になる。
class CreateSkillProfiles < ActiveRecord::Migration[7.2]
  def change
    create_table :skill_profiles do |t|
      t.text :summary
      t.text :main_skills, array: true, default: []
      t.text :learning_skills, array: true, default: []
      t.text :strong_points, array: true, default: []
      t.text :desired_roles, array: true, default: []
      t.string :desired_work_style
      t.integer :experience_years # 未入力を許容するため null 可

      t.timestamps
    end
  end
end
