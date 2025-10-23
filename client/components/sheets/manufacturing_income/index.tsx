"use client";

import React, { useMemo, useState } from "react";
import { AdvancedTable, Column } from "@/components/ui/advanced-table";
import {
  CellType,
  ProductRowDataType,
  SummaryRowDataType,
  TotalValueType,
  grandTotalRow,
  manufacturingIncomeProducts,
  manufacturingIncomeSummary,
} from "./cells";
import { CustomInput } from "@/components/ui/customInput";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Save, Loader2 } from "lucide-react";
import { useDataContext } from "@/lib/contexts";
import { SheetNameType } from "@/lib/transformers/dataTransformer";
import { ExcelExportButton } from "@/components/ui/excelExportButton";
import { PDFExportButton } from "@/components/ui/pdfExportButton";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

export default function ManufacturingIncomeSheet() {
  const [showResetModal, setShowResetModal] = useState(false);
  const {
    onSave,
    saving,
    hasChanges,
    loading,
    errorMessage,
    retry,
    clearSheet,
    resetAllData,
    resetting,
  } = useDataContext();

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
        render: (value: string, record: ProductRowDataType, index: number) => {
          return (
            <CustomInput
              type="text"
              sheet={sheetName}
              cell={record.product_name}
              disabled={record.type === 0}
              readOnly={
                record.type === 2 ||
                index === manufacturingIncomeProducts.length - 1
              }
              placeholder={record.type === 1 ? "商品名を入力" : ""}
              className={`border-transparent h-full text-xs text-center ${
                record.type === 2 ||
                index === manufacturingIncomeProducts.length - 1
                  ? "!bg-gray-100"
                  : ""
              }`}
            />
          );
        },
      },
      {
        key: "gross_profit_amount",
        title: "粗利益額",
        width: 100,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: ProductRowDataType) => {
          return (
            <CustomInput
              type={record.type === 2 ? "text" : "number"}
              sheet={sheetName}
              cell={value}
              readOnly
              className={`border-transparent h-full text-xs text-right !bg-gray-100`}
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
        render: (value: string, record: ProductRowDataType, index: number) => {
          return (
            <CustomInput
              type={record.type === 2 ? "text" : "number"}
              sheet={sheetName}
              cell={value}
              disabled={record.type === 0}
              readOnly={
                record.type === 2 ||
                index === manufacturingIncomeProducts.length - 1
              }
              className={`border-transparent h-full text-xs text-right  ${
                record.type === 2 ||
                index === manufacturingIncomeProducts.length - 1
                  ? "!bg-gray-100"
                  : ""
              }`}
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
        render: (value: string, record: ProductRowDataType, index: number) => {
          return (
            <CustomInput
              type={record.type === 2 ? "text" : "number"}
              sheet={sheetName}
              cell={value}
              disabled={record.type === 0}
              readOnly={
                record.type === 2 ||
                index === manufacturingIncomeProducts.length - 1
              }
              className={`border-transparent h-full text-xs text-right  ${
                record.type === 2 ||
                index === manufacturingIncomeProducts.length - 1
                  ? "!bg-gray-100"
                  : ""
              }`}
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
        render: (value: string, record: ProductRowDataType, index: number) => {
          return (
            <CustomInput
              type={record.type === 2 ? "text" : "number"}
              sheet={sheetName}
              cell={value}
              disabled={record.type === 0}
              readOnly={
                record.type === 2 ||
                index === manufacturingIncomeProducts.length - 1
              }
              className={`border-transparent h-full text-xs text-right  ${
                record.type === 2 ||
                index === manufacturingIncomeProducts.length - 1
                  ? "!bg-gray-100"
                  : ""
              }`}
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
              type={record.type === 2 ? "text" : "number"}
              sheet={sheetName}
              cell={value}
              disabled={record.type === 0}
              readOnly
              className={`border-transparent h-full text-xs text-right !bg-gray-100`}
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
        render: (value: string, record: ProductRowDataType, index: number) => {
          return (
            <CustomInput
              type={record.type === 2 ? "text" : "number"}
              sheet={sheetName}
              cell={value}
              disabled={record.type === 0}
              readOnly
              renderValue={(v) => {
                return record.type === 2 ? v : Number(v) * 100;
              }}
              suffix={record.type === 2 ? "" : "%"}
              className={`border-transparent h-full text-xs text-right  ${
                record.type === 2 ||
                index === manufacturingIncomeProducts.length - 1
                  ? "!bg-gray-100"
                  : ""
              }`}
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
        key: "a",
        title: "",
        width: 100,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (
          value: CellType,
          record: SummaryRowDataType,
          index: number
        ) => {
          return (
            <CustomInput
              type={index % 2 === 0 ? "text" : "number"}
              readOnly={index % 2 === 0 || value.type === 2}
              sheet={sheetName}
              cell={value.value}
              className={`border-transparent h-full text-xs text-center ${
                index % 2 === 0 ? "!bg-gray-100" : ""
              }`}
            />
          );
        },
      },
      {
        key: "b",
        title: "",
        width: 100,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (
          value: CellType,
          record: SummaryRowDataType,
          index: number
        ) => {
          return (
            <CustomInput
              type={index % 2 === 0 ? "text" : "number"}
              readOnly={index % 2 === 0 || value.type === 2}
              sheet={sheetName}
              cell={value.value}
              suffix={index === 1 ? "%" : ""}
              renderValue={index === 1 ? (v) => Number(v) * 100 : undefined}
              className={`border-transparent h-full text-xs text-center ${
                index % 2 === 0 ? "!bg-gray-100" : ""
              }`}
            />
          );
        },
      },
      {
        key: "c",
        title: "",
        width: 100,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (
          value: CellType,
          record: SummaryRowDataType,
          index: number
        ) => {
          return (
            <CustomInput
              type={index % 2 === 0 ? "text" : "number"}
              readOnly={index % 2 === 0 || value.type === 2}
              sheet={sheetName}
              cell={value.value}
              className={`border-transparent h-full text-xs text-center ${
                index % 2 === 0 ? "!bg-gray-100" : ""
              }`}
            />
          );
        },
      },
      {
        key: "d",
        title: "",
        width: 100,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (
          value: CellType,
          record: SummaryRowDataType,
          index: number
        ) => {
          return (
            <CustomInput
              type={index % 2 === 0 ? "text" : "number"}
              readOnly={index % 2 === 0 || value.type === 2}
              sheet={sheetName}
              cell={value.value}
              className={`border-transparent h-full text-xs text-center ${
                index % 2 === 0 ? "!bg-gray-100" : ""
              }`}
            />
          );
        },
      },
      {
        key: "e",
        title: "",
        width: 100,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (
          value: CellType,
          record: SummaryRowDataType,
          index: number
        ) => {
          return (
            <CustomInput
              type={index % 2 === 0 ? "text" : "number"}
              readOnly={index % 2 === 0 || value.type === 2}
              sheet={sheetName}
              cell={value.value}
              className={`border-transparent h-full text-xs text-center ${
                index % 2 === 0 ? "!bg-gray-100" : ""
              }`}
            />
          );
        },
      },
      {
        key: "f",
        title: "",
        width: 100,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (
          value: CellType,
          record: SummaryRowDataType,
          index: number
        ) => {
          return (
            <CustomInput
              type={index % 2 === 0 ? "text" : "number"}
              readOnly={index % 2 === 0 || value.type === 2}
              sheet={sheetName}
              cell={value.value}
              className={`border-transparent h-full text-xs text-center ${
                index % 2 === 0 ? "!bg-gray-100" : ""
              }`}
            />
          );
        },
      },
    ],
    [sheetName]
  );

  const grandTotalTableColumns: Column[] = useMemo(
    () => [
      {
        key: "label",
        title: "",
        width: 100,
        align: "center",
        cellClassName: "!p-0 !h-full relative bg-yellow-300 text-lg ",
      },
      {
        key: "value",
        title: "",
        width: 200,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: TotalValueType) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              readOnly
              className={`border-none h-full text-lg text-center`}
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
    <>
      <div className="h-full flex flex-col space-y-4 ">
      <div className="lg:flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">⑦(PQ)原価の詳細</h1>
          <p className="text-gray-600">
            製造業の原価詳細を入力して、製品別の粗利益を分析します。
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
            onClick={() => setShowResetModal(true)}
          >
            全データリセット
          </Button>
          <ExcelExportButton />
          <PDFExportButton />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="bg-yellow-100 p-2 border w-full border-yellow-300 text-sm text-gray-700">
          <span className="font-semibold">
            ここの数字は1円単位で記入する事! 120万円(工事費)の場合1200000と記入
          </span>
        </div>
        <div className="max-w-xs w-full">
          <AdvancedTable
            columns={grandTotalTableColumns}
            data={[grandTotalRow]}
            bordered
            dense
            hideHeader
            className="border-none"
            cellClassName="!p-0"
          />
        </div>
      </div>

      <div className="overflow-auto gap-4 flex-1 min-h-0">
        {/* Row 1 - Main Product Table */}
        <div className="flex flex-col space-y-2">
          <AdvancedTable
            columns={productTableColumns}
            data={manufacturingIncomeProducts}
            bordered
            dense
            stickyHeader
            maxHeight={"400px"}
            cellClassName="!p-0"
          />
        </div>

        {/* Row 2 - Summary Section (実績) */}
        <div>
          <AdvancedTable
            columns={summaryTableColumns}
            data={manufacturingIncomeSummary}
            dense
            hideHeader
            bordered
            // maxHeight={"100px"}
            cellClassName="!p-0"
          />
        </div>
      </div>

      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={async () => {
          await resetAllData();
          setShowResetModal(false);
        }}
        title="全データリセットの確認"
        message="すべてのデータを初期状態にリセットします。よろしいですか？この操作は元に戻せません。"
        confirmText="リセット"
        cancelText="キャンセル"
        confirmVariant="destructive"
        isLoading={resetting}
      />
    </>
  );
}
