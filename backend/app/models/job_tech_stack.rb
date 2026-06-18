# JobTechStack / 求人から抽出した技術スタック1件
#
# 学習テーマ: association(belongs_to) / validation
class JobTechStack < ApplicationRecord
  CATEGORIES = %w[backend frontend infrastructure database ai testing devops other].freeze
  IMPORTANCES = %w[required preferred mentioned].freeze

  belongs_to :job_posting

  validates :name, presence: true
  validates :category, inclusion: { in: CATEGORIES }
  validates :importance, inclusion: { in: IMPORTANCES }
end
