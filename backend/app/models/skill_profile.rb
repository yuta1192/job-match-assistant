# SkillProfile / 自分のスキル情報
#
# 学習テーマ: model / validation
# 設計: アプリ全体で1件のみ運用する想定（自分の情報）。
class SkillProfile < ApplicationRecord
  validates :summary, presence: true
end
