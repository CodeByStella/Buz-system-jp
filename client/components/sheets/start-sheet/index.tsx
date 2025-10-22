"use client";

import React, { useMemo, useState } from "react";
import { AdvancedTable, Column } from "@/components/ui/advanced-table";
import {
  InfoRowDataType,
  MainRowDataType,
  OthersRowDataType,
  SummaryRowDataType,
  startSheet_info,
  startSheet_main,
  startSheet_others,
  startSheet_summary,
} from "./cells";
import { CustomInput } from "@/components/ui/customInput";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileText, Save, Loader2 } from "lucide-react";
import { useDataContext } from "@/lib/contexts";
import { ExcelExportButton } from "@/components/ui/excelExportButton";
import { PDFExportButton } from "@/components/ui/pdfExportButton";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

export default function StartSheet() {
  const [showResetModal, setShowResetModal] = useState(false);
  const { onSave, saving, hasChanges, loading, clearSheet } = useDataContext();

  const sheetName = "start";

  const infoCols: Column[] = useMemo(
    () => [
      {
        key: "label",
        title: "会社名",
        width: 200,
        align: "center",
        cellClassName: "!p-0 !h-full relative text-lg",
        render: (value: string, record: InfoRowDataType, index: number) => {
          return (
            <CustomInput
              type="text"
              sheet={sheetName}
              cell={value}
              height="full"
              className={`border-transparent h-full text-lg text-center p-2 font-semibold`}
            />
          );
        },
      },
      {
        key: "from",
        title: "自",
        width: 100,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: InfoRowDataType, index: number) => {
          return (
            <CustomInput
              type="text"
              sheet={sheetName}
              cell={value}
              placeholder="2024/04/01"
              tip="日付形式: YYYY/MM/DD (例: 2024/04/01)"
              tipClassName="text-red-500"
              className={`border-transparent h-full text-lg text-center p-2`}
              renderValue={(val) => {
                // Format date when displaying from context
                if (typeof val === "string" && val && val.length >= 4) {
                  // If it's already formatted (contains slashes), return as is
                  if (val.includes("/")) {
                    return val;
                  }
                  // If it's just digits, format it
                  const digitsOnly = val.replace(/[^\d]/g, "");
                  if (digitsOnly.length >= 4) {
                    let formatted = digitsOnly.substring(0, 4);
                    if (digitsOnly.length >= 6) {
                      formatted += "/" + digitsOnly.substring(4, 6);
                    }
                    if (digitsOnly.length >= 8) {
                      formatted += "/" + digitsOnly.substring(6, 8);
                    }
                    return formatted;
                  }
                }
                return val;
              }}
              onKeyDown={(e) => {
                // Allow only numbers, slash, and control keys
                const allowedKeys = [
                  "Backspace",
                  "Delete",
                  "Tab",
                  "Enter",
                  "ArrowLeft",
                  "ArrowRight",
                  "ArrowUp",
                  "ArrowDown",
                ];
                if (!allowedKeys.includes(e.key) && !/[\d/]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onInput={(e) => {
                let value = e.currentTarget.value;
                // Auto-format as user types
                const digitsOnly = value.replace(/[^\d]/g, "");
                let formatted = digitsOnly;

                if (digitsOnly.length >= 4) {
                  formatted =
                    digitsOnly.substring(0, 4) + "/" + digitsOnly.substring(4);
                }
                if (digitsOnly.length >= 6) {
                  formatted =
                    digitsOnly.substring(0, 4) +
                    "/" +
                    digitsOnly.substring(4, 6) +
                    "/" +
                    digitsOnly.substring(6, 8);
                }
                if (digitsOnly.length > 8) {
                  formatted =
                    digitsOnly.substring(0, 4) +
                    "/" +
                    digitsOnly.substring(4, 6) +
                    "/" +
                    digitsOnly.substring(6, 8);
                }

                // Validate date parts
                if (formatted.length >= 7) {
                  const parts = formatted.split("/");
                  const year = parseInt(parts[0]);
                  const month = parseInt(parts[1]);
                  const day = parseInt(parts[2] || "0");

                  // Validate month (01-12)
                  if (month > 12) {
                    formatted = parts[0] + "/12/" + (parts[2] || "");
                  }

                  // Validate day (01-31)
                  if (day > 31) {
                    formatted = parts[0] + "/" + parts[1] + "/31";
                  }

                  // Additional validation for specific months
                  if (month === 2 && day > 29) {
                    formatted = parts[0] + "/02/29";
                  }
                  if ([4, 6, 9, 11].includes(month) && day > 30) {
                    formatted = parts[0] + "/" + parts[1] + "/30";
                  }
                }

                if (formatted !== value) {
                  e.currentTarget.value = formatted;
                }
              }}
            />
          );
        },
      },
      {
        key: "to",
        title: "至",
        width: 100,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: InfoRowDataType, index: number) => {
          return (
            <CustomInput
              type="text"
              sheet={sheetName}
              cell={value}
              placeholder="2024/03/31"
              tip="日付形式: YYYY/MM/DD (例: 2024/03/31)"
              tipClassName="text-red-500"
              className={`border-transparent h-full text-lg text-center p-2`}
              renderValue={(val) => {
                // Format date when displaying from context
                if (typeof val === "string" && val && val.length >= 4) {
                  // If it's already formatted (contains slashes), return as is
                  if (val.includes("/")) {
                    return val;
                  }
                  // If it's just digits, format it
                  const digitsOnly = val.replace(/[^\d]/g, "");
                  if (digitsOnly.length >= 4) {
                    let formatted = digitsOnly.substring(0, 4);
                    if (digitsOnly.length >= 6) {
                      formatted += "/" + digitsOnly.substring(4, 6);
                    }
                    if (digitsOnly.length >= 8) {
                      formatted += "/" + digitsOnly.substring(6, 8);
                    }
                    return formatted;
                  }
                }
                return val;
              }}
              onKeyDown={(e) => {
                // Allow only numbers, slash, and control keys
                const allowedKeys = [
                  "Backspace",
                  "Delete",
                  "Tab",
                  "Enter",
                  "ArrowLeft",
                  "ArrowRight",
                  "ArrowUp",
                  "ArrowDown",
                ];
                if (!allowedKeys.includes(e.key) && !/[\d/]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onInput={(e) => {
                let value = e.currentTarget.value;
                // Auto-format as user types
                const digitsOnly = value.replace(/[^\d]/g, "");
                let formatted = digitsOnly;

                if (digitsOnly.length >= 4) {
                  formatted =
                    digitsOnly.substring(0, 4) + "/" + digitsOnly.substring(4);
                }
                if (digitsOnly.length >= 6) {
                  formatted =
                    digitsOnly.substring(0, 4) +
                    "/" +
                    digitsOnly.substring(4, 6) +
                    "/" +
                    digitsOnly.substring(6, 8);
                }
                if (digitsOnly.length > 8) {
                  formatted =
                    digitsOnly.substring(0, 4) +
                    "/" +
                    digitsOnly.substring(4, 6) +
                    "/" +
                    digitsOnly.substring(6, 8);
                }

                // Validate date parts
                if (formatted.length >= 7) {
                  const parts = formatted.split("/");
                  const year = parseInt(parts[0]);
                  const month = parseInt(parts[1]);
                  const day = parseInt(parts[2] || "0");

                  // Validate month (01-12)
                  if (month > 12) {
                    formatted = parts[0] + "/12/" + (parts[2] || "");
                  }

                  // Validate day (01-31)
                  if (day > 31) {
                    formatted = parts[0] + "/" + parts[1] + "/31";
                  }

                  // Additional validation for specific months
                  if (month === 2 && day > 29) {
                    formatted = parts[0] + "/02/29";
                  }
                  if ([4, 6, 9, 11].includes(month) && day > 30) {
                    formatted = parts[0] + "/" + parts[1] + "/30";
                  }
                }

                if (formatted !== value) {
                  e.currentTarget.value = formatted;
                }
              }}
            />
          );
        },
      },
      {
        key: "number",
        title: "期名",
        width: 100,
        align: "center",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: InfoRowDataType, index: number) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              prefix="第"
              suffix="期"
              height="full"
              formatAsInteger={true}
              className={`border-transparent h-full text-lg text-center p-2 font-semibold`}
            />
          );
        },
      },
    ],
    [sheetName]
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
              renderValue={isPercentage ? (v) => Number(v) * 100 : undefined}
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
    <>
      <div className="h-full flex flex-col space-y-4  ">
        <div className="lg:flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">スタート</h1>
            <p className="text-gray-600">
              このページで元データを入力します（画像の項目に対応）。
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
        <div className="bg-yellow-100 p-2 border w-full border-yellow-300 text-sm text-gray-700">
          <span className="font-semibold">(百万円) 例: 2550万円→25.5</span>
        </div>
        <div>
          <AdvancedTable
            columns={infoCols as any}
            data={startSheet_info as any}
            dense
            bordered
            maxHeight={"full"}
            stickyHeader
          />
        </div>
        <div className="grid grid-cols-3 gap-2 flex-1 min-h-0">
          <div className="overflow-auto lg:col-span-2 col-span-3 flex flex-col h-[72vh]">
            <AdvancedTable
              columns={startSheetCols_main as any}
              data={startSheet_main as any}
              dense
              bordered
              maxHeight={"full"}
              stickyHeader
            />
          </div>
          <div className="lg:w-full grid lg:col-span-1 col-span-3 h-full  grid-rows-6 gap-2">
            <div className="row-span-1 border border-black bg-yellow-200 p-1 lg:h-full">
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
