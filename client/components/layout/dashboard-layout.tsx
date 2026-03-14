"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { authService } from "@/lib/services";
import { useDataContext, DataProvider, WorkbookProvider, useWorkbookContext } from "@/lib/contexts";
import { Toast } from "@/components/ui/toast";
import { Menu } from "lucide-react";

import InputDataSheet from "@/components/sheets/company-rating/input-data-sheet";
import ResultSheet from "@/components/sheets/company-rating/result-sheet";
import ScoreTableSheet from "@/components/sheets/company-rating/score-table-sheet";
import SafetyIndicatorsSheet from "@/components/sheets/company-rating/safety-indicators-sheet";

// Import all PDCA sheet components
import MQCurrentSheet from "@/components/sheets/mq-current-sheet";
import ProfitSheet from "@/components/sheets/profit-sheet";
import MQFutureSheet from "@/components/sheets/mq-future-sheet";
import BreakevenSheet from "@/components/sheets/breakeven-sheet";
import SalarySheet from "@/components/sheets/salary-sheet";
import ExpensesSheet from "@/components/sheets/expenses-sheet";
import ManufacturingLaborSheet from "@/components/sheets/manufacturing-labor-sheet";
import ManufacturingExpensesSheet from "@/components/sheets/manufacturing-expenses-sheet";
import ManufacturingIncome from "@/components/sheets/manufacturing_income";
import SalesPlanSheet from "@/components/sheets/sales-plan-sheet";
import ProfitPlanSheet from "@/components/sheets/profit-plan-sheet";
import ProgressResultInputSheet from "@/components/sheets/progress-result-input-sheet";
import StartSheet from "@/components/sheets/start-sheet";
import {
  SheetNameType,
  CompanyRatingSheetNameType,
  type ActiveTabType,
  type WorkbookType,
} from "@/lib/transformers/dataTransformer";

interface User {
  id: string;
  email: string;
  name?: string;
  role?: "ADMIN" | "USER";
}

const PDCA_TABS: SheetNameType[] = [
  "start",
  "mq_current_status",
  "profit",
  "mq_future",
  "salary",
  "expenses",
  "manufacturing_labor",
  "manufacturing_expenses",
  "manufacturing_income",
  "break_even_point",
  "progress_result_input",
  "sales_plan_by_department",
  "profit_planing_table",
];

const COMPANY_RATING_TABS: CompanyRatingSheetNameType[] = [
  "input_data",
  "result",
  "score_table",
  "safety_indicators",
];

function getValidTabs(workbook: WorkbookType): ActiveTabType[] {
  return workbook === "company_rating" ? [...COMPANY_RATING_TABS] : [...PDCA_TABS];
}

function getDefaultTab(workbook: WorkbookType): ActiveTabType {
  return workbook === "company_rating" ? "input_data" : "start";
}

export default function DashboardLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

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

  const renderContent = (activeTab: ActiveTabType) => {
    switch (activeTab) {
      case "start":
        return <StartSheet />;
      case "mq_current_status":
        return <MQCurrentSheet />;
      case "profit":
        return <ProfitSheet />;
      case "mq_future":
        return <MQFutureSheet />;
      case "salary":
        return <SalarySheet />;
      case "expenses":
        return <ExpensesSheet />;
      case "manufacturing_labor":
        return <ManufacturingLaborSheet />;
      case "manufacturing_expenses":
        return <ManufacturingExpensesSheet />;
      case "manufacturing_income":
        return <ManufacturingIncome />;
      case "break_even_point":
        return <BreakevenSheet />;
      case "progress_result_input":
        return <ProgressResultInputSheet />;
      case "sales_plan_by_department":
        return <SalesPlanSheet />;
      case "profit_planing_table":
        return <ProfitPlanSheet />;
      case "input_data":
        return <InputDataSheet />;
      case "result":
        return <ResultSheet />;
      case "score_table":
        return <ScoreTableSheet />;
      case "safety_indicators":
        return <SafetyIndicatorsSheet />;
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
          <div className="hidden lg:block w-64 bg-white border-r border-gray-200 h-screen">
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
        
        {/* Loading floating button for mobile - positioned at 70% height */}
        <div className="lg:hidden fixed left-4 z-40 bg-gray-300 p-3 rounded-full shadow-lg animate-pulse" style={{ top: '70%' }}>
          <div className="h-6 w-6"></div>
        </div>
      </div>
    );
  }

  return (
    <WorkbookProvider>
      <DataProvider>
        <DashboardContent
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          renderContent={renderContent}
        />
      </DataProvider>
    </WorkbookProvider>
  );
}

function DashboardContent({
  sidebarOpen,
  setSidebarOpen,
  renderContent,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  renderContent: (activeTab: ActiveTabType) => React.ReactNode;
}) {
  const { workbook, setWorkbook } = useWorkbookContext();
  const validTabs = getValidTabs(workbook);
  const defaultTab = getDefaultTab(workbook);
  const [activeTab, setActiveTab] = useState<ActiveTabType>(() => {
    if (typeof window !== "undefined") {
      const savedTab = localStorage.getItem("lastVisitedTab");
      const savedWorkbook = localStorage.getItem("lastWorkbook");
      if (savedWorkbook === workbook && savedTab && validTabs.includes(savedTab as ActiveTabType)) {
        return savedTab as ActiveTabType;
      }
    }
    return defaultTab;
  });
  const { errorMessage, successMessage, clearMessages } = useDataContext();

  useEffect(() => {
    if (!validTabs.includes(activeTab)) {
      setActiveTab(defaultTab);
    }
  }, [workbook]);

  useEffect(() => {
    if (typeof window !== "undefined" && activeTab) {
      localStorage.setItem("lastVisitedTab", activeTab);
    }
  }, [activeTab]);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header workbook={workbook} />
      <div className="flex-1 flex flex-col min-h-0 relative custom_main_container">
        <div className="flex-1 flex justify-center min-h-0 w-full">
          <div className="w-full max-w-[1440px] h-full flex flex-col min-h-0 p-4">
            <div className="flex-shrink-0 border-b border-gray-200 bg-white px-4 py-2 flex gap-2">
              <button
                onClick={() => setWorkbook("pdca")}
                className={`px-4 py-2 rounded text-sm font-medium ${
                  workbook === "pdca"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                短期計画PDCA
              </button>
              <button
                onClick={() => setWorkbook("company_rating")}
                className={`px-4 py-2 rounded text-sm font-medium ${
                  workbook === "company_rating"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                会社評価
              </button>
            </div>
            <div className="flex-1 min-h-0 border border-gray-200 bg-white border-t-0 flex flex-col">
              <div className="flex flex-1 min-h-0 min-w-0">
                <Sidebar
                  workbook={workbook}
                  activeTab={activeTab}
                  onTabChange={(tab) => setActiveTab(tab as ActiveTabType)}
                  isOpen={sidebarOpen}
                  onClose={() => setSidebarOpen(false)}
                />
                <div className="min-w-0 w-full flex-1 flex flex-col min-h-0 transition-all duration-300">
                  <main className="flex-1 min-h-0 min-w-0 p-6 lg:p-6 md:p-4 sm:p-4 overflow-auto">
                    {renderContent(activeTab)}
                  </main>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Menu Button for Mobile - positioned at 70% height */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed left-4 z-40 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors"
          style={{ bottom: '70%' }}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Toast notifications */}
      {successMessage && (
        <Toast
          type="success"
          message={successMessage}
          onClose={clearMessages}
        />
      )}
      {errorMessage && (
        <Toast type="error" message={errorMessage} onClose={clearMessages} />
      )}
    </div>
  );
}
