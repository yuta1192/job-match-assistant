# AnalysisResult テーブル / LLM によるマッチ分析結果
#
# 設計理由:
# - 1求人につき分析結果は1件（has_one）なので job_posting_id に unique 制約を付ける。
# - 箇条書き項目は Postgres 配列型でフロントの string[] に対応。
# - raw_response は LLM の生レスポンスを保持（再現性・デバッグ用。Phase 5 で使う）。
class CreateAnalysisResults < ActiveRecord::Migration[7.2]
  def change
    create_table :analysis_results do |t|
      t.references :job_posting, null: false, foreign_key: true, index: { unique: true }
      t.text :matched_points, array: true, default: []
      t.text :weak_points, array: true, default: []
      t.text :concerns, array: true, default: []
      t.text :interview_questions, array: true, default: []
      t.text :suggested_positioning
      t.text :raw_response

      t.timestamps
    end
  end
end
