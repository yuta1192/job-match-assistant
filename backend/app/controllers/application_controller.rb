# ApplicationController
#
# 全 API コントローラの基底。共通の関心事をここに集約する。
#
# 学習テーマ:
# - API mode (ActionController::API) … View 層を持たず JSON 応答に特化
# - 例外の一元ハンドリング (rescue_from)
# - フロント(camelCase)とRails(snake_case)のキー変換の橋渡し
#
# 設計理由:
# - フロントの型は camelCase（companyName 等）、Rails/DB は snake_case（company_name）。
#   gem を足さず、出力は camelCase 化・入力は snake_case 化する小さなヘルパで吸収する。
#   「魔法」を使わず変換箇所が見えるので、面談でも説明しやすい。
class ApplicationController < ActionController::API
  # 代表的なエラーは JSON で一貫した形に整えて返す。
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable

  private

  # snake_case のハッシュ/配列を再帰的に lowerCamelCase キーへ変換して JSON 応答する。
  def render_json(resource, status: :ok)
    render json: camelize_keys(resource.as_json), status: status
  end

  def camelize_keys(value)
    case value
    when Array
      value.map { |v| camelize_keys(v) }
    when Hash
      value.each_with_object({}) do |(key, val), acc|
        acc[key.to_s.camelize(:lower)] = camelize_keys(val)
      end
    else
      value
    end
  end

  # 受信した camelCase の params を snake_case 化して扱いやすくする。
  # （permit 前に呼び、以降は Rails 流儀の snake_case で扱う）
  def underscored_params
    params.except(:controller, :action, :format)
          .to_unsafe_h
          .deep_transform_keys { |key| key.to_s.underscore }
  end

  def render_not_found
    render json: { message: "リソースが見つかりませんでした" }, status: :not_found
  end

  def render_unprocessable(exception)
    render json: { message: exception.record.errors.full_messages.join(", ") },
           status: :unprocessable_entity
  end
end
