import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ホームディレクトリにも package-lock.json があるため、Next がワークスペース
  // ルートを誤検出する。このプロジェクト(frontend)をルートに固定して警告を防ぐ。
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
