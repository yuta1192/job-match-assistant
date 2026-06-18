# JobPosting テーブル / 求人情報
#
# 設計理由:
# - employment_type / status は取りうる値が有限だが、enum 型ではなく string 列にし、
#   モデル側の inclusion 検証で縛る。JSON にそのまま文字列が出てフロントの
#   literal union（status.ts / job.ts）と一致するため。
class CreateJobPostings < ActiveRecord::Migration[7.2]
  def change
    create_table :job_postings do |t|
      t.string :company_name, null: false
      t.string :title, null: false
      t.text :description, null: false
      t.string :url
      t.string :employment_type, null: false, default: "full_time"
      t.boolean :remote_available, null: false, default: false
      t.string :status, null: false, default: "interested"
      t.text :memo

      t.timestamps
    end
  end
end
