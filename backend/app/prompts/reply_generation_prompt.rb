# ReplyGenerationPrompt / 返信文生成プロンプトの組み立て
#
# 学習テーマ: prompt設計 / トーン制御 / AI感を減らす指示
# 設計理由:
# - 「AI感を出さない・盛りすぎない・経験との接点を明確に」という文体要件を system に明記する。
# - 分析結果(あれば)も渡し、マッチ点を踏まえた自然な返信にする。
module ReplyGenerationPrompt
  Prompt = Struct.new(:system, :user, :stub, keyword_init: true)

  TONE_GUIDE = {
    "casual" => "カジュアル。まずは気軽に話したい温度感。",
    "polite" => "丁寧でフォーマル。",
    "concise" => "簡潔。要点のみ短く。"
  }.freeze

  module_function

  def build(job, skill, analysis, tone)
    Prompt.new(
      system: system_text(tone),
      user: user_text(job, skill, analysis),
      stub: stub(tone)
    )
  end

  def system_text(tone)
    <<~SYSTEM
      あなたは転職活動中の応募者本人として、求人への返信文を作成します。
      結果は**JSONのみ**で出力してください（前置き・コードフェンスなし）。

      出力するJSONの形式:
      { "body": "返信文の本文", "tone": "#{tone}" }

      文体の要件:
      - #{TONE_GUIDE.fetch(tone, TONE_GUIDE["casual"])}
      - AI が書いた感を出さない（定型句や大げさな表現を避ける）。
      - 経験を盛りすぎない。自分の経験と求人の接点を具体的に示す。
      - 日本語で、3〜5文程度。
    SYSTEM
  end

  def user_text(job, skill, analysis)
    <<~USER
      ## 求人情報
      会社名: #{job.company_name}
      タイトル: #{job.title}
      本文:
      #{job.description}

      ## 応募者のスキル要約
      #{skill&.summary || "（未登録）"}
      主な経験技術: #{skill ? skill.main_skills.join(", ") : "（未登録）"}

      ## マッチ分析(参考)
      #{analysis_text(analysis)}
    USER
  end

  def analysis_text(analysis)
    return "（未分析）" if analysis.nil?

    "マッチ点: #{analysis.matched_points.join(" / ")}"
  end

  def stub(tone)
    {
      body: "はじめまして。求人を拝見しご連絡しました。Railsを中心に開発してきており、" \
            "現在はTypeScript/Reactも個人開発で扱っています。まずはカジュアルにお話を伺えればと思います。（スタブ応答）",
      tone: tone
    }.to_json
  end
end
