# AnalysisResult / LLM によるマッチ分析結果（1求人につき1件）
#
# 学習テーマ: association(belongs_to)
# 設計: 中身の生成は Phase 5(LLM連携)で行う。Phase 3 では読み取りのみ対応。
class AnalysisResult < ApplicationRecord
  belongs_to :job_posting
end
