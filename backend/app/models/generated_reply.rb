# GeneratedReply / 生成した返信文
#
# 学習テーマ: association(belongs_to) / validation
class GeneratedReply < ApplicationRecord
  TONES = %w[casual polite concise].freeze

  belongs_to :job_posting

  validates :body, presence: true
  validates :tone, inclusion: { in: TONES }
end
