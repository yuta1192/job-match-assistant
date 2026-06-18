/**
 * スキルプロフィール画面（"/skill-profile"）
 *
 * 学習テーマ:
 * - "use client"（取得した値を編集フォームの state に流し込む）
 * - useEffect での初期取得 + useState でのフォーム編集
 * - 配列項目（main_skills 等）をカンマ区切り文字列⇔配列に変換するUI設計
 *
 * 設計理由:
 * - スキルプロフィールは1件のみ（自分の情報）なので、一覧ではなく単一フォーム。
 * - 配列項目は入力しやすいよう「カンマ区切りテキスト」で編集し、保存時に配列へ戻す。
 * - Phase 2 では保存先が無いので送信時は console 出力のみ。Phase 3 で PATCH に差し替える。
 */

"use client";

import { useEffect, useState } from "react";
import { fetchSkillProfile, updateSkillProfile } from "@/lib/api";
import type { SkillProfileInput } from "@/types/skill";

// 配列 <-> カンマ区切り文字列の相互変換ヘルパ
const toText = (arr: string[]) => arr.join(", ");
const toArray = (text: string) =>
  text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export default function SkillProfilePage() {
  const [summary, setSummary] = useState("");
  const [mainSkills, setMainSkills] = useState("");
  const [learningSkills, setLearningSkills] = useState("");
  const [strongPoints, setStrongPoints] = useState("");
  const [desiredRoles, setDesiredRoles] = useState("");
  const [desiredWorkStyle, setDesiredWorkStyle] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchSkillProfile().then((res) => {
      if (!active || !res.ok) return;
      const p = res.data;
      // 取得した値をフォームの初期値として state に流し込む
      setSummary(p.summary);
      setMainSkills(toText(p.mainSkills));
      setLearningSkills(toText(p.learningSkills));
      setStrongPoints(toText(p.strongPoints));
      setDesiredRoles(toText(p.desiredRoles));
      setDesiredWorkStyle(p.desiredWorkStyle);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input: SkillProfileInput = {
      summary: summary.trim(),
      mainSkills: toArray(mainSkills),
      learningSkills: toArray(learningSkills),
      strongPoints: toArray(strongPoints),
      desiredRoles: toArray(desiredRoles),
      desiredWorkStyle: desiredWorkStyle.trim(),
    };
    const res = await updateSkillProfile(input);
    setMessage(res.ok ? "保存しました" : res.message);
  }

  if (loading) return <p className="text-gray-500">読み込み中...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">スキルプロフィール</h1>
      {message && <p className="text-sm text-green-700">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">職務要約</label>
          <textarea
            className="h-24 w-full rounded border px-3 py-2"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <TextField
          label="主な経験技術（カンマ区切り）"
          value={mainSkills}
          onChange={setMainSkills}
        />
        <TextField
          label="学習中の技術（カンマ区切り）"
          value={learningSkills}
          onChange={setLearningSkills}
        />
        <TextField
          label="得意領域（カンマ区切り）"
          value={strongPoints}
          onChange={setStrongPoints}
        />
        <TextField
          label="希望職種（カンマ区切り）"
          value={desiredRoles}
          onChange={setDesiredRoles}
        />
        <TextField
          label="希望する働き方"
          value={desiredWorkStyle}
          onChange={setDesiredWorkStyle}
        />
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          保存する
        </button>
      </form>
    </div>
  );
}

// 1行テキスト入力 + ラベルの部品。onChange は値だけを親へ返す形に簡略化。
function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        className="w-full rounded border px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
