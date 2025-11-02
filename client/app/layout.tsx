import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";

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
  useEffect(() => {
    // ✅ Safari layout reflow fix
    document.body.style.display = "none";
    document.body.offsetHeight; // Force reflow
    document.body.style.display = "";
  }, []);

  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
