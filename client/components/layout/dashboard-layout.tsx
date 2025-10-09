"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { authService, userService } from "@/lib/services";

// Import all sheet components
import MQCurrentSheet from "@/components/sheets/mq-current-sheet";
import { ProfitSheet } from "@/components/sheets/profit-sheet";
import MQFutureSheet from "@/components/sheets/mq-future-sheet";
import BreakevenSheet from "@/components/sheets/breakeven-sheet";
import SalarySheet from "@/components/sheets/salary-sheet";
import ExpensesSheet from "@/components/sheets/expenses-sheet";
import ManufacturingLaborSheet from "@/components/sheets/manufacturing-labor-sheet";
import ManufacturingExpensesSheet from "@/components/sheets/manufacturing-expenses-sheet";
import CostDetailsSheet from "@/components/sheets/cost-details-sheet";
import ProgressSheet from "@/components/sheets/progress-sheet";
import SalesPlanSheet from "@/components/sheets/sales-plan-sheet";
import ProfitPlanSheet from "@/components/sheets/profit-plan-sheet";
import StartSheet from "@/components/sheets/start-sheet";
import { transformBe2Fe, transformFe2Be } from "@/lib/transformers/dataTransformer";

interface User {
  id: string;
  email: string;
  name?: string;
  role?: "ADMIN" | "USER";
}

export default function DashboardLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("start"); // State for active tab
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    fetchUserInputs();
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

  const fetchUserInputs = async () => {
    try {
      const data = await userService.getUserInputs();
      console.log(transformBe2Fe(data), transformFe2Be(transformBe2Fe(data)));
    } catch (error) {
      console.error("Failed to fetch user inputs:", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "start":
        return <StartSheet />;
      case "mq-current":
        return <MQCurrentSheet />;
      case "profit":
        return <ProfitSheet />;
      case "mq-future":
        return <MQFutureSheet />;
      case "salary":
        return <SalarySheet />;
      case "expenses":
        return <ExpensesSheet />;
      case "manufacturing-labor":
        return <ManufacturingLaborSheet />;
      case "manufacturing-expenses":
        return <ManufacturingExpensesSheet />;
      case "cost-details":
        return <CostDetailsSheet />;
      case "breakeven":
        return <BreakevenSheet />;
      case "progress":
        return <ProgressSheet />;
      case "sales-plan":
        return <SalesPlanSheet />;
      case "profit-plan":
        return <ProfitPlanSheet />;
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">準備中</h1>
            <p className="text-gray-600">このセクションは開発中です。</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <div className="w-64 bg-white border-r border-gray-200 h-screen">
            <div className="p-4">
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="mt-4 space-y-2">
              {[...Array(13)].map((_, i) => (
                <div key={i} className="px-4 py-2">
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="p-6">
              <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">
      <Header />
      <div className="flex-1 overflow-hidden flex justify-center">
        <div className="w-full max-w-[1440px] h-full p-4">
          <div className="h-full border border-gray-200 bg-white overflow-hidden">
            <div className="flex h-full">
              <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
              <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 p-6 overflow-auto">
                  {renderContent()}
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
