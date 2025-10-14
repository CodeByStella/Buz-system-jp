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
  const {
    onSave,
    saving,
    hasChanges,
    loading,
    errorMessage,
    retry,
    getCell,
    clearSheet,
  } = useDataContext();

  const sheetName: SheetNameType = "sales_plan_by_department";

  // Read directly from context so it updates when data changes
  const startDate: string = getCell("start", "B2") as string;
  // 年月だけ取得 (YYYY/MM の形式で月部分だけ抽出)
  const startMonth: number | undefined =
    typeof startDate === "string"
      ? parseInt(startDate.split("/")[1])
      : undefined;
  // 表示用の月配列を作成（開始月から翌年の開始月-1まで）
  const displayMonths: string[] = React.useMemo(() => {
    const base =
      typeof startMonth === "number" && !isNaN(startMonth) ? startMonth : 1; // デフォルトは1月開始
    return Array.from({ length: 12 }, (_, i) => {
      const m = ((base - 1 + i) % 12) + 1;
      return `${m}月`;
    });
  }, [startMonth]);

  const renderSalesPlanTable = () => {
    return (
      <div
        className="w-full border border-gray-300 relative"
        id="table-container"
      >
        <table className="border-collapse text-xs table-fixed w-full absolute overflow-auto">
          {/* Complex Header Structure */}
          <thead>
            {/* First header row */}
            <tr className="bg-gray-100">
              <th
                rowSpan={2}
                className="border border-gray-300 p-2 text-center bg-gray-100"
                style={{ width: "120px" }}
              >
                商品名
              </th>
              <th
                className="border border-gray-300 p-2 text-center bg-gray-100"
                style={{ width: "140px" }}
              >
                売上目標
              </th>
              <th
                className="border border-gray-300 p-2 text-center bg-gray-100"
                style={{ width: "50px" }}
                rowSpan={2}
              />
              {displayMonths.map((month, index) => (
                <th
                  key={`${month}-header`}
                  colSpan={2}
                  className="border border-gray-300 p-2 text-center bg-gray-100"
                  style={{ width: "140px" }}
                >
                  {month}
                </th>
              ))}
            </tr>

            {/* Second header row */}
            <tr className="bg-gray-100">
              <th
                className="border border-gray-300 p-1 text-center bg-gray-100 relative"
                style={{ width: "70px" }}
              >
                <CustomInput
                  type="number"
                  sheet={sheetName}
                  cell="B2"
                  readOnly
                  className="border-transparent h-6 text-xs text-center w-full !bg-gray-100"
                />
              </th>
              {displayMonths.map((month) => (
                <React.Fragment key={`${month}-header1`}>
                  <th
                    className="border border-gray-300 p-1 text-center bg-gray-100"
                    style={{ width: "70px" }}
                  >
                    当月
                  </th>
                  <th
                    className="border border-gray-300 p-1 text-center bg-gray-100"
                    style={{ width: "70px" }}
                  >
                    累計
                  </th>
                </React.Fragment>
              ))}
            </tr>
          </thead>

          {/* Data rows */}
          <tbody>
            {/* Category rows */}
            {salesPlanRows.map((row, id: number) => (
              <tr key={`${id}-row`}>
                {/* Product name */}
                {row.rowType === "target" && (
                  <td
                    className={cn(
                      "border border-gray-300 p-2 text-center font-medium relative",
                      row.rowType === "target" ? "bg-gray-100" : "bg-blue-50"
                    )}
                    style={{ width: "120px" }}
                    rowSpan={2}
                  >
                    <CustomInput
                      type="text"
                      sheet={sheetName}
                      cell={row.label}
                      readOnly
                      className={`border-transparent text-center w-full h-full !bg-gray-100`}
                    />
                  </td>
                )}

                {/* Sales target with label */}
                <td
                  className="border border-gray-300 p-2 text-center bg-gray-100 relative"
                  style={{ width: "140px" }}
                >
                  <CustomInput
                    type="number"
                    sheet={sheetName}
                    cell={
                      row.rowType === "target"
                        ? row.salesTarget
                        : row.salesActual
                    }
                    readOnly
                    className="border-transparent w-full h-full !bg-gray-100"
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center bg-gray-100">
                  {row.rowType === "target" ? "目標" : "実績"}
                </td>

                {/* Monthly data */}
                {row.monthlyData.map((monthData, index) => (
                  <React.Fragment
                    key={`${index}-monthlyData-${monthData.current}`}
                  >
                    <td
                      className="border border-gray-300 p-2 text-center bg-gray-100 relative"
                      style={{ width: "70px" }}
                    >
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell={monthData.current}
                        className="border-transparent h-full w-full"
                      />
                    </td>
                    <td
                      className="border border-gray-300 p-2 text-center bg-gray-100 relative"
                      style={{ width: "70px" }}
                    >
                      <CustomInput
                        type="number"
                        sheet={sheetName}
                        cell={monthData.total}
                        readOnly
                        className="border-transparent h-full w-full !bg-gray-100"
                      />
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
    <div className="h-full flex flex-col space-y-4 ">
      <div className="lg:flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">部門別販売計画</h1>
          <p className="text-gray-600">
            各商品カテゴリの月次目標と実績を入力して、売上計画を立てます。
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

      {/* Main Sales Plan Table */}
      <div className="w-full overflow-auto flex-1 min-h-0 ">
        <div
          className="h-full overflow-auto"
          style={{ scrollbarWidth: "auto", scrollbarColor: "#cbd5e1 #f1f5f9" }}
        >
          {renderSalesPlanTable()}
        </div>
      </div>
    </div>
  );
}
