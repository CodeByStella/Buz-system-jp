"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SheetNameType } from "@/lib/transformers/dataTransformer";

const navigationItems: { name: string; key: SheetNameType }[] = [
  { name: "スタート", key: "start" },
  { name: "MQ(現状)", key: "mq_current_status" },
  { name: "①利益", key: "profit" },
  { name: "②⑧MQ(未来)", key: "mq_future" },
  { name: "③給料", key: "salary" },
  { name: "④経費", key: "expenses" },
  { name: "⑤製造原価(人)", key: "manufacturing_labor" },
  { name: "⑥製造(経費)", key: "manufacturing_expenses" },
  { name: "⑦原価詳細", key: "manufacturing_income" },
  { name: "損益分岐点", key: "break_even_point" },
  { name: "進捗実績値入力シート", key: "progress_result_input" },
  { name: "部門別販売計画", key: "sales_plan_by_department" },
  { name: "利益計画表", key: "profit_planing_table" },
];

interface SidebarProps {
  activeTab: SheetNameType;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-auto">
      <div className="p-4 sticky top-0 bg-white border-b border-gray-100 z-10">
        <h2 className="text-lg font-semibold text-gray-900">メニュー</h2>
      </div>
      <nav className="mt-2 pb-4">
        {navigationItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onTabChange(item.key as SheetNameType)}
            className={cn(
              "block w-full text-left px-4 py-2 text-sm font-medium transition-colors",
              activeTab === item.key
                ? "bg-red-600 text-white border-r-2 border-red-700"
                : "text-gray-700 hover:bg-[#fdecea] hover:text-red-700"
            )}
          >
            {item.name}
          </button>
        ))}
      </nav>
    </div>
  );
}
