"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Save, Loader2 } from "lucide-react";
import { AdvancedTable, Column } from "@/components/ui/advanced-table";
import {
  inputTable_cells,
  InputTableCell,
  resultTable_cells,
  ResultTableCell,
} from "./cells";
import { CustomInput } from "@/components/ui/customInput";
import { CustomTextarea } from "@/components/ui/customTextarea";
import { useDataContext } from "@/lib/contexts";
import { SheetNameType } from "@/lib/transformers/dataTransformer";

export default function MQCurrentSheet() {
  const { onSave, saving, hasChanges, loading, errorMessage, retry } =
    useDataContext();

  const sheetName: SheetNameType = "mq_current_status";

  const resultTableColumns: Column[] = [
    {
      key: "label",
      title: "",
      width: 100,
      align: "left",
      cellClassName: "h-20 text-lg",
    },
    {
      key: "value",
      title: "",
      width: 100,
      align: "right",
      cellClassName: "h-20 text-lg relative",
      render: (value: string, record: ResultTableCell) => {
        return (
          <CustomInput
            type="number"
            sheet={sheetName}
            cell={value}
            readOnly
            tip={record.tip}
            tipClassName="text-red-500"
            prefix="¥"
            className={`border-transparent h-full text-lg`}
          />
        );
      },
    },
  ];

  const inputTableColumns: Column[] = [
    {
      key: "x",
      title: "",
      width: 100,
      align: "left",
      cellClassName: "h-20 text-lg !p-0 !h-full relative",
      render: (value: string, record: InputTableCell) => {
        return record.editable ? (
          <CustomInput
            type="number"
            sheet={sheetName}
            cell={value}
            tipClassName="text-red-500"
            className={`border-transparent h-full text-lg`}
          />
        ) : (
          <div className="p-4">
            <p className="text-xl font-semibold">{value}</p>
            <p className="text-xs">{record.xDesc}</p>
          </div>
        );
      },
    },
    {
      key: "op",
      title: "",
      width: 20,
      align: "center",
      cellClassName: "h-20 text-lg bg-yellow-200",
    },
    {
      key: "y",
      title: "",
      width: 100,
      align: "left",
      cellClassName: "h-20 text-lg !p-0 !h-full relative",
      render: (value: string, record: InputTableCell) => {
        return record.editable ? (
          <CustomInput
            type="number"
            sheet={sheetName}
            cell={value}
            tipClassName="text-red-500"
            className={`border-transparent h-full text-lg`}
          />
        ) : (
          <div className="p-4">
            <p className="text-xl font-semibold">{value}</p>
            <p className="text-xs">{record.yDesc}</p>
          </div>
        );
      },
    },
  ];

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
    <div className="h-full flex flex-col space-y-4  ">
      <div className="lg:flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">MQ会計(現状)</h1>
          <p className="text-gray-600">このページで元データを入力します。</p>
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
      <div className="grid grid-rows-4 gap-2 flex-1 min-h-0">
        {/* Row 1 - Horizontal Grid */}
        <div className="grid lg:grid-cols-2 gap-2 row-span-3 h-full ">
          <AdvancedTable
            columns={resultTableColumns}
            data={resultTable_cells}
            bordered
            dense
            hideHeader
            cellClassName="!bg-yellow-300"
          />
          <AdvancedTable
            columns={inputTableColumns}
            data={inputTable_cells}
            bordered
            dense
            hideHeader
          />
        </div>

        {/* Row 2 - Memo Section */}
        <div className="h-full   border border-gray-300rounded-lg shadow-sm flex flex-c2l bg-white">
          <div className="flex-shrink-0 p-3 border-b border-gray-200">
            <label className="font-semibold text-gray-900">メモ:</label>
          </div>
          <div className="flex-1 p-3 min-h-0">
            <CustomTextarea
              sheet={sheetName}
              cell="C24"
              placeholder="メモを入力してください..."
              className="w-full h-full border-0 resize-none focus:ring-0 focus:outline-none text-gray-700"
              rows={6}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
