# JobPosting / 求人情報
#
# 学習テーマ: model / association / validation
# 設計:
# - 取りうる値が有限の項目(employment_type / status)は定数配列＋inclusion検証で縛る。
#   フロントの literal union と値を一致させる。
# - 子レコードは dependent: :destroy で、求人削除時に一緒に消えるようにする。
class JobPosting < ApplicationRecord
  EMPLOYMENT_TYPES = %w[full_time contract part_time freelance other].freeze
  STATUSES = %w[
    interested replied casual_interview screening coding_test
    final_interview offered rejected declined
  ].freeze

  has_many :job_tech_stacks, dependent: :destroy
  has_one :analysis_result, dependent: :destroy
  has_many :generated_replies, dependent: :destroy
  has_many :interview_memos, dependent: :destroy

  validates :company_name, :title, :description, presence: true
  validates :employment_type, inclusion: { in: EMPLOYMENT_TYPES }
  validates :status, inclusion: { in: STATUSES }
end
