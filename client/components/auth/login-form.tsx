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

export function LoginForm() {
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
      const data = await authService.login({ email, password });

      // Set success state to prevent further interaction
      setSuccess(true);

      // Small delay to show success state before redirect
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Redirect admin users to admin page first
      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ログインに失敗しました");
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
              {loading ? "ログイン中..." : "リダイレクト中..."}
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
        className="w-full text-center mt-2 mb-12"
        style={{
          fontFamily: "'Noto Serif JP', serif",
          fontWeight: 900,
          fontSize: "1.2rem",
          letterSpacing: "0.04em",
          textShadow:
            "1px 2px 0 #fff, 1px 3px 8px rgba(0,0,0,0.08), 0 1px 0 #aaa",
        }}
      >
        会社の未来を社長の決断できめる財務戦略システム
      </div>

      {/* Parent container for login card and go to site section */}
      <div className="w-full max-w-4xl px-4 flex flex-col lg:flex-row gap-4 items-stretch justify-center">
        {/* Login Card */}
        <Card className="w-full max-w-md flex flex-col">
          <CardHeader>
            <CardTitle>ログイン</CardTitle>
            <CardDescription>
              ビジネスシステムにアクセスするためにログインしてください
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <form
              onSubmit={handleSubmit}
              className="space-y-4 flex-1 flex flex-col"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
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
                    ✓ ログイン成功！リダイレクト中...
                  </div>
                )}
              </div>
              <Button
                type="submit"
                className="w-full mt-auto"
                disabled={loading || success}
              >
                {loading
                  ? "ログイン中..."
                  : success
                  ? "リダイレクト中..."
                  : "ログイン"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Go to Site Section */}
        <div
          className="w-full max-w-md flex flex-col"
          style={{
            backgroundImage: "url(/background.jfif)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="relative w-full flex-1 rounded-md overflow-hidden flex items-center justify-center min-h-0">
            <Image
              src="/login.png"
              alt="サイトへアクセス"
              width={400}
              height={300}
              className="h-full w-auto object-contain"
              priority
            />
          </div>
          {/* Reserve space matching the error message area */}
          <div className="m-6">
            <Button
              type="button"
              variant="outline"
              className="w-full bg-white text-red-600 hover:bg-white hover:text-red-700 border-white"
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontWeight: 600,
              }}
              onClick={() => {
                window.open("https://tanoukou-skill.com/", "_blank");
              }}
            >
              サイトへアクセス
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
