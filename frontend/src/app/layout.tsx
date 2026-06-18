import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Job Match Assistant",
  description:
    "求人とスキルプロフィールから、技術スタック抽出・マッチ分析・返信文案を生成する転職活動支援アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* 全画面共通のヘッダーナビ。App Router の layout は全ページを包むため、
            ここに置いた要素はどの画面でも表示される（共通 UI の置き場）。 */}
        <header className="border-b">
          <nav className="mx-auto max-w-4xl flex items-center gap-6 px-4 py-3">
            <Link href="/" className="font-bold">
              Job Match Assistant
            </Link>
            <Link href="/job-postings" className="text-sm hover:underline">
              求人一覧
            </Link>
            <Link href="/skill-profile" className="text-sm hover:underline">
              スキルプロフィール
            </Link>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
