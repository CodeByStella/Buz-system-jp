"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { authService } from "@/lib/services";
import { useDataContext, useOptionalDataContext } from "@/lib/contexts";

interface User {
  id: string;
  email: string;
  name?: string;
  role?: "ADMIN" | "USER";
}

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const optionalCtx = useOptionalDataContext();
  const companyName = optionalCtx?.getCell("start", "C1");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const data = await authService.getCurrentUser();
      setUser(data);
    } catch (error) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const goToAdminOrDashboard = () => {
    if (!user) return;
    const isOnAdmin = pathname?.startsWith("/admin");
    router.push(isOnAdmin ? "/dashboard" : "/admin");
  };

  if (loading) {
    return (
      <header
        className="bg-white border-b border-gray-200"
        style={{ height: 100 }}
      >
        <div className="h-full mx-auto max-w-[1440px] px-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-24 h-12 sm:w-32 sm:h-16 bg-gray-100 border border-gray-200" />
          </div>
          <div className="h-8 w-24 bg-gray-200 animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <header
      className="bg-white border-b border-gray-200"
      style={{ height: 100 }}
    >
      <div className="h-full mx-auto max-w-[1440px] px-4 flex justify-between items-center">
        <div className="flex items-center">
          <div
            className="cursor-pointer"
            onClick={() => router.push("/dashboard")}
            aria-label="ダッシュボードへ移動"
            role="button"
          >
            <Image
              src="/logo.png"
              alt="ビジネスシステム ロゴ"
              width={483}
              height={65}
              className="h-16 sm:h-16 object-contain"
              priority
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {user?.role === "ADMIN" && (
            <Button
              variant="outline"
              size="sm"
              onClick={goToAdminOrDashboard}
              className="flex items-center space-x-1"
            >
              <span>
                {pathname?.startsWith("/admin")
                  ? "ダッシュボードへ"
                  : "管理画面へ"}
              </span>
            </Button>
          )}
          <div className="flex items-center space-x-2">
            <span className="p-2 text-xs bg-red-50 text-red-600 border border-red-200 font-medium">
              {companyName && companyName !== "C1" ? String(companyName) : ""}
            </span>
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">{user?.name}</span>
            {user?.role === "ADMIN" && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800">
                管理者
              </span>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center space-x-1"
            leftIcon={LogOut}
          >
            <span>ログアウト</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
