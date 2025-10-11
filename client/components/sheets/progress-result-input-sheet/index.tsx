"use client";

import React, { useMemo } from "react";
import { AdvancedTable, Column } from "@/components/ui/advanced-table";
import {
  ProgressResultRowDataType,
  FixedExpenseRowDataType,
  settlementTarget_cells,
  fixedExpenses_cells,
  businessExpenses_cells,
  personnelCost_cells,
  salesPromotion_cells,
  manufacturingBusinessExpenses_cells,
  manufacturingPersonnelCost_cells,
  manufacturingSalesPromotion_cells,
  manufacturingFixedExpenses_cells,
} from "./cells";
import { CustomInput } from "@/components/ui/customInput";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Save, Loader2 } from "lucide-react";
import { useDataContext } from "@/lib/contexts";
import { SheetNameType } from "@/lib/transformers/dataTransformer";

export default function ProgressResultInputSheet() {
  const { onSave, saving, hasChanges, loading, errorMessage, retry } =
    useDataContext();

  const sheetName: SheetNameType = "progress_result_input";

  const progressTableColumns: Column[] = useMemo(
    () => [
      {
        key: "label",
        title: "",
        width: 120,
        align: "left",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: ProgressResultRowDataType) => {
          return (
            <div
              className={cn(
                record.bgcolor || "bg-white",
                "flex items-center h-full w-full absolute top-0 left-0 text-sm px-2 font-medium"
              )}
            >
              {value}
            </div>
          );
        },
      },
      {
        key: "target",
        title: "目標",
        width: 80,
        align: "right",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: ProgressResultRowDataType) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              disabled={record.type === 0}
              readOnly={record.type === 2}
              tip={record.tip}
              tipClassName="text-red-500"
              className={`border-transparent h-full text-sm text-right`}
            />
          );
        },
      },
      {
        key: "actual",
        title: "実績",
        width: 80,
        align: "right",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: ProgressResultRowDataType) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              disabled={record.type === 0}
              readOnly={record.type === 2}
              tip={record.tip}
              tipClassName="text-red-500"
              className={`border-transparent h-full text-sm text-right`}
            />
          );
        },
      },
      {
        key: "cumulative",
        title: "累積",
        width: 80,
        align: "right",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: ProgressResultRowDataType) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              disabled={record.type === 0}
              readOnly={record.type === 2}
              tip={record.tip}
              tipClassName="text-red-500"
              className={`border-transparent h-full text-sm text-right`}
            />
          );
        },
      },
    ],
    [sheetName]
  );

  const fixedExpenseTableColumns: Column[] = useMemo(
    () => [
      {
        key: "label",
        title: "",
        width: 120,
        align: "left",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: FixedExpenseRowDataType) => {
          return (
            <div
              className={cn(
                record.bgcolor || "bg-white",
                "flex items-center h-full w-full absolute top-0 left-0 text-sm px-2 font-medium"
              )}
            >
              {value}
            </div>
          );
        },
      },
      {
        key: "target",
        title: "目標",
        width: 80,
        align: "right",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: FixedExpenseRowDataType) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              disabled={record.type === 0}
              readOnly={record.type === 2}
              tip={record.tip}
              tipClassName="text-red-500"
              className={`border-transparent h-full text-sm text-right`}
            />
          );
        },
      },
      {
        key: "actual",
        title: "実績",
        width: 80,
        align: "right",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: FixedExpenseRowDataType) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              disabled={record.type === 0}
              readOnly={record.type === 2}
              tip={record.tip}
              tipClassName="text-red-500"
              className={`border-transparent h-full text-sm text-right`}
            />
          );
        },
      },
    ],
    [sheetName]
  );

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
          <h1 className="text-2xl font-bold text-gray-900">
            進捗実績入力シート
          </h1>
          <p className="text-gray-600">4期短期計画 - 目標売上成長率: 126.8%</p>
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

      {/* Warning message */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <p className="text-sm text-red-700">
          毎月の試算表が届き次第、実績を加算していく。その際に目標より高くなればその項目は目標よりオーバーしている事になり、注意が必要。経費が掛かりすぎてないか、
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 p-1">
            {/* Left Column - 決算目標 & 経費(固定) */}
            <div className="flex flex-col space-y-4">
              {/* 決算目標 */}
              <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-blue-500 text-white px-3 py-2 text-sm font-semibold">
                  決算目標
                </div>
                <AdvancedTable
                  columns={progressTableColumns}
                  data={settlementTarget_cells}
                  bordered
                  dense
                  hideHeader
                  cellClassName="!p-0"
                />
              </div>

              {/* 経費(固定) */}
              <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-orange-500 text-white px-3 py-2 text-sm font-semibold">
                  経費(固定)
                </div>
                <AdvancedTable
                  columns={fixedExpenseTableColumns}
                  data={fixedExpenses_cells}
                  bordered
                  dense
                  hideHeader
                  cellClassName="!p-0"
                />
              </div>

              {/* 製造原価内訳 - 事業費 */}
              <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-blue-400 text-white px-3 py-2 text-sm font-semibold">
                  製造原価内訳 - 事業費
                </div>
                <AdvancedTable
                  columns={progressTableColumns}
                  data={manufacturingBusinessExpenses_cells}
                  bordered
                  dense
                  hideHeader
                  cellClassName="!p-0"
                />
              </div>

              {/* 製造原価内訳 - 人件費 */}
              <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-teal-400 text-white px-3 py-2 text-sm font-semibold">
                  製造原価内訳 - 人件費
                </div>
                <AdvancedTable
                  columns={progressTableColumns}
                  data={manufacturingPersonnelCost_cells}
                  bordered
                  dense
                  hideHeader
                  cellClassName="!p-0"
                />
              </div>
            </div>

            {/* Right Column - 経費内訳 & 製造原価内訳 */}
            <div className="flex flex-col space-y-4">
              {/* 事業費 */}
              <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-blue-400 text-white px-3 py-2 text-sm font-semibold">
                  事業費
                </div>
                <AdvancedTable
                  columns={progressTableColumns}
                  data={businessExpenses_cells}
                  bordered
                  dense
                  hideHeader
                  cellClassName="!p-0"
                />
              </div>

              {/* 人件費内訳 */}
              <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-yellow-400 text-white px-3 py-2 text-sm font-semibold">
                  人件費内訳
                </div>
                <AdvancedTable
                  columns={progressTableColumns}
                  data={personnelCost_cells}
                  bordered
                  dense
                  hideHeader
                  cellClassName="!p-0"
                />
              </div>

              {/* 販売促進費 */}
              <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-green-400 text-white px-3 py-2 text-sm font-semibold">
                  販売促進費
                </div>
                <AdvancedTable
                  columns={progressTableColumns}
                  data={salesPromotion_cells}
                  bordered
                  dense
                  hideHeader
                  cellClassName="!p-0"
                />
              </div>

              {/* 製造原価内訳 - 販売促進費 */}
              <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-green-400 text-white px-3 py-2 text-sm font-semibold">
                  製造原価内訳 - 販売促進費
                </div>
                <AdvancedTable
                  columns={progressTableColumns}
                  data={manufacturingSalesPromotion_cells}
                  bordered
                  dense
                  hideHeader
                  cellClassName="!p-0"
                />
              </div>

              {/* 製造原価内訳 - 経費(固定) */}
              <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-orange-400 text-white px-3 py-2 text-sm font-semibold">
                  製造原価内訳 - 経費(固定)
                </div>
                <AdvancedTable
                  columns={fixedExpenseTableColumns}
                  data={manufacturingFixedExpenses_cells}
                  bordered
                  dense
                  hideHeader
                  cellClassName="!p-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
