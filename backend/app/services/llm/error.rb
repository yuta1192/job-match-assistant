module Llm
  # LLM 連携で発生したエラーを表すドメイン例外。
  # コントローラ側でこれを rescue し、502 などで返す。
  class Error < StandardError; end
end
