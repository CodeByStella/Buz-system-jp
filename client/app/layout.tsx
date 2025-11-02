import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BodyReflowFix } from "@/components/layout/body-reflow-fix";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ビジネスシステム",
  description: "業務効率化のためのビジネス管理システム",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <BodyReflowFix />
        {children}
      </body>
    </html>
  );
}
