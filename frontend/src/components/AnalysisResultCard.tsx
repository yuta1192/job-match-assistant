/**
 * AnalysisResultCard / マッチ分析結果の表示カード
 *
 * 学習テーマ:
 * - props / 条件レンダリング / list rendering
 * - 表示ロジックの部品化（求人詳細画面から分離して再利用）
 *
 * 設計理由:
 * - AnalysisResult は「複数の箇条書き(string[])」を多く持つので、
 *   ラベル付きリストを描く小さなヘルパに切り出して重複を減らす。
 */

import type { AnalysisResult } from "@/types/analysis";

type Props = {
  analysis: AnalysisResult | null;
};

// 箇条書き1ブロック分の表示。空配列なら何も描かない。
function PointList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-3">
      <h4 className="text-sm font-semibold">{title}</h4>
      <ul className="mt-1 list-disc pl-5 text-sm">
        {items.map((item, i) => (
          // 分析結果の各行は順序が固定で重複もないため index を key に使う
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function AnalysisResultCard({ analysis }: Props) {
  // まだ分析していない求人は null。その旨を案内する。
  if (!analysis) {
    return (
      <p className="text-sm text-gray-500">
        まだ分析結果がありません。（Phase 5 で「分析実行」を実装予定）
      </p>
    );
  }

  return (
    <div className="rounded-lg border p-4">
      <PointList title="マッチしている点" items={analysis.matchedPoints} />
      <PointList title="足りない点" items={analysis.weakPoints} />
      <PointList title="懸念点" items={analysis.concerns} />
      <PointList
        title="面談で確認すべき質問"
        items={analysis.interviewQuestions}
      />
      <div className="mt-3">
        <h4 className="text-sm font-semibold">自分の見せ方</h4>
        <p className="mt-1 text-sm">{analysis.suggestedPositioning}</p>
      </div>
    </div>
  );
}
