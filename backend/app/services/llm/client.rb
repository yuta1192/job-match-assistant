require "net/http"
require "json"

module Llm
  # Anthropic Messages API クライアント
  #
  # 学習テーマ:
  # - 外部API連携 / APIキー管理(ENV) / タイムアウト / エラーハンドリング
  # - 公式APIを「直接」呼ぶ(SDK gemを使わず Net::HTTP)。リクエスト/レスポンスの形を理解する。
  #
  # 設計理由:
  # - 依存を増やさず、HTTPヘッダ・ボディ・レスポンス構造を自分で扱うことで仕組みを把握する。
  # - ANTHROPIC_API_KEY が無い場合は API を呼ばず stub を返す。
  #   → キー未設定でも画面から分析/返信生成を試せる（Phase 6 のCIテストでもAPIを叩かない）。
  class Client
    API_URL = "https://api.anthropic.com/v1/messages".freeze
    ANTHROPIC_VERSION = "2023-06-01".freeze
    # コスト最小の Haiku を既定に。ENV で sonnet/opus へ変更可。
    DEFAULT_MODEL = "claude-haiku-4-5".freeze

    def initialize(api_key: ENV["ANTHROPIC_API_KEY"], model: ENV.fetch("ANTHROPIC_MODEL", DEFAULT_MODEL))
      @api_key = api_key
      @model = model
    end

    def enabled?
      @api_key.present?
    end

    # system 指示 + user 入力を渡し、モデルの応答テキストを返す。
    # キーが無ければ stub をそのまま返す（呼び出し側が用途別のスタブJSONを渡す）。
    def complete(system:, user:, stub:, max_tokens: 2000)
      unless enabled?
        Rails.logger.warn("[Llm::Client] ANTHROPIC_API_KEY 未設定のためスタブ応答を返します")
        return stub
      end

      request_message(system: system, user: user, max_tokens: max_tokens)
    end

    private

    def request_message(system:, user:, max_tokens:)
      uri = URI(API_URL)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.open_timeout = 10
      http.read_timeout = 60

      request = Net::HTTP::Post.new(uri)
      request["content-type"] = "application/json"
      request["x-api-key"] = @api_key
      request["anthropic-version"] = ANTHROPIC_VERSION
      request.body = {
        model: @model,
        max_tokens: max_tokens,
        system: system,
        messages: [{ role: "user", content: user }]
      }.to_json

      response = http.request(request)
      unless response.is_a?(Net::HTTPSuccess)
        raise Error, "Anthropic API エラー (#{response.code})"
      end

      extract_text(JSON.parse(response.body))
    rescue Net::OpenTimeout, Net::ReadTimeout => e
      raise Error, "Anthropic API がタイムアウトしました: #{e.message}"
    rescue JSON::ParserError => e
      raise Error, "Anthropic 応答の解析に失敗しました: #{e.message}"
    end

    # レスポンスの content 配列から text ブロックを連結して取り出す。
    def extract_text(body)
      blocks = body["content"] || []
      text = blocks.select { |b| b["type"] == "text" }.map { |b| b["text"] }.join
      raise Error, "Anthropic から空の応答が返りました" if text.strip.empty?

      text
    end
  end
end
