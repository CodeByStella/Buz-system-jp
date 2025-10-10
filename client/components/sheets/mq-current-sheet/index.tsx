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
import { useDataContext } from "@/lib/contexts";
import { SheetNameType } from "@/lib/transformers/dataTransformer";

export default function MQCurrentSheet() {
  const { onSave, saving, hasChanges, loading } = useDataContext();

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

  return (
    <div className="h-full flex flex-col space-y-4 overflow-hidden ">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">MQ会計(現状)</h1>
          <p className="text-gray-600">このページで元データを入力します。</p>
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
      <div className="grid grid-rows-4 gap-2 flex-1 min-h-0">
        {/* Row 1 - Horizontal Grid */}
        <div className="grid grid-cols-2 gap-2 row-span-3 h-full overflow-hidden">
          <AdvancedTable
            columns={resultTableColumns}
            data={resultTable_cells}
            bordered
            dense
            hideHeader
            maxHeight={"460px"}
            cellClassName="!bg-yellow-300"
            footerContent={
              <div className="text-xs text-red-500">
                <p>P×Qを入れるとここに売り上げが反映。</p>
                <p>上と同じ数字になるように①と②で調整しましょう。</p>
              </div>
            }
          />
          <AdvancedTable
            columns={inputTableColumns}
            data={inputTable_cells}
            bordered
            dense
            hideHeader
            maxHeight={"full"}
          />
        </div>

        {/* Row 2 - Horizontal Grid */}
        <div className="h-full overflow-hidden">
          
        </div>
      </div>
    </div>
  );
}
