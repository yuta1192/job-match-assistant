# InterviewMemo テーブル / 面談メモ
#
# 設計理由:
# - 1求人に複数回の面談を記録できるよう has_many。
# - motivation_level は 1〜5 の整数。モデル側で範囲を検証する。
class CreateInterviewMemos < ActiveRecord::Migration[7.2]
  def change
    create_table :interview_memos do |t|
      t.references :job_posting, null: false, foreign_key: true
      t.date :interview_date, null: false
      t.string :interviewer
      t.text :memo, null: false
      t.text :technical_notes
      t.text :concerns
      t.text :next_action
      t.integer :motivation_level

      t.timestamps
    end
  end
end
