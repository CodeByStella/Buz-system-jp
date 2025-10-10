"use client";

import React, { useMemo } from "react";
import { AdvancedTable, Column } from "@/components/ui/advanced-table";
import {
  ExpensesRowDataType,
  ExpensesSummaryRowDataType,
  fixedExpensesRows,
  fixedExpensesSummary,
  salesPromotionRows,
  salesPromotionSummary,
  personnelExpensesRows,
  personnelExpensesSummary,
  businessExpensesRows,
  businessExpensesSummary,
  grandTotalRow,
} from "./cells";
import { CustomInput } from "@/components/ui/customInput";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Save, Loader2 } from "lucide-react";
import { useDataContext } from "@/lib/contexts";
import { SheetNameType } from "@/lib/transformers/dataTransformer";

export default function ExpensesSheet() {
  const { onSave, saving, hasChanges, loading, errorMessage, retry } =
    useDataContext();

  const sheetName: SheetNameType = "expenses";

  // Define column configurations for each table
  const expensesTableColumns: Column[] = useMemo(
    () => [
      {
        key: "label",
        title: "科目",
        width: 120,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: ExpensesRowDataType) => {
          return (
            <div
              className={cn(
                record.bgcolor,
                `flex items-center justify-center h-full w-full absolute top-0 left-0 text-xs`
              )}
            >
              {value}
            </div>
          );
        },
      },
      {
        key: "value",
        title: "合計",
        width: 80,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: ExpensesRowDataType) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              className={`border-transparent h-full text-xs text-center`}
            />
          );
        },
      },
    ],
    [sheetName]
  );

  const summaryTableColumns: Column[] = useMemo(
    () => [
      {
        key: "label",
        title: "",
        width: 100,
        align: "center",
        cellClassName: "!p-0 !h-full relative bg-yellow-300 ",
      },
      {
        key: "value",
        title: "",
        width: 80,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: ExpensesSummaryRowDataType) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              readOnly
              className={`border-none h-full text-xs text-center`}
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
            ④ (F) 経費を入力する
          </h1>
          <p className="text-gray-600">
            経費の詳細を入力して、事業計画を立てます。
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

      {/* Header with unit note */}
      <div className="flex items-center justify-between gap-2">
        <div className="bg-yellow-100 p-1 h-full px-3 border w-full border-yellow-300 text-sm text-gray-700">
          <span className="font-semibold">(百万円)</span>
        </div>
        <div className="max-w-md w-full">
          <AdvancedTable
            columns={summaryTableColumns}
            data={[grandTotalRow]}
            bordered
            dense
            hideHeader
            className="border-none"
            cellClassName="!p-0"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 flex-1 min-h-0">
        {/* 経費(固定) - Fixed Expenses */}
        <div className="flex flex-col space-y-2">
            <AdvancedTable
              columns={expensesTableColumns}
              data={fixedExpensesRows}
              bordered
              dense
              title={
                <h3 className="text-lg font-semibold text-center w-full p-1">
                  経費(固定)
                </h3>
              }
              cellClassName="!p-0"
              footerContent={
                <AdvancedTable
                  columns={summaryTableColumns}
                  data={fixedExpensesSummary}
                  bordered
                  dense
                  hideHeader
                  maxHeight={"100px"}
                  cellClassName="!p-0"
                />
              }
            />
        </div>

        {/* 販売促進費 - Sales Promotion Expenses */}
        <div className="flex flex-col space-y-2">
            <AdvancedTable
              columns={expensesTableColumns}
              data={salesPromotionRows}
              bordered
              dense
              title={
                <h3 className="text-lg font-semibold text-center w-full p-1">
                  販売促進費
                </h3>
              }
              cellClassName="!p-0"
              footerContent={
                <AdvancedTable
                  columns={summaryTableColumns}
                  data={salesPromotionSummary}
                  bordered
                  dense
                  hideHeader
                  maxHeight={"100px"}
                  cellClassName="!p-0"
                />
              }
            />
        </div>

        {/* 人件費 - Personnel Expenses */}
        <div className="flex flex-col space-y-2">
            <AdvancedTable
              columns={expensesTableColumns}
              data={personnelExpensesRows}
              bordered
              dense
              title={
                <h3 className="text-lg font-semibold text-center w-full p-1">
                  人件費
                </h3>
              }
              cellClassName="!p-0"
              footerContent={
                <AdvancedTable
                  columns={summaryTableColumns}
                  data={personnelExpensesSummary}
                  bordered
                  dense
                  hideHeader
                  maxHeight={"100px"}
                  cellClassName="!p-0"
                />
              }
            />
        </div>

        {/* 事業費 - Business Expenses */}
        <div className="flex flex-col space-y-2">
          <AdvancedTable
            columns={expensesTableColumns}
            data={businessExpensesRows}
            bordered
            dense
            title={
              <h3 className="text-lg font-semibold text-center w-full p-1">
                事業費
              </h3>
            }
            cellClassName="!p-0"
            footerContent={
              <AdvancedTable
                columns={summaryTableColumns}
                data={businessExpensesSummary}
                bordered
                dense
                hideHeader
                maxHeight={"100px"}
                cellClassName="!p-0"
              />
            }
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 p-3">
        <div className="text-xs text-yellow-800 space-y-1">
          <p>
            売上が増えれば経費も人件費も増えます。必要な経費は使い、無駄な費用は圧縮させます。基本的には前年度よりも多く経費を記入する事です。105%~115%が望ましい。
          </p>
          <p>
            ※項目は自由に書き足し、訂正可能。現状よりも必ず上げるように調整しましょう。
          </p>
        </div>
      </div>
    </div>
  );
}
