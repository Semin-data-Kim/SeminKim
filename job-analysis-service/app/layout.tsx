import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 채용 공고 분석 서비스",
  description: "이력서와 채용 공고를 AI로 분석하여 맞춤형 인사이트를 제공합니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
