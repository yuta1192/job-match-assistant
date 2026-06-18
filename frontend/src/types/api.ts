/**
 * API 共通型 / レスポンスのラッパとエラー表現
 *
 * Udemy: Understanding TypeScript
 * 対応レクチャー: generics / type alias / union type / Promise / async
 *
 * 設計理由:
 * - 各エンドポイントのレスポンスは「データの中身」が違うだけで、成功/失敗の枠は共通。
 *   そこで generics<T> で中身を差し替えられる共通型を1つ用意し、型の重複を避ける。
 * - 成功と失敗を判別可能(discriminated)union にし、`ok` を見るだけで型が絞り込めるようにする。
 *   これにより、呼び出し側で「成功時だけ data に触れる」ことを型で強制できる。
 * - fetch を直接使う方針なので、HTTP まわりの最小限の型だけここに置く。
 */

// API 成功時のレスポンス。T に各ドメイン型（JobPosting 等）が入る。
export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

// API 失敗時のレスポンス。画面に出すメッセージと、任意で HTTP ステータスを持つ。
export interface ApiError {
  ok: false;
  message: string;
  status?: number;
}

/**
 * API 呼び出し結果。成功か失敗のどちらか（discriminated union）。
 * 使用例:
 *   const res = await fetchJob(id); // ApiResult<JobPosting>
 *   if (res.ok) { res.data ... } else { res.message ... }
 */
export type ApiResult<T> = ApiSuccess<T> | ApiError;

/**
 * 非同期 API 関数の戻り値を表す型エイリアス。
 * async 関数は Promise を返すので、関数シグネチャを簡潔に書くために用意する。
 * 使用例: function fetchJobs(): ApiPromise<JobPosting[]>
 */
export type ApiPromise<T> = Promise<ApiResult<T>>;
