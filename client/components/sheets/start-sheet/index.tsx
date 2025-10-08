"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { AdvancedTable, Column } from "@/components/ui/advanced-table";
import {
  MainRowDataType,
  OthersRowDataType,
  SummaryRowDataType,
  initialStartSheet_main,
  initialStartSheet_others,
  initialStartSheet_summary,
} from "./StartSheetCells";
import { Input } from "@/components/ui/customInput";
import { cn } from "@/lib/utils";
import { applyFormulas } from "./formulas";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Save, Loader2 } from "lucide-react";
import { startSheetService } from "@/lib/services";
import {
  transformBackendToFrontend,
  transformFrontendToBackend,
} from "@/lib/transformers/startSheetTransformer";

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

  // Loading and saving states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Utility function to ensure blank rows exist at the end of each group
  const ensureBlankRows = useCallback((data: OthersRowDataType[]) => {
    const result = [...data];
    const parentKeys = [
      "non_operating_income_name",
      "non_operating_expenses_name",
      "extraordinary_gain_name",
      "extraordinary_loss_name",
    ];

    parentKeys.forEach((parentKey) => {
      // Find all rows for this parent with their indices
      const groupRowIndices: number[] = [];
      result.forEach((row, index) => {
        if (row.parent_key === parentKey) {
          groupRowIndices.push(index);
        }
      });
      
      // Find all blank rows in this group
      const blankRowIndices = groupRowIndices.filter((index) => {
        const row = result[index];
        return row.editable && (!row.label || row.label.trim() === "") && (!row.value || row.value === 0 || row.value === "0");
      });

      // If there are multiple blank rows, remove the extras (keep only the last one)
      if (blankRowIndices.length > 1) {
        // Sort in descending order to remove from the end first (to avoid index issues)
        const indicesToRemove = blankRowIndices.slice(0, -1).sort((a, b) => b - a);
        indicesToRemove.forEach((index) => {
          result.splice(index, 1);
        });
      }
      // If there are no blank rows, add one
      else if (blankRowIndices.length === 0) {
        // Recalculate group rows after potential deletions
        const currentGroupRows = result.filter((row) => row.parent_key === parentKey);
        
        // Find the position to insert (after the last row of this group)
        const headerIndex = result.findIndex((row) => row.key === parentKey);
        const lastGroupRowIndex = result.reduce((lastIndex, row, index) => {
          if (row.parent_key === parentKey) return index;
          return lastIndex;
        }, headerIndex);

        // Calculate the next number for the "no" field
        const groupCount = currentGroupRows.length;
        const nextNo = `営${(groupCount + 1).toString().padStart(2, "0")}`;

        // Create a blank row
        const blankRow: OthersRowDataType = {
          key: `${parentKey}_blank_${Date.now()}`,
          no: nextNo,
          parent_key: parentKey,
          label: "",
          value: 0,
          editable: true,
        };

        // Insert the blank row after the last group row
        result.splice(lastGroupRowIndex + 1, 0, blankRow);
      }
    });

    return result;
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await startSheetService.getStartSheet();

        if (response) {
          const transformed = transformBackendToFrontend(
            response,
            initialStartSheet_main,
            initialStartSheet_others
          );

          setStartSheetData_main(transformed.main);
          // Ensure blank rows exist when loading data
          setStartSheetData_others(ensureBlankRows(transformed.others));
        }
      } catch (err: any) {
        console.error("Error fetching start sheet data:", err);
        setError(err.message || "データの読み込みに失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ensureBlankRows]);

  // Save handler
  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      const backendData = transformFrontendToBackend(
        startSheetData_main,
        startSheetData_others
      );

      const response = await startSheetService.saveStartSheet(backendData);

      setSuccessMessage(response.message || "データを保存しました");

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      console.error("Error saving start sheet:", err);
      setError(err.message || "データの保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  }, [startSheetData_main, startSheetData_others]);

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
    (rowKey: string, field: "label" | "value", newValue: string | number) => {
      setStartSheetData_others((prevData) => {
        const updatedData = prevData.map((row) =>
          row.key === rowKey
            ? {
                ...row,
                [field]: field === "value" ? Number(newValue) : newValue,
              }
            : row
        );

        // Ensure blank rows exist after update
        return ensureBlankRows(updatedData);
      });
    },
    [ensureBlankRows]
  );

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
          value: { value: number; type: 0 | 1 | 2 },
          record: MainRowDataType,
          index: number
        ) => {
          return (
            <Input
              type="number"
              value={value.value || ""}
              disabled={value.type === 0}
              readOnly={value.type === 2}
              suffix={record.key === "profitMargin" ? "%" : undefined}
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
              value={value.value || ""}
              disabled={value.type === 0}
              readOnly={value.type === 2}
              tip={record.manufacturingCostReport.tip}
              tipClassName="text-red-500"
              onChange={(e) => {
                const inputValue = e.target.value;
                const newValue = inputValue === "" ? 0 : Number(inputValue);
                handleMainDataChange(
                  record.key,
                  "manufacturingCostReport",
                  newValue
                );
              }}
              className={`border-transparent h-full`}
            />
          );
        },
      },
    ],
    [handleMainDataChange]
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
          return record.editable ? (
            <Input
              type="text"
              value={value || ""}
              onChange={(e) => {
                handleOthersDataChange(record.key, "label", e.target.value);
              }}
              className={`border-transparent h-full`}
              placeholder="項目名を入力"
            />
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
        render: (
          value: string | number,
          record: OthersRowDataType,
          index: number
        ) => {
          return record.editable ? (
            <Input
              type="number"
              value={value || ""}
              onChange={(e) => {
                const inputValue = e.target.value;
                const newValue = inputValue === "" ? 0 : Number(inputValue);
                handleOthersDataChange(record.key, "value", newValue);
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
    ],
    [handleOthersDataChange]
  );

  const startSheetCols_summary: Column[] = useMemo(
    () => [
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
        render: (value: string, record: SummaryRowDataType, index: number) => {
          return parseFloat(value).toFixed(3);
        },
      },
    ],
    []
  );

  // Show loading spinner while fetching data
  if (isLoading) {
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
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
          <p className="font-medium">エラー</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
          <p className="text-sm">{successMessage}</p>
        </div>
      )}

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
            loading={isSaving}
            loadingText="保存中..."
            onClick={handleSave}
            disabled={isSaving}
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
