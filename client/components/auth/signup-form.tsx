"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authService } from "@/lib/services";
import Image from "next/image";
import Link from "next/link";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await authService.signup({ name, email, password });
      
      // Set success state to prevent further interaction
      setSuccess(true);
      
      // Small delay to show success state before redirect
      await new Promise(resolve => setTimeout(resolve, 500));
      
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "サインアップに失敗しました"
      );
      setLoading(false); // Only reset loading on error
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {/* Loading overlay - fixed positioning to prevent layout shifts */}
      {(loading || success) && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">
              {loading ? "登録中..." : "リダイレクト中..."}
            </p>
          </div>
        </div>
      )}
      <Image
        src="/logo.png"
        alt="ビジネスシステム ロゴ"
        width={966}
        height={130}
        className="h-32 sm:h-20 w-auto object-contain"
        priority
      />
      <div
        className="w-full max-w-md text-center mt-2 mb-12"
        style={{
          fontFamily: "'Noto Serif JP', serif",
          fontWeight: 900,
          fontSize: "1.2rem",
          letterSpacing: "0.04em",
          textShadow:
            "1px 2px 0 #fff, 1px 3px 8px rgba(0,0,0,0.08), 0 1px 0 #aaa",
        }}
      >
        会社の未来を社長の決断できめる計画システム
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>新規登録</CardTitle>
          <CardDescription>
            初めての方はアカウントを作成してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                お名前
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading || success}
                placeholder="例: 山田 太郎"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                メールアドレス
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || success}
                placeholder="例: user@company.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                パスワード
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || success}
                placeholder="パスワードを入力"
              />
            </div>
            {/* Reserve space for messages to prevent layout shift */}
            <div className="h-6 flex items-center justify-center">
              {error && <div className="text-red-600 text-sm">{error}</div>}
              {success && (
                <div className="text-green-600 text-sm text-center">
                  ✓ 登録成功！リダイレクト中...
                </div>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || success}
            >
              {loading ? "登録中..." : success ? "リダイレクト中..." : "登録"}
            </Button>
          </form>
          <div className="mt-4 text-sm text-gray-600">
            すでにアカウントをお持ちですか？
            <Link href="/login" className="text-blue-600 underline ml-1">
              ログイン
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignupForm;


