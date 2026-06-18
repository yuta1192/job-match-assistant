# ReplyGenerationService
#
# 求人・スキル・分析結果をもとに、LLM で返信文案を生成して保存する。
#
# 学習テーマ: Service Object / 外部API連携 / 入力データの組み立て
# 設計理由:
# - 1求人に複数トーンの返信を持てるよう、毎回 GeneratedReply を新規作成する。
# - モデルが返した tone が不正なら、リクエストされた tone にフォールバックする。
class ReplyGenerationService
  def initialize(client: Llm::Client.new)
    @client = client
  end

  # 戻り値: 保存した GeneratedReply
  def call(job, tone: "casual")
    tone = "casual" unless GeneratedReply::TONES.include?(tone)
    skill = SkillProfile.first
    prompt = ReplyGenerationPrompt.build(job, skill, job.analysis_result, tone)
    raw = @client.complete(system: prompt.system, user: prompt.user, stub: prompt.stub, max_tokens: 1200)
    data = Llm::Json.parse(raw)

    resolved_tone = GeneratedReply::TONES.include?(data["tone"]) ? data["tone"] : tone
    job.generated_replies.create!(body: data["body"].to_s, tone: resolved_tone)
  end
end
