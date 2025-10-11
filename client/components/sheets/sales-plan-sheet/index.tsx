"use client";

import React from "react";
import { salesPlanRows, monthNames, SalesPlanRowDataType } from "./cells";
import { CustomInput } from "@/components/ui/customInput";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Save, Loader2 } from "lucide-react";
import { useDataContext } from "@/lib/contexts";
import { SheetNameType } from "@/lib/transformers/dataTransformer";

export default function SalesPlanSheet() {
  const { onSave, saving, hasChanges, loading, errorMessage, retry } =
    useDataContext();

  const sheetName: SheetNameType = "sales_plan_by_department";

  // Create a custom table component to handle the complex header structure
  const renderSalesPlanTable = () => {
    return (
      <div className="w-full border border-gray-300" id="table-container">
        <table
          className="w-full border-collapse text-xs table-fixed"
          style={{ minWidth: "2000px" }}
        >
          {/* Complex Header Structure */}
          <thead>
            {/* First header row */}
            <tr className="bg-blue-100">
              <th
                rowSpan={2}
                className="border border-gray-300 p-2 text-center bg-blue-100"
                style={{ width: "120px" }}
              >
                商品名
              </th>
              <th
                colSpan={2}
                className="border border-gray-300 p-2 text-center bg-blue-100"
                style={{ width: "140px" }}
              >
                売上目標
              </th>
              {monthNames.map((month) => (
                <th
                  key={month}
                  colSpan={2}
                  className="border border-gray-300 p-2 text-center bg-blue-100"
                  style={{ width: "140px" }}
                >
                  {month}
                </th>
              ))}
              <th
                colSpan={2}
                className="border border-gray-300 p-2 text-center bg-blue-100"
                style={{ width: "140px" }}
              >
                累計
              </th>
              <th
                colSpan={2}
                className="border border-gray-300 p-2 text-center bg-blue-100"
                style={{ width: "140px" }}
              >
                当月
              </th>
              <th
                colSpan={2}
                className="border border-gray-300 p-2 text-center bg-blue-100"
                style={{ width: "140px" }}
              >
                累計
              </th>
            </tr>

            {/* Second header row */}
            <tr className="bg-blue-100">
              <th
                className="border border-gray-300 p-1 text-center bg-blue-100"
                style={{ width: "70px" }}
              >
                累計
              </th>
              <th
                className="border border-gray-300 p-1 text-center bg-blue-100"
                style={{ width: "70px" }}
              >
                当月
              </th>
              {monthNames.map((month) => (
                <React.Fragment key={month}>
                  <th
                    className="border border-gray-300 p-1 text-center bg-blue-100"
                    style={{ width: "70px" }}
                  >
                    累計
                  </th>
                  <th
                    className="border border-gray-300 p-1 text-center bg-blue-100"
                    style={{ width: "70px" }}
                  >
                    当月
                  </th>
                </React.Fragment>
              ))}
              <th
                className="border border-gray-300 p-1 text-center bg-blue-100"
                style={{ width: "70px" }}
              >
                累計
              </th>
              <th
                className="border border-gray-300 p-1 text-center bg-blue-100"
                style={{ width: "70px" }}
              >
                当月
              </th>
              <th
                className="border border-gray-300 p-1 text-center bg-blue-100"
                style={{ width: "70px" }}
              >
                累計
              </th>
              <th
                className="border border-gray-300 p-1 text-center bg-blue-100"
                style={{ width: "70px" }}
              >
                当月
              </th>
              <th
                className="border border-gray-300 p-1 text-center bg-blue-100"
                style={{ width: "70px" }}
              >
                累計
              </th>
              <th
                className="border border-gray-300 p-1 text-center bg-blue-100"
                style={{ width: "70px" }}
              >
                当月
              </th>
            </tr>
          </thead>

          {/* Data rows */}
          <tbody>
            {/* Global Sales Target Row */}
            <tr>
              <td
                className="border border-gray-300 p-2 text-center font-medium bg-green-100"
                style={{ width: "120px" }}
              >
                合計
              </td>
              <td
                className="border border-gray-300 p-2 text-center font-medium"
                style={{ width: "140px" }}
                colSpan={2}
              >
                <div className="w-full max-w-[120px] mx-auto">
                  <CustomInput
                    type="number"
                    sheet={sheetName}
                    cell="global_sales_target"
                    className="border-transparent h-8 text-sm text-center w-full"
                  />
                </div>
              </td>
              {monthNames.map((_, monthIndex) => (
                <React.Fragment key={monthIndex}>
                  <td
                    className="border border-gray-300 p-1 text-center"
                    style={{ width: "70px" }}
                  >
                    <div className="w-full max-w-[60px] mx-auto">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell={`global_month_${monthIndex}_current`}
                        className="border-transparent h-6 text-xs text-center w-full"
                      />
                    </div>
                  </td>
                  <td
                    className="border border-gray-300 p-1 text-center"
                    style={{ width: "70px" }}
                  >
                    <div className="w-full max-w-[60px] mx-auto">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell={`global_month_${monthIndex}_cumulative`}
                        className="border-transparent h-6 text-xs text-center w-full"
                      />
                    </div>
                  </td>
                </React.Fragment>
              ))}
              {/* Summary columns */}
              <td
                className="border border-gray-300 p-1 text-center"
                style={{ width: "70px" }}
              >
                <div className="w-full max-w-[60px] mx-auto">
                  <CustomInput
                    type="number"
                    sheet={sheetName}
                    cell="global_summary_current"
                    className="border-transparent h-6 text-xs text-center w-full"
                  />
                </div>
              </td>
              <td
                className="border border-gray-300 p-1 text-center"
                style={{ width: "70px" }}
              >
                <div className="w-full max-w-[60px] mx-auto">
                  <CustomInput
                    type="number"
                    sheet={sheetName}
                    cell="global_summary_cumulative"
                    className="border-transparent h-6 text-xs text-center w-full"
                  />
                </div>
              </td>
            </tr>

            {/* Category rows */}
            {salesPlanRows.map((row) => (
              <tr key={row.id}>
                {/* Product name */}
                <td
                  className={cn(
                    "border border-gray-300 p-2 text-center font-medium",
                    row.bgcolor
                  )}
                  style={{ width: "120px" }}
                  rowSpan={row.isSpanned ? undefined : 2}
                >
                  {row.isSpanned ? null : row.label}
                </td>

                {/* Sales target with label */}
                <td
                  className="border border-gray-300 p-2 text-center bg-blue-100"
                  style={{ width: "140px" }}
                  colSpan={2}
                >
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-full max-w-[80px]">
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell={row.salesTargetCumulative}
                        className="border-transparent h-6 text-xs text-center w-full"
                      />
                    </div>
                    <span className="text-xs font-medium">
                      {row.rowType === "target" ? "目標" : "実績"}
                    </span>
                  </div>
                </td>

                {/* Monthly data */}
                {row.monthlyData.map((monthData, index) => (
                  <React.Fragment key={index}>
                    <td
                      className="border border-gray-300 p-1 text-center bg-blue-100"
                      style={{ width: "70px" }}
                    >
                      <div className="w-full max-w-[60px] mx-auto">
                        <CustomInput
                          type="number"
                          sheet={sheetName}
                          cell={monthData.cumulative}
                          className="border-transparent h-6 text-xs text-center w-full"
                        />
                      </div>
                    </td>
                    <td
                      className="border border-gray-300 p-1 text-center bg-blue-100"
                      style={{ width: "70px" }}
                    >
                      <div className="w-full max-w-[60px] mx-auto">
                        <CustomInput
                          type="number"
                          sheet={sheetName}
                          cell={monthData.monthly}
                          className="border-transparent h-6 text-xs text-center w-full"
                        />
                      </div>
                    </td>
                  </React.Fragment>
                ))}

                {/* Summary data */}
                {row.summaryData.map((summaryData, index) => (
                  <React.Fragment key={index}>
                    <td
                      className="border border-gray-300 p-1 text-center bg-blue-100"
                      style={{ width: "70px" }}
                    >
                      <div className="w-full max-w-[60px] mx-auto">
                        <CustomInput
                          type="number"
                          sheet={sheetName}
                          cell={summaryData.cumulative}
                          className="border-transparent h-6 text-xs text-center w-full"
                        />
                      </div>
                    </td>
                    <td
                      className="border border-gray-300 p-1 text-center bg-blue-100"
                      style={{ width: "70px" }}
                    >
                      <div className="w-full max-w-[60px] mx-auto">
                        <CustomInput
                          type="number"
                          sheet={sheetName}
                          cell={summaryData.monthly}
                          className="border-transparent h-6 text-xs text-center w-full"
                        />
                      </div>
                    </td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

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
    <div className="h-full flex flex-col space-y-4 overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">部門別販売計画</h1>
          <p className="text-gray-600">
            各商品カテゴリの月次目標と実績を入力して、売上計画を立てます。
          </p>
        </div>
        <div className="flex gap-2">
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

      {/* Main Sales Plan Table */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div
          className="h-full overflow-auto pb-2"
          style={{ scrollbarWidth: "auto", scrollbarColor: "#cbd5e1 #f1f5f9" }}
        >
          {renderSalesPlanTable()}
        </div>
      </div>
    </div>
  );
}
