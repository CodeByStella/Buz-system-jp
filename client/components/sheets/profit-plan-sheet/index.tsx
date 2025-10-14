"use client";

import React from "react";
import { CustomInput } from "@/components/ui/customInput";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Save, Loader2 } from "lucide-react";
import { useDataContext } from "@/lib/contexts";
import { SheetNameType } from "@/lib/transformers/dataTransformer";
import { CustomTextarea } from "@/components/ui/customTextarea";

export default function ProfitPlanSheet() {
  const {
    onSave,
    saving,
    hasChanges,
    loading,
    errorMessage,
    retry,
    clearSheet,
  } = useDataContext();

  const sheetName: SheetNameType = "profit_planing_table";

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-gray-600">データを読み込んでいます...</p>
        </div>
      </div>
    );
  }

  // Show error message with retry option
  if (errorMessage) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-md mx-auto p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-600 text-center">
            <p className="text-lg font-semibold mb-2">エラーが発生しました</p>
            <p className="text-sm">{errorMessage}</p>
          </div>
          <Button
            variant="outline"
            onClick={retry}
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            再試行
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4 relative">
      <div className="lg:flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">利益計画表</h1>
          <p className="text-gray-600">
            粗利率の変動によるシナリオ分析を行います。
          </p>
        </div>
        <div className="flex gap-2 float-right">
          <Button
            variant="success"
            leftIcon={Save}
            loading={saving}
            loadingText="保存中..."
            onClick={onSave}
            disabled={saving || !hasChanges}
          >
            保存
          </Button>
          <Button
            variant="outline"
            className="border-red-500 text-red-700 hover:bg-red-50"
            onClick={() => {
              if (
                window.confirm(
                  "このシートの全入力をクリアします。よろしいですか？この操作は元に戻せません。"
                )
              ) {
                clearSheet("start");
              }
            }}
          >
            全入力クリア
          </Button>
          <Button
            variant="outline"
            leftIcon={FileSpreadsheet}
            className="border-green-500 text-green-700 hover:bg-green-50"
            onClick={() => {
              /* TODO: implement export to Excel logic */
            }}
          >
            Excel出力
          </Button>
          <Button
            variant="outline"
            leftIcon={FileText}
            className="border-red-500 text-red-700 hover:bg-red-50"
            onClick={() => {
              /* TODO: implement export to PDF logic */
            }}
          >
            PDF出力
          </Button>
        </div>
      </div>

      {/* Main Profit Plan Table */}
      <div className="relative">
        <div className="overflow-auto flex-1 min-h-0 w-full  absolute ">
          <div
            className="h-full min-w-[1000px] pb-2"
            style={{
              scrollbarWidth: "auto",
              scrollbarColor: "#cbd5e1 #f1f5f9",
            }}
          >
            <div
              className="w-full max-w-full border border-gray-300 overflow-auto"
              id="table-container"
            >
              <table className="border-collapse text-xs table-fixed w-[1000px]">
                {/* UP Scenarios Section */}
                <thead>
                  {/* UP Scenario Headers */}
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-center w-32"></th>
                    <th className="border border-gray-300 p-2 text-center w-32">
                      現状
                    </th>
                    <th className="border border-gray-300 p-2 text-center w-32">
                      粗利 1% UP
                    </th>
                    <th className="border border-gray-300 p-2 text-center w-32">
                      粗利 2% UP
                    </th>
                    <th className="border border-gray-300 p-2 text-center w-32">
                      粗利 3% UP
                    </th>
                    <th className="border border-gray-300 p-2 text-center w-32">
                      粗利 4% UP
                    </th>
                    <th className="border border-gray-300 p-2 text-center w-32">
                      粗利 5% UP
                    </th>
                    <th className="border border-gray-300 p-2 text-center w-32">
                      粗利 6% UP
                    </th>
                    <th className="border border-gray-300 p-2 text-center w-32">
                      粗利 7% UP
                    </th>
                    <th className="border border-gray-300 p-2 text-center w-32">
                      粗利 8% UP
                    </th>
                    <th className="border border-gray-300 p-2 text-center w-32">
                      粗利 9% UP
                    </th>
                    <th className="border border-gray-300 p-2 text-center w-32">
                      粗利 10% UP
                    </th>
                  </tr>
                </thead>

                {/* UP Scenario Data Rows */}
                <tbody>
                  {/* UP Gross Profit Rate Row */}
                  <tr>
                    <td className="border border-gray-300 p-2 text-center font-medium">
                      粗利率
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="B3"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="C3"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="D3"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="E3"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="F3"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="G3"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="H3"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="I3"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="J3"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="K3"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="L3"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                  </tr>
                  {/* Sales Row */}
                  <tr>
                    <td className="border border-gray-300 p-2 text-center font-medium">
                      売上
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="B4"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="C4"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="D4"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="E4"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="F4"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="G4"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="H4"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="I4"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="J4"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="K4"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="L4"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                  </tr>

                  {/* Variable Costs Row */}
                  <tr>
                    <td className="border border-gray-300 p-2 text-center font-medium">
                      変動費
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="B5"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="C5"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="D5"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="E5"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="F5"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="G5"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="H5"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="I5"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="J5"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="K5"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="L5"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                  </tr>

                  {/* Gross Profit Row */}
                  <tr>
                    <td className="border border-gray-300 p-2 text-center font-medium">
                      粗利
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="B6"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="C6"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="D6"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="E6"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="F6"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="G6"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="H6"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="I6"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="J6"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="K6"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="L6"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                  </tr>

                  {/* Fixed Costs Row */}
                  <tr>
                    <td className="border border-gray-300 p-2 text-center font-medium">
                      固定費
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="B7"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="C7"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="D7"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="E7"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="F7"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="G7"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="H7"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="I7"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="J7"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="K7"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="L7"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                  </tr>

                  {/* Operating Profit Row */}
                  <tr>
                    <td className="border border-gray-300 p-2 text-center font-medium">
                      営業利益
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="B8"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="C8"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="D8"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="E8"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="F8"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="G8"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="H8"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="I8"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="J8"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="K8"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="L8"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                  </tr>

                  {/* Profit Margin Row */}
                  <tr>
                    <td className="border border-gray-300 p-2 text-center font-medium">
                      益率
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="B9"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="C9"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="D9"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="E9"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="F9"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="G9"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="H9"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="I9"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="J9"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="K9"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="L9"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                  </tr>
                </tbody>

                {/* DOWN Scenarios Section */}
                <thead>
                  {/* DOWN Scenario Headers */}
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-center w-32"></th>
                    <th className="border border-gray-300 p-2 text-center w-32">
                      現状
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      粗利 1% DOWN
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      粗利 2% DOWN
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      粗利 3% DOWN
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      粗利 4% DOWN
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      粗利 5% DOWN
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      粗利 6% DOWN
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      粗利 7% DOWN
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      粗利 8% DOWN
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      粗利 9% DOWN
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      粗利 10% DOWN
                    </th>
                  </tr>
                </thead>

                {/* DOWN Scenario Data Rows */}
                <tbody>
                  {/* DOWN Gross Profit Rate Row */}
                  <tr>
                    <td className="border border-gray-300 p-2 text-center font-medium">
                      粗利率
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="B11"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="C11"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="D11"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="E11"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="F11"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="G11"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="H11"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="I11"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="J11"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="K11"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="L11"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                  </tr>
                  {/* Sales Row */}
                  <tr>
                    <td className="border border-gray-300 p-2 text-center font-medium">
                      売上
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="B12"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="C12"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="D12"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="E12"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="F12"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="G12"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="H12"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="I12"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="J12"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="K12"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="L12"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                  </tr>

                  {/* Variable Costs Row */}
                  <tr>
                    <td className="border border-gray-300 p-2 text-center font-medium">
                      変動費
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="B13"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="C13"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="D13"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="E13"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="F13"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="G13"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="H13"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="I13"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="J13"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="K13"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="L13"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                  </tr>

                  {/* Gross Profit Row */}
                  <tr>
                    <td className="border border-gray-300 p-2 text-center font-medium">
                      粗利
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="B14"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="C14"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="D14"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="E14"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="F14"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="G14"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="H14"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="I14"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="J14"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="K14"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="L14"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                  </tr>

                  {/* Fixed Costs Row */}
                  <tr>
                    <td className="border border-gray-300 p-2 text-center font-medium">
                      固定費
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="B15"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="C15"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="D15"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="E15"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="F15"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="G15"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="H15"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="I15"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="J15"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="K15"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="L15"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                  </tr>

                  {/* Operating Profit Row */}
                  <tr>
                    <td className="border border-gray-300 p-2 text-center font-medium">
                      営業利益
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="B16"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="C16"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="D16"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="E16"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="F16"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="G16"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="H16"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="I16"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="J16"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="K16"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="L16"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                      />
                    </td>
                  </tr>

                  {/* Profit Margin Row */}
                  <tr>
                    <td className="border border-gray-300 p-2 text-center font-medium">
                      益率
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="B17"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="C17"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="D17"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="E17"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="F17"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="G17"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="H17"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="I17"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="J17"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="K17"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center relative">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell="L17"
                        readOnly
                        className="border-transparent h-full text-sm text-center w-full !bg-white"
                        suffix="%"
                        renderValue={(v) => {
                          return Number(v) * 100;
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Notes Section - Sticky on horizontal scroll */}
            <div className="mt-4 space-y-2 p-4 bg-gray-50 border border-gray-200 sticky left-0 h-[250px] flex flex-col justify-between z-10">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                メモ:
              </h3>
              <div className="flex items-center relative h-full">
                <CustomTextarea
                  sheet={sheetName}
                  cell="A18"
                  className="flex-1 border border-gray-300 bg-white h-full"
                  placeholder="粗利が増えれば純利益が増えます。メモ"
                />
              </div>
              <div className="flex items-center relative h-full">
                <CustomTextarea
                  sheet={sheetName}
                  cell="A19"
                  className="flex-1 border border-gray-300 bg-white h-full"
                  placeholder="しかし10%落とすと・・・?"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
