# JobTechStack テーブル / 求人から抽出した技術スタック
#
# 設計理由:
# - job_posting への belongs_to。foreign_key で参照整合性を DB レベルでも担保する。
class CreateJobTechStacks < ActiveRecord::Migration[7.2]
  def change
    create_table :job_tech_stacks do |t|
      t.references :job_posting, null: false, foreign_key: true
      t.string :name, null: false
      t.string :category, null: false
      t.string :importance, null: false

      t.timestamps
    end
  end
end
