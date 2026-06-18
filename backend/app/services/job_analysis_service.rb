# JobAnalysisService
#
# 求人情報とスキルプロフィールを LLM へ渡し、
# 技術スタック抽出・マッチ理由・懸念点・面談質問を生成して保存する。
#
# 学習テーマ:
# - Rails Service Object（コントローラを薄く保つ）
# - 外部API連携 + レスポンス保存（raw_response）
# - トランザクションで「既存結果を入れ替える」一連の更新を原子的に行う
#
# 設計理由:
# - LLMクライアントを引数で差し替え可能にして、テスト時にモックを注入できるようにする（Phase 6）。
class JobAnalysisService
  def initialize(client: Llm::Client.new)
    @client = client
  end

  # 戻り値: 保存した AnalysisResult
  def call(job)
    skill = SkillProfile.first
    prompt = JobAnalysisPrompt.build(job, skill)
    raw = @client.complete(system: prompt.system, user: prompt.user, stub: prompt.stub)
    data = Llm::Json.parse(raw)
    persist(job, data, raw)
  end

  private

  def persist(job, data, raw)
    ActiveRecord::Base.transaction do
      replace_tech_stacks(job, data)
      upsert_analysis_result(job, data, raw)
    end
  end

  def replace_tech_stacks(job, data)
    job.job_tech_stacks.destroy_all
    Array(data["tech_stacks"]).each do |tech|
      # create(! ではない): 想定外の category/importance が来ても落とさず無視する
      job.job_tech_stacks.create(
        name: tech["name"],
        category: tech["category"],
        importance: tech["importance"]
      )
    end
  end

  def upsert_analysis_result(job, data, raw)
    result = job.analysis_result || job.build_analysis_result
    result.update!(
      matched_points: Array(data["matched_points"]),
      weak_points: Array(data["weak_points"]),
      concerns: Array(data["concerns"]),
      interview_questions: Array(data["interview_questions"]),
      suggested_positioning: data["suggested_positioning"].to_s,
      raw_response: raw # 再現性・デバッグ用に生レスポンスを保存
    )
    result
  end
end
