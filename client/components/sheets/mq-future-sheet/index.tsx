"use client";

import React, { useMemo } from "react";
import { AdvancedTable, Column } from "@/components/ui/advanced-table";
import {
  MQFutureResultCell,
  MQFutureUnitPriceCell,
  mqFutureResults_cells,
  mqFutureUnitPrice_cells,
} from "./cells";
import { CustomInput } from "@/components/ui/customInput";
import { CustomTextarea } from "@/components/ui/customTextarea";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Save, Loader2 } from "lucide-react";
import { useDataContext } from "@/lib/contexts";
import { SheetNameType } from "@/lib/transformers/dataTransformer";

export default function MQFutureSheet() {
  const { onSave, saving, hasChanges, loading, errorMessage, retry } =
    useDataContext();

  const sheetName: SheetNameType = "mq_future";

  const resultTableColumns: Column[] = useMemo(
    () => [
      {
        key: "label",
        title: "",
        width: 100,
        align: "center",
        cellClassName: "h-12 text-lg !p-0 !h-full relative bg-yellow-300",
      },
      {
        key: "amount",
        title: "",
        width: 100,
        align: "center",
        cellClassName: "h-12 relative",
        render: (amount: string, record: MQFutureResultCell) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={amount}
              disabled={record.type === 0}
              readOnly={record.type === 2}
              tip={record.tip}
              tipClassName="text-red-500"
              prefix="¥"
              className={"border-transparent h-full text-lg text-center"}
            />
          );
        },
      },
      {
        key: "percentage",
        title: "",
        width: 50,
        align: "center",
        cellClassName: "h-12 relative",
        render: (percentage: string, record: MQFutureResultCell) => {
          if (percentage === "")
            return <div className="h-full w-full bg-yellow-300" />;
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={percentage}
              disabled={record.type === 0}
              readOnly={record.type === 2}
              tip={record.tip}
              tipClassName="text-red-500"
              suffix="%"
              renderValue={v=>Number(v)*100}
              className={"border-transparent h-full text-lg text-center"}
            />
          );
        },
      },
    ],
    [sheetName]
  );

  const unitPriceTableColumns: Column[] = useMemo(
    () => [
      {
        key: "x",
        title: "",
        width: 100,
        align: "left",
        cellClassName: "h-20 text-lg !p-0 !h-full relative bg-yellow-300",
        render: (value: string, record: MQFutureUnitPriceCell) => {
          return record.editable ? (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              tipClassName="text-red-500"
              readOnly
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
        cellClassName: "h-20 text-lg bg-yellow-300",
      },
      {
        key: "y",
        title: "",
        width: 100,
        align: "left",
        cellClassName: "h-20 text-lg !p-0 !h-full relative bg-yellow-300",
        render: (value: string, record: MQFutureUnitPriceCell) => {
          return record.editable ? (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              readOnly
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
    <div className="h-full flex flex-col space-y-3 sm:space-y-4  p-2 sm:p-4 lg:p-0">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            ② MQ会計(未来)
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            目標値と客単価・数量を設定してMQ会計の未来計画を立てます。
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-2">
          <Button
            variant="success"
            leftIcon={Save}
            loading={saving}
            loadingText="保存中..."
            onClick={onSave}
            disabled={saving || !hasChanges}
            className="flex-1 sm:flex-none text-sm sm:text-base"
          >
            保存
          </Button>
          <Button
            variant="outline"
            leftIcon={FileSpreadsheet}
            className="flex-1 sm:flex-none border-green-500 text-green-700 hover:bg-green-50 text-sm sm:text-base"
            onClick={() => {
              /* TODO: implement export to Excel logic */
            }}
          >
            <span className="hidden sm:inline">Excel出力</span>
            <span className="sm:hidden">Excel</span>
          </Button>
          <Button
            variant="outline"
            leftIcon={FileText}
            className="flex-1 sm:flex-none border-red-500 text-red-700 hover:bg-red-50 text-sm sm:text-base"
            onClick={() => {
              /* TODO: implement export to PDF logic */
            }}
          >
            <span className="hidden sm:inline">PDF出力</span>
            <span className="sm:hidden">PDF</span>
          </Button>
        </div>
      </div>

      {/* Unit Note */}
      <div className="bg-yellow-100 p-2 sm:p-3 rounded-lg border border-yellow-300">
        <p className="text-xs sm:text-sm text-gray-700">
          <span className="font-semibold">(百万円)</span>
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 flex-1 min-h-0 overflow-auto lg:">
        {/* Left side - MQ Results */}
        <div className="flex flex-col space-y-3 sm:space-y-4 min-h-[400px] lg:min-h-0">
          <AdvancedTable
            columns={resultTableColumns}
            data={mqFutureResults_cells}
            bordered
            dense
            hideHeader
            cellClassName="!p-0"
            // className="!h-full"
            footerContent={
              <div className="text-xs sm:text-sm bg-yellow-300 p-3 sm:p-4 space-y-2">
                <p className="leading-relaxed">
                  ①まず初めにGの目標値を決めましょう。これは社長自身がいくらの利益を残したいのかを決定させる重要な課題です。
                </p>
                <p className="leading-relaxed">
                  すべての決断は社長自身にあります。思い切った利益を追求しましょう！
                </p>
                <p className="leading-relaxed">
                  ②～⑤まで順番に現状から推移して115％～200％UPまで好きな数字を目標値に入れてください。
                </p>
                <p className="leading-relaxed">数字が合うように計算しましょう</p>
                <div className="space-y-1 mt-2">
                  <p>１，GはM-Fです。</p>
                  <p>２，FはM-Gです。</p>
                  <p>３．MはP-Vです。</p>
                  <p>４．VはP-Mです。</p>
                  <p>５．PはM＋Vです。</p>
                </div>
              </div>
            }
          />
        </div>

        {/* Right side - Unit Price per Customer */}
        <div className="flex flex-col space-y-3 sm:space-y-4 min-h-[400px] lg:min-h-0">
          <AdvancedTable
            columns={unitPriceTableColumns}
            data={mqFutureUnitPrice_cells}
            bordered
            dense
            hideHeader
            className="flex flex-col"
            // maxHeight={"400px"}
            footerContent={
              <div className="h-[200px] sm:h-[250px] lg:h-full  border border-gray-300 rounded-lg shadow-sm flex flex-col bg-white">
                <div className="flex-shrink-0 p-2 sm:p-3 border-b border-gray-200">
                  <label className="font-semibold text-sm sm:text-base text-gray-900">
                    メモ:
                  </label>
                </div>
                <div className="flex-1 p-2 sm:p-3 min-h-0 overflow-auto">
                  <CustomTextarea
                    sheet={sheetName}
                    cell="L25"
                    placeholder="メモを入力してください..."
                    className="w-full h-full min-h-[120px] border-0 resize-none focus:ring-0 focus:outline-none text-sm sm:text-base text-gray-700"
                    rows={6}
                  />
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
