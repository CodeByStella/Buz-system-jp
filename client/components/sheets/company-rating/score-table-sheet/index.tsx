"use client";

import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { scoreTableData } from "./cells";

const BORDER = "border border-gray-300";
const CELL_PADDING = "px-2 py-1.5 text-xs";
const NO_WRAP = "whitespace-pre";
const HEADER_BG = "bg-amber-200 font-bold";
const SECTION_BG = "bg-sky-100 font-medium";

// Split into two tables at the blank separator row (line 34 in cells.ts)
const QUANTITATIVE_END_ROW = 25;

export default function ScoreTableSheet() {
  const quantitativeRows = scoreTableData.slice(0, QUANTITATIVE_END_ROW);
  const qualitativeRows = scoreTableData.slice(QUANTITATIVE_END_ROW);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">スコア表</h1>
      </div>

      {/* 定量要因テーブル */}
      <div className="rounded border border-gray-200 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table className="border-collapse min-w-[1200px]">
            <TableBody>
              {quantitativeRows.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={`border-b border-gray-200 ${
                    rowIndex === 0 ? HEADER_BG : ""
                  } ${rowIndex === 3 || rowIndex === 9 || rowIndex === 15 || rowIndex === 19 ? SECTION_BG : ""}`}
                >
                  {row.map((cell, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className={`${BORDER} ${CELL_PADDING} ${NO_WRAP}`}
                    >
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 定性要因テーブル */}
      <div className="rounded border border-gray-200 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table className="border-collapse min-w-[1200px]">
            <TableBody>
              {qualitativeRows.map((row, idx) => {
                const rowIndex = QUANTITATIVE_END_ROW + idx;
                const isHeader = idx === 1; // 配点 行
                const isSectionTitle = idx === 0; // 「定性要因」
                return (
                  <TableRow
                    key={rowIndex}
                    className={`border-b border-gray-200 ${
                      isHeader ? HEADER_BG : ""
                    } ${isSectionTitle ? SECTION_BG : ""}`}
                  >
                    {row.map((cell, colIndex) => (
                      <TableCell
                        key={colIndex}
                        className={`${BORDER} ${CELL_PADDING} ${NO_WRAP}`}
                      >
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
