# CORS 設定
#
# Next.js(http://localhost:3000) から Rails API(http://localhost:3001) を
# 叩くには、ブラウザの同一オリジンポリシーを越えるため CORS 許可が必要。
# 許可オリジンは環境変数で差し替えられるようにし、デプロイ時に本番ドメインを指定する。

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch("FRONTEND_ORIGIN", "http://localhost:3000")

    resource "*",
             headers: :any,
             methods: %i[get post patch put delete options head]
  end
end
