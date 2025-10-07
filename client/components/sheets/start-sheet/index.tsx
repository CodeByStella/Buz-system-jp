"use client";

import React, { useState } from "react";
import { AdvancedTable, Column } from "@/components/ui/advanced-table";
import { RowDataType, startSheetRows_main } from "./StartSheetCells";

export default function StartSheet() {
  const [startSheetData_main, setStartSheetData_main] =
    useState(startSheetRows_main);

  //コードNo	勘定科目	損益計算書	製造原価報告書
  const startSheetCols_main: Column[] = [
    {
      key: "no",
      title: "コードNo",
      width: 50,
      align: "center",
    },
    {
      key: "label",
      title: "勘定科目",
      width: 100,
      align: "center",
    },
    {
      key: "incomeStatement",
      title: "損益計算書",
      width: 100,
      align: "center",
      render: (value: number, record: RowDataType, index: number) => {
        return record.incomeStatement.value;
      },
    },
    {
      key: "manufacturingCostReport",
      title: "製造原価報告書",
      width: 100,
      align: "center",
      render: (value: number, record: RowDataType, index: number) => {
        return record.manufacturingCostReport.value;
      },
    },
  ];

  return (
    <div className="h-full flex flex-col space-y-4 overflow-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">スタート</h1>
        <p className="text-gray-600">
          このページで元データを入力します（画像の項目に対応）。
        </p>
      </div>
        <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
          <div className="row-span-2 flex flex-col overflow-hidden">
            <AdvancedTable
              columns={startSheetCols_main as any}
              data={startSheetData_main as any}
              dense
              bordered
              maxHeight={"full"}
              stickyHeader
              scrollable={true}
            />
          </div>

          <div className="border-2 border-red-600 bg-gray-800"></div>

          <div className="border-2 border-red-600 bg-gray-800"></div>
        </div>
    </div>
  );
}
