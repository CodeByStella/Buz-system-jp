"use client";

import React, { useMemo } from "react";
import { AdvancedTable, Column } from "@/components/ui/advanced-table";
import {
  MainRowDataType,
  OthersRowDataType,
  SummaryRowDataType,
  startSheet_main,
  startSheet_others,
  startSheet_summary,
} from "./cells";
import { CustomInput } from "@/components/ui/customInput";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Save, Loader2 } from "lucide-react";
import { useDataContext } from "@/lib/contexts";

export default function StartSheet() {
  const { onSave, saving, hasChanges, loading } =
    useDataContext();

  const sheetName = "start";

  //コードNo	勘定科目	損益計算書	製造原価報告書
  const startSheetCols_main: Column[] = useMemo(
    () => [
      {
        key: "no",
        title: "コードNo",
        width: 50,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: MainRowDataType, index: number) => {
          return (
            <div
              className={cn(
                record.bgcolor1,
                `flex items-center justify-center h-full w-full absolute top-0 left-0`
              )}
            >
              {value}
            </div>
          );
        },
      },
      {
        key: "label",
        title: "勘定科目",
        width: 100,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: MainRowDataType, index: number) => {
          return (
            <div
              className={cn(
                record.bgcolor2,
                `flex items-center justify-center h-full w-full absolute top-0 left-0`
              )}
            >
              {value}
            </div>
          );
        },
      },
      {
        key: "incomeStatement",
        title: "損益計算書",
        width: 50,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (
          value: { value: string; type: 0 | 1 | 2 },
          record: MainRowDataType,
          index: number
        ) => {
          // For percentage fields, multiply by 100 for display
          const isPercentage = record.incomeStatement.suffix === "%";
          
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value.value}
              disabled={value.type === 0}
              readOnly={value.type === 2}
              suffix={record.incomeStatement.suffix || ""}
              renderValue={isPercentage ? (v) => (Number(v) * 100) : undefined}
              inverseRenderValue={isPercentage ? (v) => v / 100 : undefined}
              className={`border-transparent h-full`}
            />
          );
        },
      },
      {
        key: "manufacturingCostReport",
        title: "製造原価報告書",
        width: 50,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (
          value: { value: string; type: 0 | 1 | 2; tip?: string },
          record: MainRowDataType,
          index: number
        ) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value.value}
              disabled={value.type === 0}
              readOnly={value.type === 2}
              tip={value.tip}
              tipClassName="text-red-500"
              className={`border-transparent h-full`}
            />
          );
        },
      },
    ],
    [sheetName]
  );

  const startSheetCols_others: Column[] = useMemo(
    () => [
      {
        key: "no",
        title: "",
        width: 50,
        align: "center",
        cellClassName: "!bg-violet-500",
      },
      {
        key: "label",
        title: "",
        width: 200,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: OthersRowDataType, index: number) => {
          // For label, value is just a text string, not a cell reference
          // Could be enhanced later to support cell references if needed
          const baseClass =
            "flex items-center justify-center h-full w-full absolute top-0 left-0";
          const labelClass = record.editable
            ? baseClass
            : `bg-violet-500 ${baseClass}`;
          return <div className={labelClass}>{value}</div>;
        },
      },
      {
        key: "value",
        title: "",
        width: 70,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: OthersRowDataType, index: number) => {
          return record.editable ? (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              disabled={!record.editable}
              className={`border-transparent h-full text-right`}
            />
          ) : (
            <div className="bg-violet-500 flex items-center justify-center h-full w-full absolute top-0 left-0">
              {value}
            </div>
          );
        },
      },
    ],
    [sheetName]
  );

  const startSheetCols_summary: Column[] = useMemo(
    () => [
      {
        key: "label",
        title: "",
        width: 100,
        align: "center",
        cellClassName: "!bg-yellow-300",
      },
      {
        key: "value",
        title: "",
        width: 100,
        align: "right",
        cellClassName: "relative",
        render: (value: string, record: SummaryRowDataType, index: number) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              readOnly
              className={`border-transparent text-right`}
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

  return (
    <div className="h-full flex flex-col space-y-4 overflow-hidden ">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">スタート</h1>
          <p className="text-gray-600">
            このページで元データを入力します（画像の項目に対応）。
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
      <div className="grid grid-cols-3 gap-2 flex-1 min-h-0">
        <div className="col-span-2 flex flex-col overflow-hidden">
          <AdvancedTable
            columns={startSheetCols_main as any}
            data={startSheet_main as any}
            dense
            bordered
            maxHeight={"full"}
            stickyHeader
          />
        </div>

        <div className=" grid col-span-1 h-full overflow-hidden grid-rows-6 gap-2">
          <div className="row-span-1 border border-black bg-yellow-200 p-1 h-full">
            <p className="text-xs text-gray-600">
              決算書を見ながら一つ一つ直近の数字を入力していく。
            </p>
            <p className="text-xs text-gray-600">
              製造原価を別に計上していない決算書であれば製造原価には記入しない事。
              ただし今後税理士と打ち合わせを行い、
              製造原価を作っていく事を推奨します。
              自社工事部などいない場合でも、材料を支給して発注している会社も製造原価を別に作るべき。
            </p>
          </div>

          <div className="row-span-3  h-full">
            <AdvancedTable
              columns={startSheetCols_others as any}
              data={startSheet_others as any}
              dense
              bordered
              maxHeight={"full"}
              hideHeader
              stickyHeader
              cellClassName="!p-0"
            />
          </div>

          <div className="row-span-2 flex flex-col h-full">
            <div className="mt-auto">
              <AdvancedTable
                columns={startSheetCols_summary as any}
                data={startSheet_summary as any}
                dense
                bordered
                maxHeight={"full"}
                hideHeader
                stickyHeader
                cellClassName="!p-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
