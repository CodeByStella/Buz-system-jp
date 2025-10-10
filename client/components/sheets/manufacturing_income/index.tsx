"use client";

import React, { useMemo } from "react";
import { AdvancedTable, Column } from "@/components/ui/advanced-table";
import {
  ProductRowDataType,
  SummaryRowDataType,
  AdjustmentRowDataType,
  PlanDifferenceRowDataType,
  GrossProfitRowDataType,
  manufacturingIncomeProducts,
  manufacturingIncomeSummary,
  manufacturingIncomeAdjustment,
  manufacturingIncomePlanDifference,
  manufacturingIncomeGrossProfit,
} from "./cells";
import { CustomInput } from "@/components/ui/customInput";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Save, Loader2 } from "lucide-react";
import { useDataContext } from "@/lib/contexts";
import { SheetNameType } from "@/lib/transformers/dataTransformer";

export default function ManufacturingIncomeSheet() {
  const { onSave, saving, hasChanges, loading, errorMessage, retry } =
    useDataContext();

  const sheetName: SheetNameType = "manufacturing_income";

  // Main Product Table Columns
  const productTableColumns: Column[] = useMemo(
    () => [
      {
        key: "product_name",
        title: "①商品名",
        width: 120,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: ProductRowDataType) => {
          return (
            <CustomInput
              type="text"
              sheet={sheetName}
              cell={record.product_name === "〇〇" ? "" : value}
              disabled={record.type === 0}
              readOnly={record.type === 2}
              placeholder={record.product_name === "〇〇" ? "商品名を入力" : ""}
              className={`border-transparent h-full text-xs text-center`}
            />
          );
        },
      },
      {
        key: "gross_profit_amount",
        title: "粗利益額",
        width: 100,
        align: "right",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: ProductRowDataType) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              disabled={record.type === 0}
              readOnly={record.type === 2}
              prefix="¥"
              className={`border-transparent h-full text-xs text-right bg-gray-50`}
            />
          );
        },
      },
      {
        key: "gross_profit_per_item",
        title: "④1個あたり粗利益",
        width: 100,
        align: "right",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: ProductRowDataType) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              disabled={record.type === 0}
              readOnly={record.type === 2}
              prefix="¥"
              className={`border-transparent h-full text-xs text-right`}
            />
          );
        },
      },
      {
        key: "quantity",
        title: "③数量",
        width: 80,
        align: "right",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: ProductRowDataType) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              disabled={record.type === 0}
              readOnly={record.type === 2}
              suffix="個"
              className={`border-transparent h-full text-xs text-right`}
            />
          );
        },
      },
      {
        key: "unit_price",
        title: "②単価",
        width: 100,
        align: "right",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: ProductRowDataType) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              disabled={record.type === 0}
              readOnly={record.type === 2}
              prefix="¥"
              className={`border-transparent h-full text-xs text-right`}
            />
          );
        },
      },
      {
        key: "sales",
        title: "売上",
        width: 100,
        align: "right",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: ProductRowDataType) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              disabled={record.type === 0}
              readOnly={record.type === 2}
              prefix="¥"
              className={`border-transparent h-full text-xs text-right bg-gray-50`}
            />
          );
        },
      },
      {
        key: "gross_profit_rate",
        title: "粗利益率",
        width: 80,
        align: "right",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: ProductRowDataType) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              disabled={record.type === 0}
              readOnly={record.type === 2}
              suffix="%"
              className={`border-transparent h-full text-xs text-right bg-gray-50`}
            />
          );
        },
      },
    ],
    [sheetName]
  );

  // Summary Table Columns
  const summaryTableColumns: Column[] = useMemo(
    () => [
      {
        key: "label",
        title: "",
        width: 100,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: SummaryRowDataType) => {
          return (
            <div
              className={cn(
                record.bgcolor,
                `flex items-center justify-center h-full w-full absolute top-0 left-0 text-xs font-medium`
              )}
            >
              {value}
            </div>
          );
        },
      },
      {
        key: "value",
        title: "",
        width: 100,
        align: "right",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: SummaryRowDataType) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              disabled={record.type === 0}
              readOnly={record.type === 2}
              prefix={
                value.includes("率") || value.includes("M(個)") ? "" : "¥"
              }
              suffix={
                value.includes("率")
                  ? "%"
                  : value.includes("M(個)") || value.includes("数量")
                  ? "個"
                  : ""
              }
              className={`border-transparent h-full text-xs text-right`}
            />
          );
        },
      },
    ],
    [sheetName]
  );

  // Adjustment Table Columns
  const adjustmentTableColumns: Column[] = useMemo(
    () => [
      {
        key: "label",
        title: "",
        width: 120,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: AdjustmentRowDataType) => {
          return (
            <div
              className={cn(
                record.bgcolor,
                `flex items-center justify-center h-full w-full absolute top-0 left-0 text-xs font-medium`
              )}
            >
              {value}
            </div>
          );
        },
      },
      {
        key: "value",
        title: "",
        width: 100,
        align: "right",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: AdjustmentRowDataType) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              disabled={record.type === 0}
              readOnly={record.type === 2}
              prefix={value.includes("率") ? "" : "¥"}
              suffix={
                value.includes("率") ? "%" : value.includes("人") ? "名" : ""
              }
              className={`border-transparent h-full text-xs text-right`}
            />
          );
        },
      },
    ],
    [sheetName]
  );

  // Plan Difference Table Columns
  const planDifferenceTableColumns: Column[] = useMemo(
    () => [
      {
        key: "label",
        title: "",
        width: 120,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: PlanDifferenceRowDataType) => {
          return (
            <div
              className={cn(
                record.bgcolor,
                `flex items-center justify-center h-full w-full absolute top-0 left-0 text-xs font-medium`
              )}
            >
              {value}
            </div>
          );
        },
      },
      {
        key: "value",
        title: "",
        width: 100,
        align: "right",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: PlanDifferenceRowDataType) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              disabled={record.type === 0}
              readOnly={record.type === 2}
              className={`border-transparent h-full text-xs text-right`}
            />
          );
        },
      },
    ],
    [sheetName]
  );

  // Gross Profit Table Columns
  const grossProfitTableColumns: Column[] = useMemo(
    () => [
      {
        key: "label",
        title: "",
        width: 120,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: GrossProfitRowDataType) => {
          return (
            <div
              className={cn(
                record.bgcolor,
                `flex items-center justify-center h-full w-full absolute top-0 left-0 text-xs font-medium`
              )}
            >
              {value}
            </div>
          );
        },
      },
      {
        key: "value",
        title: "",
        width: 100,
        align: "right",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: GrossProfitRowDataType) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              disabled={record.type === 0}
              readOnly={record.type === 2}
              className={`border-transparent h-full text-xs text-right`}
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
          <h1 className="text-2xl font-bold text-gray-900">⑦(PQ)原価の詳細</h1>
          <p className="text-gray-600">
            製造業の原価詳細を入力して、製品別の粗利益を分析します。
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

      {/* Header with instruction */}
      <div className="text-xs text-gray-600 mb-2">↓②~④に順番に記入</div>

      <div className="grid grid-rows-4 gap-4 flex-1 min-h-0">
        {/* Row 1 - Main Product Table */}
        <div className="row-span-2 flex flex-col space-y-2">
          <AdvancedTable
            columns={productTableColumns}
            data={manufacturingIncomeProducts}
            bordered
            dense
            stickyHeader
            maxHeight={"400px"}
            cellClassName="!p-0"
          />
          <div className="text-xs text-gray-600">
            ①業種、種別、商品名など商品群として並べたいものを任意で追記
          </div>
        </div>

        {/* Row 2 - Summary Section (実績) */}
        <div className="row-span-1">
          <AdvancedTable
            columns={summaryTableColumns}
            data={manufacturingIncomeSummary}
            bordered
            dense
            hideHeader
            maxHeight={"100px"}
            cellClassName="!p-0"
            title={
              <div className="text-sm font-semibold text-center w-full p-2 bg-yellow-300">
                実績
              </div>
            }
          />
        </div>

        {/* Row 3 - Adjustment Section (〇になるまで修正) */}
        <div className="row-span-1">
          <AdvancedTable
            columns={adjustmentTableColumns}
            data={manufacturingIncomeAdjustment}
            bordered
            dense
            hideHeader
            maxHeight={"150px"}
            cellClassName="!p-0"
            title={
              <div className="text-sm font-semibold text-center w-full p-2 bg-yellow-300">
                〇になるまで修正
              </div>
            }
          />
        </div>

        {/* Row 4 - Plan Difference and Gross Profit Sections */}
        <div className="row-span-1 grid grid-cols-2 gap-4">
          <AdvancedTable
            columns={planDifferenceTableColumns}
            data={manufacturingIncomePlanDifference}
            bordered
            dense
            hideHeader
            maxHeight={"100px"}
            cellClassName="!p-0"
            title={
              <div className="text-sm font-semibold text-center w-full p-2 bg-yellow-300">
                計画との差
              </div>
            }
          />
          <AdvancedTable
            columns={grossProfitTableColumns}
            data={manufacturingIncomeGrossProfit}
            bordered
            dense
            hideHeader
            maxHeight={"100px"}
            cellClassName="!p-0"
            title={
              <div className="text-sm font-semibold text-center w-full p-2 bg-yellow-300">
                粗利益額
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
