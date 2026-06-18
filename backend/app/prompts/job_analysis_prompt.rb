# JobAnalysisPrompt / 求人分析プロンプトの組み立て
#
# 学習テーマ: prompt設計 / JSON出力の指定 / システム指示と入力データの分離
# 設計理由:
# - system に「役割・出力形式(JSON)・許可値」を固定で書き、user に求人とスキルの実データを渡す。
#   指示とデータを分けることで、出力を安定させ、プロンプトを再利用しやすくする。
# - stub はキー未設定時に返す既定応答。実APIと同じJSON形なので後段の処理が共通になる。
module JobAnalysisPrompt
  Prompt = Struct.new(:system, :user, :stub, keyword_init: true)

  SYSTEM = <<~SYSTEM.freeze
    あなたは転職活動を支援するアシスタントです。
    与えられた求人情報と応募者のスキルプロフィールを分析し、結果を**JSONのみ**で出力してください。
    前置き・後置き・コードフェンスは付けないでください。

    出力するJSONの形式:
    {
      "tech_stacks": [{ "name": "技術名", "category": "カテゴリ", "importance": "重要度" }],
      "matched_points": ["マッチしている点(文字列の配列)"],
      "weak_points": ["足りない点・不足スキル"],
      "concerns": ["想定される懸念"],
      "interview_questions": ["面談で確認すべき質問"],
      "suggested_positioning": "面談での自分の見せ方(1〜3文)"
    }

    category は次のいずれか: backend, frontend, infrastructure, database, ai, testing, devops, other
    importance は次のいずれか: required, preferred, mentioned
    日本語で、簡潔かつ具体的に記述してください。
  SYSTEM

  STUB = <<~JSON.freeze
    {
      "tech_stacks": [
        { "name": "Ruby on Rails", "category": "backend", "importance": "required" },
        { "name": "TypeScript", "category": "frontend", "importance": "preferred" }
      ],
      "matched_points": ["Railsの実務経験が求人の必須要件に合致している（スタブ応答）"],
      "weak_points": ["AWSの実務経験が浅い（スタブ応答）"],
      "concerns": ["フロントエンドの担当比率が不明（スタブ応答）"],
      "interview_questions": ["フロントとバックの担当比率はどのくらいですか？（スタブ応答）"],
      "suggested_positioning": "Railsの実績を軸に、TypeScript/Reactは学習中だが個人開発で実装済みと伝える。（スタブ応答）"
    }
  JSON

  module_function

  def build(job, skill)
    Prompt.new(system: SYSTEM, user: user_text(job, skill), stub: STUB)
  end

  def user_text(job, skill)
    <<~USER
      ## 求人情報
      会社名: #{job.company_name}
      タイトル: #{job.title}
      雇用形態: #{job.employment_type}
      リモート可否: #{job.remote_available ? "可" : "不明/不可"}
      本文:
      #{job.description}

      ## 応募者のスキルプロフィール
      #{skill_text(skill)}
    USER
  end

  def skill_text(skill)
    return "（スキルプロフィール未登録）" if skill.nil?

    <<~SKILL
      職務要約: #{skill.summary}
      主な経験技術: #{skill.main_skills.join(", ")}
      学習中の技術: #{skill.learning_skills.join(", ")}
      得意領域: #{skill.strong_points.join(", ")}
      希望職種: #{skill.desired_roles.join(", ")}
      希望する働き方: #{skill.desired_work_style}
    SKILL
  end
end
