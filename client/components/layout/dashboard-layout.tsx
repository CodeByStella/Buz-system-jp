"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { authService } from "@/lib/services";
import { useDataContext } from "@/lib/contexts/DataContext";
import { DataProvider } from "@/lib/contexts";
import { Toast } from "@/components/ui/toast";
import { Menu } from "lucide-react";

// Import all sheet components
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
import { SheetNameType } from "@/lib/transformers/dataTransformer";

interface User {
  id: string;
  email: string;
  name?: string;
  role?: "ADMIN" | "USER";
}

const VALID_TABS: SheetNameType[] = [
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
] as const;

export default function DashboardLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    // Load last visited tab from localStorage on initial mount
    if (typeof window !== "undefined") {
      const savedTab = localStorage.getItem("lastVisitedTab");
      // Validate that the saved tab is a valid tab
      if (savedTab && VALID_TABS.includes(savedTab as any)) {
        return savedTab;
      }
    }
    return "start";
  });
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined" && activeTab) {
      localStorage.setItem("lastVisitedTab", activeTab);
    }
  }, [activeTab]);

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

  const renderContent = () => {
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
    <DataProvider>
      <DashboardContent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        renderContent={renderContent}
      />
    </DataProvider>
  );
}

// Separate component to access DataContext
function DashboardContent({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  renderContent,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  renderContent: () => React.ReactNode;
}) {
  const { errorMessage, successMessage, clearMessages } = useDataContext();

  // Universal viewport height fix for all browsers (handles mobile address bars and dynamic UI)
  useEffect(() => {
    // Set CSS custom property for viewport height to handle dynamic browser UI changes
    // Works on Safari/iPad, Chrome mobile, Firefox mobile, and all modern browsers
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener("resize", setViewportHeight);
    window.addEventListener("orientationchange", setViewportHeight);

    return () => {
      window.removeEventListener("resize", setViewportHeight);
      window.removeEventListener("orientationchange", setViewportHeight);
    };
  }, []);

  return (
    <div className="h-screen bg-gray-50  flex flex-col">
      <Header />
      <div className="flex-1  flex justify-center relative custom_main_container" >
        <div className="w-full max-w-[1440px] h-full p-4">
          <div className="h-full border border-gray-200 bg-white ">
            <div className="flex h-full">
              <Sidebar
                activeTab={activeTab as SheetNameType}
                onTabChange={setActiveTab}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
              <div className="w-full flex-1 flex flex-col  transition-all duration-300">
                <main className="flex-1 p-6 lg:p-6 md:p-4 sm:p-4 overflow-auto">
                  {renderContent()}
                </main>
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
