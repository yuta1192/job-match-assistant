require "json"

module Llm
  # LLM応答テキストからJSONを安定して取り出すヘルパ。
  #
  # 学習テーマ: LLM出力の不安定さへの対処（出力形式の安定化）
  # 設計理由:
  # - モデルは ```json フェンスや前置き文を付けることがあるため、
  #   コードフェンスを除去し、最初の { から最後の } までを切り出してから parse する。
  # - 解析に失敗したら Llm::Error にして、呼び出し側で扱いやすくする。
  module Json
    module_function

    def parse(text)
      cleaned = text.strip
      cleaned = cleaned.gsub(/\A```(?:json)?/, "").gsub(/```\z/, "").strip

      if (open_index = cleaned.index("{")) && (close_index = cleaned.rindex("}"))
        cleaned = cleaned[open_index..close_index]
      end

      ::JSON.parse(cleaned)
    rescue ::JSON::ParserError => e
      raise Error, "LLM応答のJSON解析に失敗しました: #{e.message}"
    end
  end
end
