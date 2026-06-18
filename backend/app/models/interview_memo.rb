# InterviewMemo / 面談メモ
#
# 学習テーマ: association(belongs_to) / validation
# 設計: motivation_level は 1〜5 の整数。未評価(null)は許容する。
class InterviewMemo < ApplicationRecord
  belongs_to :job_posting

  validates :interview_date, :memo, presence: true
  validates :motivation_level,
            inclusion: { in: 1..5 },
            allow_nil: true
end
