"use client";

import React, { useState, useMemo, useCallback } from "react";
import { AdvancedTable, Column } from "@/components/ui/advanced-table";
import {
  MainRowDataType,
  OthersRowDataType,
  SummaryRowDataType,
  initialStartSheet_main,
  initialStartSheet_others,
  initialStartSheet_summary,
} from "./StartSheetCells";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { applyFormulas } from "./formulas";

export default function StartSheet() {
  const [startSheetData_main, setStartSheetData_main] = useState(
    initialStartSheet_main
  );
  const [startSheetData_others, setStartSheetData_others] = useState(
    initialStartSheet_others
  );
  const [startSheetData_summary, setStartSheetData_summary] = useState(
    initialStartSheet_summary
  );

  // Apply formulas to readonly fields automatically
  // Formulas can reference data from all sources (main, others, summary)
  const calculatedData = useMemo(() => {
    return applyFormulas({
      main: startSheetData_main,
      others: startSheetData_others,
      summary: startSheetData_summary,
    });
  }, [startSheetData_main, startSheetData_others, startSheetData_summary]);

  // Handler for updating main table data
  const handleMainDataChange = useCallback(
    (
      rowKey: string,
      field: "incomeStatement" | "manufacturingCostReport",
      newValue: number
    ) => {
      setStartSheetData_main((prevData) =>
        prevData.map((row) =>
          row.key === rowKey
            ? {
                ...row,
                [field]: {
                  ...row[field],
                  value: Number(newValue),
                },
              }
            : row
        )
      );
    },
    []
  );

  // Handler for updating others table data
  const handleOthersDataChange = useCallback(
    (rowKey: string, newValue: number) => {
      setStartSheetData_others((prevData) =>
        prevData.map((row) =>
          row.key === rowKey
            ? {
                ...row,
                value: Number(newValue),
              }
            : row
        )
      );
    },
    []
  );

  //コードNo	勘定科目	損益計算書	製造原価報告書
  const startSheetCols_main: Column[] = useMemo(() => [
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
        value: { value: number; type: 0 | 1 | 2 },
        record: MainRowDataType,
        index: number
      ) => {
        return (
          <Input
            type="number"
            value={value.value||""}
            disabled={value.type === 0}
            readOnly={value.type === 2}
            suffix={record.key==="profitMargin"?"%":undefined}
            onChange={(e) => {
              const inputValue = e.target.value;
              const newValue = inputValue === "" ? 0 : Number(inputValue);
              handleMainDataChange(record.key, "incomeStatement", newValue);
            }}
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
        value: { value: number; type: 0 | 1 | 2 },
        record: MainRowDataType,
        index: number
      ) => {
        return (
          <Input
            type="number"
            value={value.value||""}
            disabled={value.type === 0}
            readOnly={value.type === 2}
            onChange={(e) => {
              const inputValue = e.target.value;
              const newValue = inputValue === "" ? 0 : Number(inputValue);
              handleMainDataChange(record.key, "manufacturingCostReport", newValue);
            }}
            className={`border-transparent h-full`}
          />
        );
      },
    },
  ], [handleMainDataChange]);

  const startSheetCols_others: Column[] = useMemo(() => [
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
        return record.editable ? (
          <div>{value}</div>
        ) : (
          <div className="bg-violet-500 flex items-center justify-center h-full w-full absolute top-0 left-0">
            {value}
          </div>
        );
      },
    },
    {
      key: "value",
      title: "",
      width: 70,
      align: "center",
      cellClassName: "!p-0 !h-full relative",
      render: (value: string | number, record: OthersRowDataType, index: number) => {
        return record.editable ? (
          <Input
            type="number"
            value={value || ""}
            onChange={(e) => {
              const inputValue = e.target.value;
              const newValue = inputValue === "" ? 0 : Number(inputValue);
              handleOthersDataChange(record.key, newValue);
            }}
            className={`border-transparent h-full`}
          />
        ) : (
          <div className="bg-violet-500 flex items-center justify-center h-full w-full absolute top-0 left-0">
            {value}
          </div>
        );
      },
    },
  ], [handleOthersDataChange]);

  const startSheetCols_summary: Column[] = useMemo(() => [
    {
      key: "label",
      title: "",
      width: 100,
      align: "center",
    },
    {
      key: "value",
      title: "",
      width: 100,
      align: "right",
    },
  ], []);

  return (
    <div className="h-full flex flex-col space-y-4 overflow-hidden ">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">スタート</h1>
        <p className="text-gray-600">
          このページで元データを入力します（画像の項目に対応）。
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2 flex-1 min-h-0">
        <div className="col-span-2 flex flex-col overflow-hidden">
          <AdvancedTable
            columns={startSheetCols_main as any}
            data={calculatedData.main as any}
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
              data={startSheetData_others as any}
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
                data={calculatedData.summary as any}
                dense
                bordered
                maxHeight={"full"}
                hideHeader
                stickyHeader
                cellClassName="!bg-yellow-200"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
