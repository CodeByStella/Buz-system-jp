"use client";

import React from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "../../../ui/button";
import { CustomInput } from "../../../ui/customInput";
import { ExcelExportButton } from "../../../ui/excelExportButton";
import { PDFExportButton } from "../../../ui/pdfExportButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { useDataContext } from "../../../../lib/contexts";
import { cn } from "../../../../lib/utils";
import { inputDataRows, inputDataRowColors } from "./cells";

const sheetName = "input_data";

export default function InputDataSheet() {
  const { onSave, saving, hasChanges, loading } = useDataContext();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">入力データ</h1>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={onSave}
              disabled={saving || !hasChanges}
              leftIcon={saving ? <Loader2 className="animate-spin" /> : <Save />}
            >
              {saving ? "保存中..." : "保存"}
            </Button>
            <ExcelExportButton workbook="company_rating" />
            <PDFExportButton workbook="company_rating" />
          </div>
        </div>
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2 mb-3">
          貸借対照表を見ながら以下の項目を入力しましょう。入力後結果に反映されます
        </p>
      </div>

      {loading ? (
        <div className="h-64 bg-gray-100 animate-pulse rounded" />
      ) : (
        <div className="rounded border border-gray-200 overflow-hidden min-h-[200px]">
          <Table className="table-fixed">
            <colgroup>
              <col className="w-[140px]" />
              <col className="w-[160px]" />
              <col className="w-[130px]" />
              <col className="w-[32px]" />
              <col className="w-[160px]" />
              <col className="w-[130px]" />
              <col className="w-[48px]" />
            </colgroup>
            <TableHeader>
              <TableRow className="border-b bg-gray-50 hover:bg-gray-50">
                <TableHead className="font-medium text-center py-2">
                  会社名
                </TableHead>
                <TableHead className="font-medium text-center py-2">
                  日付
                </TableHead>
                <TableHead
                  colSpan={5}
                  className={cn(
                    "font-medium text-center py-2",
                    inputDataRowColors.lightGreen
                  )}
                >
                  この色の部分を打ち込む
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-b bg-gray-50 hover:bg-gray-50">
                <TableCell className="p-0 align-middle">
                  <div className="relative min-h-[2.5rem] w-full">
                    <CustomInput
                      type="text"
                      sheet={sheetName}
                      cell="B1"
                      placeholder="会社名を入力"
                      renderValue={(v) =>
                        v === 0 || v === "0" ? "" : (v as string | number)
                      }
                      className={cn(
                        "w-full min-h-[2.5rem] border-transparent text-center p-2",
                        inputDataRowColors.lightGreen
                      )}
                    />
                  </div>
                </TableCell>
                <TableCell className="p-0 align-middle">
                  <div className="relative min-h-[2.5rem] w-full">
                    <CustomInput
                      type="text"
                      sheet={sheetName}
                      cell="C1"
                      placeholder="2024/04/01"
                      tip="日付形式: YYYY/MM/DD (例: 2024/04/01)"
                      tipClassName="text-red-500"
                      renderValue={(val) => {
                        if (val === "日付") return "";
                        if (typeof val === "string" && val && val.length >= 4) {
                          if (val.includes("/")) return val;
                          const digitsOnly = val.replace(/[^\d]/g, "");
                          if (digitsOnly.length >= 4) {
                            let formatted = digitsOnly.substring(0, 4);
                            if (digitsOnly.length >= 6) formatted += "/" + digitsOnly.substring(4, 6);
                            if (digitsOnly.length >= 8) formatted += "/" + digitsOnly.substring(6, 8);
                            return formatted;
                          }
                        }
                        return val as string | number;
                      }}
                      onKeyDown={(e) => {
                        const allowedKeys = ["Backspace", "Delete", "Tab", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
                        if (!allowedKeys.includes(e.key) && !/[\d/]/.test(e.key)) e.preventDefault();
                      }}
                      onInput={(e) => {
                        const value = e.currentTarget.value;
                        const digitsOnly = value.replace(/[^\d]/g, "");
                        let formatted = digitsOnly;
                        if (digitsOnly.length >= 4) formatted = digitsOnly.substring(0, 4) + "/" + digitsOnly.substring(4);
                        if (digitsOnly.length >= 6) {
                          formatted = digitsOnly.substring(0, 4) + "/" + digitsOnly.substring(4, 6) + "/" + digitsOnly.substring(6, 8);
                        }
                        if (digitsOnly.length > 8) {
                          formatted = digitsOnly.substring(0, 4) + "/" + digitsOnly.substring(4, 6) + "/" + digitsOnly.substring(6, 8);
                        }
                        if (formatted.length >= 7) {
                          let parts = formatted.split("/");
                          let month = parseInt(parts[1], 10);
                          let day = parseInt(parts[2] || "0", 10);
                          if (month > 12) {
                            formatted = parts[0] + "/12/" + (parts[2] || "");
                            parts = formatted.split("/");
                            month = parseInt(parts[1], 10);
                            day = parseInt(parts[2] || "0", 10);
                          }
                          if (day > 31) formatted = parts[0] + "/" + parts[1] + "/31";
                          if (month === 2 && day > 29) formatted = parts[0] + "/02/29";
                          if ([4, 6, 9, 11].includes(month) && day > 30) formatted = parts[0] + "/" + parts[1] + "/30";
                        }
                        if (formatted !== value) e.currentTarget.value = formatted;
                      }}
                      className={cn(
                        "w-full min-h-[2.5rem] border-transparent text-center p-2",
                        inputDataRowColors.lightGreen
                      )}
                    />
                  </div>
                </TableCell>
                <TableCell colSpan={5} className="p-2" />
              </TableRow>
              {inputDataRows.map((row, index) => {
                const valueOnly = row.denomCell == null && row.denomLabel == null;
                return (
                  <TableRow
                    key={row.ratioName}
                    className={cn(
                      "border-b",
                      index % 2 === 1 && "bg-gray-50/50"
                    )}
                  >
                    <TableCell
                      className={cn(
                        "p-2 font-medium text-center align-middle whitespace-nowrap overflow-hidden text-overflow-ellipsis",
                        inputDataRowColors.yellow
                      )}
                      title={row.ratioName}
                    >
                      {row.ratioName}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "p-2 text-center align-middle text-xs overflow-hidden text-overflow-ellipsis whitespace-nowrap min-w-0",
                        inputDataRowColors.lightCyan
                      )}
                      title={row.numLabel || undefined}
                    >
                      {row.numLabel || "\u00A0"}
                    </TableCell>
                    {valueOnly ? (
                      <>
                        <TableCell
                          className={cn(
                            "p-0 align-middle min-w-0",
                            inputDataRowColors.lightGreen
                          )}
                        >
                          {row.numCell ? (
                            <div className="relative min-h-[2.5rem] w-full min-w-0 overflow-hidden">
                              <CustomInput
                                type="number"
                                sheet={sheetName}
                                cell={row.numCell}
                                className={cn(
                                  "w-full min-h-[2.5rem] border-transparent text-right p-2 min-w-0",
                                  inputDataRowColors.lightGreen
                                )}
                              />
                            </div>
                          ) : (
                            <span className="p-2 block min-h-[2.5rem]">&nbsp;</span>
                          )}
                        </TableCell>
                        <TableCell
                          colSpan={3}
                          className={cn(
                            "p-0 align-middle",
                            inputDataRowColors.lightGreen
                          )}
                        />
                        <TableCell className="p-2 text-center align-middle">
                          {row.times100 ? "×100" : ""}
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="p-0 align-middle min-w-[4rem]">
                          {row.numCell ? (
                            <div className="relative min-h-[2.5rem] w-full">
                              <CustomInput
                                type="number"
                                sheet={sheetName}
                                cell={row.numCell}
                                className={cn(
                                  "w-full min-h-[2.5rem] border-transparent text-right p-2",
                                  inputDataRowColors.lightGreen
                                )}
                              />
                            </div>
                          ) : (
                            <span className="p-2 block min-h-[2.5rem]">&nbsp;</span>
                          )}
                        </TableCell>
                        <TableCell className="p-2 text-center align-middle w-8">
                          ÷
                        </TableCell>
                        <TableCell
                          className={cn(
                            "p-2 text-center align-middle text-xs overflow-hidden text-overflow-ellipsis whitespace-nowrap min-w-0",
                            inputDataRowColors.lightCyan
                          )}
                          title={row.denomLabel ?? undefined}
                        >
                          {row.denomLabel ?? "\u00A0"}
                        </TableCell>
                        <TableCell className="p-0 align-middle min-w-[4rem]">
                          {row.denomCell ? (
                            <div className="relative min-h-[2.5rem] w-full">
                              <CustomInput
                                type="number"
                                sheet={sheetName}
                                cell={row.denomCell}
                                className={cn(
                                  "w-full min-h-[2.5rem] border-transparent text-right p-2",
                                  inputDataRowColors.lightGreen
                                )}
                              />
                            </div>
                          ) : (
                            <span className="p-2 block min-h-[2.5rem]">&nbsp;</span>
                          )}
                        </TableCell>
                        <TableCell className="p-2 text-center align-middle">
                          {row.times100 ? "×100" : ""}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
