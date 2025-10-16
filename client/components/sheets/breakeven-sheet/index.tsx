"use client";

import React, { useMemo } from "react";
import { AdvancedTable, Column } from "@/components/ui/advanced-table";
import {
  BreakevenRowDataType,
  currentStatus_cells,
  nextPeriod_cells,
} from "./cells";
import { CustomInput } from "@/components/ui/customInput";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Save, Loader2 } from "lucide-react";
import { useDataContext } from "@/lib/contexts";
import { SheetNameType } from "@/lib/transformers/dataTransformer";
import { ExcelExportButton } from "@/components/ui/excelExportButton";
import { PDFExportButton } from "@/components/ui/pdfExportButton";

export default function BreakevenSheet() {
  const {
    onSave,
    saving,
    hasChanges,
    loading,
    errorMessage,
    retry,
    data,
    clearSheet,
  } = useDataContext();

  const sheetName: SheetNameType = "break_even_point";

  const breakevenTableColumns: Column[] = useMemo(
    () => [
      {
        key: "label",
        title: "",
        width: 150,
        align: "left",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: BreakevenRowDataType) => {
          return (
            <div
              className={cn(
                record.bgcolor || "bg-white",
                "flex items-center h-full w-full absolute top-0 left-0 text-sm px-2"
              )}
            >
              {value}
            </div>
          );
        },
      },
      {
        key: "value",
        title: "",
        width: 120,
        align: "right",
        cellClassName: "!p-0 !h-full relative",
        render: (value: string, record: BreakevenRowDataType) => {
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={value}
              disabled={record.type === 0}
              readOnly={record.type === 2}
              tip={record.tip}
              tipClassName="text-red-500"
              prefix="¥"
              className={`border-transparent h-full text-sm text-right`}
            />
          );
        },
      },
    ],
    [sheetName]
  );

  // Generate chart data points for visualization
  const generateChartData = (
    sales: number,
    variableCosts: number,
    fixedCosts: number,
    breakevenPoint: number
  ) => {
    if (!sales || !variableCosts || !fixedCosts || !breakevenPoint) {
      return [];
    }

    // Ensure we always show the break-even point with some margin
    const maxValue = Math.max(
      sales,
      breakevenPoint * 1.3,
      (fixedCosts + variableCosts) * 1.2
    );
    const points = [];

    // Generate points for sales line (y = x) and total costs line
    for (let x = 0; x <= maxValue; x += maxValue / 25) {
      const totalCostsAtX = fixedCosts + (variableCosts / sales) * x;
      points.push({
        x: x,
        sales: x,
        totalCosts: totalCostsAtX,
      });
    }

    return points;
  };

  // Chart component for break-even analysis
  const BreakevenChart = ({
    title,
    sales,
    variableCosts,
    fixedCosts,
    breakevenPoint,
    maxValue,
  }: {
    title: string;
    sales: number;
    variableCosts: number;
    fixedCosts: number;
    breakevenPoint: number;
    maxValue: number;
  }) => {
    const chartData = generateChartData(
      sales,
      variableCosts,
      fixedCosts,
      breakevenPoint
    );

    // Calculate actual max value from chart data to ensure break-even point is visible
    const actualMaxValue =
      chartData.length > 0
        ? Math.max(
            ...chartData.map((d) => Math.max(d.x, d.sales, d.totalCosts))
          )
        : maxValue;

    // Ensure we have a reasonable scale even for small values
    const displayMaxValue = Math.max(
      actualMaxValue,
      breakevenPoint * 1.5,
      1000000
    );

    // Calculate grid intervals based on displayMaxValue
    const gridInterval = displayMaxValue / 10;
    const gridSteps = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
      (i) => i * gridInterval
    );

    // Calculate positions for better label placement using displayMaxValue
    const salesEndY =
      chartData.length > 0 ? 320 - (sales / displayMaxValue) * 320 : 320;
    const costsEndY =
      chartData.length > 0
        ? 320 - ((fixedCosts + variableCosts) / displayMaxValue) * 320
        : 320;
    const breakevenX = (breakevenPoint / displayMaxValue) * 500;
    const breakevenY = 320 - (breakevenPoint / displayMaxValue) * 320;

    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg shadow-sm ">
        <div className="bg-orange-500 text-white px-3 py-1 text-sm font-semibold">
          {title}
        </div>
        <div className="p-4">
          <div className="relative h-80 bg-gray-700 border border-gray-600">
            <svg className="w-full h-full" viewBox="0 0 500 320">
              {/* Grid lines - dark theme */}
              {[0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500].map(
                (x, i) => (
                  <line
                    key={`v-${x}`}
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={320}
                    stroke={i % 2 === 0 ? "#4b5563" : "#374151"}
                    strokeWidth={i % 2 === 0 ? "1" : "0.5"}
                  />
                )
              )}
              {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((y, i) => (
                <line
                  key={`h-${y}`}
                  x1={0}
                  y1={y}
                  x2={500}
                  y2={y}
                  stroke={i % 2 === 0 ? "#4b5563" : "#374151"}
                  strokeWidth={i % 2 === 0 ? "1" : "0.5"}
                />
              ))}

              {/* Sales line (orange) with glow effect */}
              {chartData.length > 0 && (
                <>
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <polyline
                    points={chartData
                      .map(
                        (point) =>
                          `${(point.x / displayMaxValue) * 500},${
                            320 - (point.sales / displayMaxValue) * 320
                          }`
                      )
                      .join(" ")}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="3"
                    filter="url(#glow)"
                  />
                </>
              )}

              {/* Total costs line (blue) with glow effect */}
              {chartData.length > 0 && (
                <polyline
                  points={chartData
                    .map(
                      (point) =>
                        `${(point.x / displayMaxValue) * 500},${
                          320 - (point.totalCosts / displayMaxValue) * 320
                        }`
                    )
                    .join(" ")}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  filter="url(#glow)"
                />
              )}

              {/* Break-even point with annotation */}
              {breakevenPoint > 0 && (
                <>
                  {/* Break-even point circle */}
                  <circle
                    cx={breakevenX}
                    cy={breakevenY}
                    r="6"
                    fill="#fff"
                    stroke="#000"
                    strokeWidth="2"
                  />

                  {/* Vertical line to break-even point */}
                  <line
                    x1={breakevenX}
                    y1={breakevenY}
                    x2={breakevenX}
                    y2={320}
                    stroke="#9ca3af"
                    strokeWidth="1"
                    strokeDasharray="5,5"
                  />

                  {/* Break-even point value annotation with dynamic positioning */}
                  <text
                    x={Math.min(Math.max(breakevenX + 10, 10), 350)}
                    y={Math.min(Math.max(breakevenY - 10, 20), 300)}
                    fontSize="12"
                    fill="#ffffff"
                    fontWeight="bold"
                    textAnchor="start"
                  >
                    ¥{breakevenPoint.toLocaleString()}
                  </text>
                </>
              )}

              {/* Y-axis labels - better spacing and positioning */}
              {gridSteps.map((value, i) => {
                const yPos = 320 - i * 32 + 4;
                const labelValue = Math.round(value / 1000000);
                return (
                  <text
                    key={`y-label-${i}`}
                    x="5"
                    y={yPos}
                    fontSize="9"
                    fill="#d1d5db"
                    textAnchor="start"
                  >
                    ¥{labelValue}M
                  </text>
                );
              })}

              {/* X-axis labels - better spacing and positioning */}
              {gridSteps.map((value, i) => {
                const xPos = Math.max(5, Math.min(i * 50 - 15, 480));
                const labelValue = Math.round(value / 1000000);
                return (
                  <text
                    key={`x-label-${i}`}
                    x={xPos}
                    y={315}
                    fontSize="9"
                    fill="#d1d5db"
                    textAnchor="middle"
                  >
                    ¥{labelValue}M
                  </text>
                );
              })}

              {/* Arrow and label for sales line */}
              {chartData.length > 0 && (
                <>
                  {/* Arrow pointing to sales line */}
                  <line
                    x1="400"
                    y1="70"
                    x2="450"
                    y2="70"
                    stroke="#9ca3af"
                    strokeWidth="1"
                    markerEnd="url(#arrowhead)"
                  />
                  <text
                    x="455"
                    y="75"
                    fontSize="11"
                    fill="#f97316"
                    fontWeight="bold"
                    textAnchor="start"
                  >
                    売上高線
                  </text>
                </>
              )}

              {/* Arrow and label for costs line */}
              {chartData.length > 0 && (
                <>
                  {/* Arrow pointing to costs line */}
                  <line
                    x1="400"
                    y1="50"
                    x2="450"
                    y2="50"
                    stroke="#9ca3af"
                    strokeWidth="1"
                    markerEnd="url(#arrowhead)"
                  />
                  <text
                    x="455"
                    y="55"
                    fontSize="11"
                    fill="#3b82f6"
                    fontWeight="bold"
                    textAnchor="start"
                  >
                    総費用線
                  </text>
                </>
              )}

              {/* Arrow and label for break-even point */}
              {breakevenPoint > 0 && (
                <>
                  {/* Arrow pointing to break-even point */}
                  <line
                    x1="400"
                    y1="90"
                    x2="450"
                    y2="90"
                    stroke="#9ca3af"
                    strokeWidth="1"
                    markerEnd="url(#arrowhead)"
                  />
                  <text
                    x="455"
                    y="95"
                    fontSize="11"
                    fill="#ffffff"
                    fontWeight="bold"
                    textAnchor="start"
                  >
                    損益分岐点
                  </text>
                </>
              )}

              {/* Arrow marker definition */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#9ca3af" />
                </marker>
              </defs>

              {/* Legend */}
              <rect x="10" y="10" width="12" height="3" fill="#3b82f6" />
              <text x="25" y="20" fontSize="10" fill="#d1d5db" fontWeight="500">
                総費用
              </text>
              <rect x="80" y="10" width="12" height="3" fill="#f97316" />
              <text x="95" y="20" fontSize="10" fill="#d1d5db" fontWeight="500">
                売上高
              </text>
              <circle
                cx="145"
                cy="11"
                r="3"
                fill="#fff"
                stroke="#000"
                strokeWidth="1"
              />
              <text
                x="155"
                y="20"
                fontSize="10"
                fill="#d1d5db"
                fontWeight="500"
              >
                損益分岐点
              </text>
            </svg>
          </div>
        </div>
      </div>
    );
  };

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
    <div className="h-full flex flex-col space-y-4 ">
      <div className="lg:flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">損益分岐点分析</h1>
          <p className="text-gray-600">
            現状と来期の損益分岐点を比較分析します。
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
            onClick={() => {
              if (
                window.confirm(
                  "このシートの全入力をクリアします。よろしいですか？この操作は元に戻せません。"
                )
              ) {
                clearSheet(sheetName);
              }
            }}
          >
            全入力クリア
          </Button>
          <ExcelExportButton />
          <PDFExportButton />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Current Status (現状) */}
        <div className="flex flex-col space-y-4">
          <AdvancedTable
            columns={breakevenTableColumns}
            data={currentStatus_cells}
            bordered
            dense
            hideHeader
            maxHeight={"300px"}
            cellClassName="!p-0"
            title={<div className="text-center w-full p-1">来期</div>}
          />

          <BreakevenChart
            title="来期"
            sales={Number(data?.[sheetName]?.[1]?.[1]) || 0} // B2
            variableCosts={Number(data?.[sheetName]?.[2]?.[1]) || 0} // B3
            fixedCosts={Number(data?.[sheetName]?.[3]?.[1]) || 0} // B4
            breakevenPoint={Number(data?.[sheetName]?.[5]?.[1]) || 0} // B6
            maxValue={Math.max(
              Number(data?.[sheetName]?.[1]?.[1]) || 0,
              Number(data?.[sheetName]?.[2]?.[1]) || 0,
              Number(data?.[sheetName]?.[3]?.[1]) || 0,
              (Number(data?.[sheetName]?.[5]?.[1]) || 0) * 1.5,
              1000000
            )}
          />
        </div>

        {/* Next Period (来期) */}
        <div className="flex flex-col space-y-4">
          <AdvancedTable
            columns={breakevenTableColumns}
            data={nextPeriod_cells}
            bordered
            dense
            hideHeader
            maxHeight={"300px"}
            cellClassName="!p-0"
            title={<div className="text-center p-1 w-full">現状</div>}
          />

          <BreakevenChart
            title="現状"
            sales={Number(data?.[sheetName]?.[1]?.[4]) || 0} // E2
            variableCosts={Number(data?.[sheetName]?.[2]?.[4]) || 0} // E3
            fixedCosts={Number(data?.[sheetName]?.[3]?.[4]) || 0} // E4
            breakevenPoint={Number(data?.[sheetName]?.[5]?.[4]) || 0} // E6
            maxValue={Math.max(
              Number(data?.[sheetName]?.[1]?.[4]) || 0,
              Number(data?.[sheetName]?.[2]?.[4]) || 0,
              Number(data?.[sheetName]?.[3]?.[4]) || 0,
              (Number(data?.[sheetName]?.[5]?.[4]) || 0) * 1.5,
              1000000
            )}
          />
        </div>
      </div>
    </div>
  );
}
