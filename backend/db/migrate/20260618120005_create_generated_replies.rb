# GeneratedReply テーブル / 生成した返信文
#
# 設計理由:
# - 1求人に複数トーンの返信文を持てるよう has_many（job_posting への belongs_to）。
class CreateGeneratedReplies < ActiveRecord::Migration[7.2]
  def change
    create_table :generated_replies do |t|
      t.references :job_posting, null: false, foreign_key: true
      t.text :body, null: false
      t.string :tone, null: false, default: "casual"

      t.timestamps
    end
  end
end
