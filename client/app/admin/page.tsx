"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserManagement } from "@/components/admin/user-management";
import { Header } from "@/components/layout/header";
import { DataProvider } from "@/lib/contexts";
import { authService } from "@/lib/services";

export default function AdminPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user?.role !== "ADMIN") {
          router.replace("/dashboard");
          return;
        }
      } catch {
        router.replace("/login");
        return;
      } finally {
        setChecking(false);
      }
    };
    verify();
  }, [router]);

  if (checking) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <DataProvider>
      <div className="h-screen bg-gray-50  flex flex-col">
        <Header />
        <div className="flex-1  flex justify-center">
          <div className="w-full max-w-[1440px] h-full p-4">
            <div className="h-full border border-gray-200 bg-white ">
              <div className="flex h-full">
                <div className="flex-1 flex flex-col ">
                  <main className="flex-1 p-6 overflow-auto space-y-6">
                    <UserManagement />
                  </main>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DataProvider>
  );
}
