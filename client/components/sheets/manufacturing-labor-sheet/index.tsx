"use client";

import React, { useMemo } from "react";
import { AdvancedTable, Column } from "@/components/ui/advanced-table";
import {
  ManufacturingLaborRowDataType,
  ManufacturingLaborSummaryRowDataType,
  AverageIncomeRowDataType,
  manufacturingLaborEmployeeRows,
  manufacturingLaborEmployeeSummary,
  manufacturingLaborMiscRows,
  manufacturingLaborMiscSummary,
  manufacturingLaborDispatchedRows,
  manufacturingLaborDispatchedSummary,
  manufacturingLaborAverageIncomeRows,
} from "./cells";
import { CustomInput } from "@/components/ui/customInput";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Save, Loader2 } from "lucide-react";
import { useDataContext } from "@/lib/contexts";
import { SheetNameType } from "@/lib/transformers/dataTransformer";

export default function ManufacturingLaborSheet() {
  const {
    onSave,
    saving,
    hasChanges,
    loading,
    errorMessage,
    retry,
    clearSheet,
  } = useDataContext();

  const sheetName: SheetNameType = "manufacturing_labor";

  // Define column configurations for each table
  const dataTableColumns: Column[] = useMemo(
    () => [
      {
        key: "label",
        title: "区分・テーブル",
        width: 120,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: ManufacturingLaborRowDataType) => {
          return (
            <CustomInput
              type="text"
              sheet={sheetName}
              cell={value}
              className={`border-transparent h-full text-xs text-center`}
            />
          );
        },
      },
      {
        key: "unitPrice",
        title: "単価",
        width: 60,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: ManufacturingLaborRowDataType) => {
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
      {
        key: "count",
        title: "人数",
        width: 60,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: ManufacturingLaborRowDataType) => {
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
      {
        key: "total",
        title: "合計",
        width: 60,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: ManufacturingLaborRowDataType) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              readOnly
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
        width: 170,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (
          value: string,
          record: ManufacturingLaborSummaryRowDataType
        ) => {
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
        key: "count",
        title: "",
        width: 60,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (
          value: string,
          record: ManufacturingLaborSummaryRowDataType,
          id: number
        ) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              readOnly={!id}
              tip={id ? "現状の内部社員数を入力する役員は含まない。" : ""}
              className={`border-transparent h-full text-xs text-center`}
            />
          );
        },
      },
      {
        key: "total",
        title: "",
        width: 60,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (
          value: string,
          record: ManufacturingLaborSummaryRowDataType
        ) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              readOnly
              className={`border-transparent h-full text-xs text-center`}
            />
          );
        },
      },
    ],
    [sheetName]
  );

  const averageIncomeColumns: Column[] = useMemo(
    () => [
      {
        key: "label",
        title: "平均年収",
        width: 100,
        align: "center",
        cellClassName: "!p-0 !h-full relative bg-yellow-300",
      },
      {
        key: "value",
        title: "",
        width: 100,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: AverageIncomeRowDataType) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              suffix="百万円"
              readOnly
              className={`border-transparent h-full text-xs text-center`}
            />
          );
        },
      },
      {
        key: "percentage",
        title: "上昇率",
        width: 100,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: AverageIncomeRowDataType) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              renderValue={(v) => Number(v) * 100}
              suffix="%"
              readOnly
              className={`border-transparent h-full text-xs text-center`}
            />
          );
        },
      },
    ],
    [sheetName]
  );

  const totalTableColumns: Column[] = useMemo(
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
        render: (value: string, record: { label: string; value: string }) => {
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
    <div className="h-full flex flex-col space-y-4 ">
      <div className="lg:flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            ⑤ (V) 人件費を入力する (工事職人)
          </h1>
          <p className="text-gray-600">
            工事職人の人件費詳細を入力して、給与体系を計画します。
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
                clearSheet(sheetName);
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

      {/* Important notice */}
      <div className="flex items-center justify-between gap-2">
        <div className="bg-yellow-100 p-1 h-full px-3 border w-full border-yellow-300 text-sm text-gray-700">
          <span className="font-semibold">
            ここの数字は百万円単位で記入する事！ 530万円(年収)の場合5.3と記入
          </span>
        </div>
        <div className="max-w-xs w-full">
          <AdvancedTable
            columns={totalTableColumns}
            data={[
              {
                label: "合計",
                value: "O1",
              },
            ]}
            bordered
            dense
            hideHeader
            className="border-none"
            cellClassName="!p-0"
          />
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="grid lg:grid-cols-3 gap-4 flex-1 min-h-0">
          {/* Employee Salary Details Table */}
          <div className="flex flex-col space-y-2">
            <div className="flex-1">
              <AdvancedTable
                columns={dataTableColumns}
                data={manufacturingLaborEmployeeRows}
                bordered
                dense
                title={
                  <h3 className="text-lg font-semibold text-center w-full p-1">
                    人件費明細
                  </h3>
                }
                maxHeight={"300px"}
                cellClassName="!p-0"
                footerContent={
                  <AdvancedTable
                    columns={summaryTableColumns}
                    data={manufacturingLaborEmployeeSummary}
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

          {/* Miscellaneous Salary Table */}
          <div className="flex flex-col space-y-2">
            <div className="flex-1">
              <AdvancedTable
                columns={dataTableColumns}
                data={manufacturingLaborMiscRows}
                bordered
                dense
                title={
                  <h3 className="text-lg font-semibold text-center w-full p-1">
                    雑給料
                  </h3>
                }
                maxHeight={"300px"}
                cellClassName="!p-0"
                footerContent={
                  <AdvancedTable
                    columns={summaryTableColumns}
                    data={manufacturingLaborMiscSummary}
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

          {/* Dispatched Employees Table */}
          <div className="flex flex-col space-y-2">
            <div className="flex-1">
              <AdvancedTable
                columns={dataTableColumns}
                data={manufacturingLaborDispatchedRows}
                bordered
                dense
                title={
                  <h3 className="text-lg font-semibold text-center w-full p-1">
                    派遣社員
                  </h3>
                }
                maxHeight={"300px"}
                cellClassName="!p-0"
                footerContent={
                  <AdvancedTable
                    columns={summaryTableColumns}
                    data={manufacturingLaborDispatchedSummary}
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
        </div>

        {/* Instructions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AdvancedTable
            columns={averageIncomeColumns}
            data={manufacturingLaborAverageIncomeRows}
            bordered
            dense
            maxHeight={"150px"}
            cellClassName="!p-0"
          />
          <div className="bg-yellow-50 border border-yellow-200 p-2">
            <p className="text-xs text-yellow-800">
              前期よりも2%~10%以上の昇給、増員の計画を入れる事。アバウトでも良い。この社長の採用と昇給の意思決定が有無で会社の未来は大きく変わります!上昇率が100%以上になる事が望ましい。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
