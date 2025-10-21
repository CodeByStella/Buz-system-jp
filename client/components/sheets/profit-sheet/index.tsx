"use client";

import React, { useMemo, useState } from "react";
import { AdvancedTable, Column } from "@/components/ui/advanced-table";
import {
  ProfitRowDataType,
  ComparisonRowDataType,
  ordinaryProfit_cells,
  profitBeforeTax_cells,
  comparison_cells,
} from "./cells";
import { CustomInput } from "@/components/ui/customInput";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Save, Loader2 } from "lucide-react";
import { useDataContext } from "@/lib/contexts";
import { SheetNameType } from "@/lib/transformers/dataTransformer";
import { ExcelExportButton } from "@/components/ui/excelExportButton";
import { PDFExportButton } from "@/components/ui/pdfExportButton";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

export default function ProfitSheet() {
  const [showResetModal, setShowResetModal] = useState(false);
  const {
    onSave,
    saving,
    hasChanges,
    loading,
    errorMessage,
    retry,
    clearSheet,
  } = useDataContext();

  const sheetName: SheetNameType = "profit";

  const profitTableColumns: Column[] = useMemo(
    () => [
      {
        key: "label",
        title: "",
        width: 120,
        align: "center",
        cellClassName: "h-16 text-lg !p-0 !h-full relative",
        render: (value: string, record: ProfitRowDataType) => {
          return (
            <div
              className={cn(
                record.bgcolor,
                "flex items-center justify-center h-full w-full absolute top-0 left-0 text-lg font-semibold"
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
        cellClassName: "h-16 text-lg relative",
        render: (value: string, record: ProfitRowDataType) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              disabled={record.type === 0}
              readOnly={record.type === 2}
              tip={record.tip}
              tipClassName="text-red-500"
              prefix="¥"
              suffix={record.suffix}
              className={`border-transparent h-full text-lg text-right`}
            />
          );
        },
      },
    ],
    [sheetName]
  );

  const comparisonTableColumns: Column[] = useMemo(
    () => [
      {
        key: "label",
        title: "",
        width: 100,
        align: "center",
        cellClassName: "h-16 text-lg !p-0 !h-full relative",
        render: (value: string, record: ComparisonRowDataType) => {
          return (
            <div
              className={cn(
                record.bgcolor,
                "flex items-center justify-center h-full w-full absolute top-0 left-0 text-lg font-semibold"
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
        width: 80,
        align: "center",
        cellClassName: "h-16 text-lg relative",
        render: (value: string, record: ComparisonRowDataType) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              disabled={record.type === 0}
              readOnly={record.type === 2}
              suffix="%"
              inverseRenderValue={(v) => v / 100}
              renderValue={(v) => Number(v) * 100}
              tipClassName="text-blue-500"
              className={`border-transparent h-full text-lg text-center border border-green-500`}
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
            <h1 className="text-2xl font-bold text-gray-900">① 利益を決めよう</h1>
            <p className="text-gray-600">
              営業利益、営業外収益・費用、特別利益・損失を入力して利益を計算します。
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
              全入力クリア
            </Button>
            <ExcelExportButton />
            <PDFExportButton />
          </div>
        </div>

        {/* Header with example note */}
        <div className="bg-yellow-100 p-2 border w-full border-yellow-300 text-sm text-gray-700">
          <span className="font-semibold">(百万円) 例: 2000万円→20.0</span>
        </div>

        <div className="lg:grid lg:grid-cols-2 gap-4 flex-1 min-h-0">
          {/* Left side - Ordinary Profit Calculation */}
          <div className="flex flex-col space-y-4">
            {/* <div className="bg-white border border-gray-300 rounded-lg shadow-sm "> */}
            <AdvancedTable
              columns={profitTableColumns}
              data={ordinaryProfit_cells}
              bordered
              dense
              hideHeader
              maxHeight={"300px"}
              cellClassName="!p-0"
            />
            {/* </div> */}
          </div>

          {/* Right side - Profit Before Tax Calculation */}
          <div className="flex flex-col space-y-4 lg:m-0 mt-8">
            <AdvancedTable
              columns={profitTableColumns}
              data={profitBeforeTax_cells}
              bordered
              dense
              hideHeader
              maxHeight={"300px"}
              cellClassName="!p-0"
            />

            {/* Year-on-year comparison */}
            <AdvancedTable
              columns={comparisonTableColumns}
              data={comparison_cells}
              bordered
              dense
              hideHeader
              maxHeight={"100px"}
              cellClassName="!p-0"
            />
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={() => {
          clearSheet(sheetName);
          setShowResetModal(false);
        }}
        title="全入力クリアの確認"
        message="このシートの全入力をクリアします。よろしいですか？この操作は元に戻せません。"
        confirmText="クリア"
        cancelText="キャンセル"
        confirmVariant="destructive"
      />
    </>
  );
}
