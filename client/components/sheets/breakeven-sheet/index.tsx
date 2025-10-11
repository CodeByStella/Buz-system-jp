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

export default function BreakevenSheet() {
  const { onSave, saving, hasChanges, loading, errorMessage, retry, data } =
    useDataContext();

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

    const maxValue = Math.max(sales, breakevenPoint * 1.2);
    const points = [];

    // Generate points for sales line (y = x)
    for (let x = 0; x <= maxValue; x += maxValue / 20) {
      points.push({
        x: x,
        sales: x,
        totalCosts: fixedCosts + (variableCosts / sales) * x,
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

    // Calculate grid intervals based on maxValue
    const gridInterval = maxValue / 10;
    const gridSteps = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => i * gridInterval);

    return (
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-orange-500 text-white px-3 py-1 text-sm font-semibold">
          {title}
        </div>
        <div className="p-4">
          <div className="relative h-80 bg-gray-50 border">
            <svg className="w-full h-full" viewBox="0 0 500 320">
              {/* Grid lines */}
              {[0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500].map((x, i) => (
                <line
                  key={`v-${x}`}
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={320}
                  stroke={i % 2 === 0 ? "#d1d5db" : "#e5e7eb"}
                  strokeWidth={i % 2 === 0 ? "1" : "0.5"}
                />
              ))}
              {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((y, i) => (
                <line
                  key={`h-${y}`}
                  x1={0}
                  y1={y}
                  x2={500}
                  y2={y}
                  stroke={i % 2 === 0 ? "#d1d5db" : "#e5e7eb"}
                  strokeWidth={i % 2 === 0 ? "1" : "0.5"}
                />
              ))}

              {/* Sales line (orange) with glow effect */}
              {chartData.length > 0 && (
                <>
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <polyline
                    points={chartData
                      .map(
                        (point) =>
                          `${(point.x / maxValue) * 500},${
                            320 - (point.sales / maxValue) * 320
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
                        `${(point.x / maxValue) * 500},${
                          320 - (point.totalCosts / maxValue) * 320
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
                    cx={(breakevenPoint / maxValue) * 500}
                    cy={320 - (breakevenPoint / maxValue) * 320}
                    r="6"
                    fill="#fff"
                    stroke="#000"
                    strokeWidth="2"
                  />
                  
                  {/* Vertical line to break-even point */}
                  <line
                    x1={(breakevenPoint / maxValue) * 500}
                    y1={320 - (breakevenPoint / maxValue) * 320}
                    x2={(breakevenPoint / maxValue) * 500}
                    y2={320}
                    stroke="#9ca3af"
                    strokeWidth="1"
                    strokeDasharray="5,5"
                  />
                  
                  {/* Break-even point value annotation */}
                  <text
                    x={(breakevenPoint / maxValue) * 500 + 10}
                    y={320 - (breakevenPoint / maxValue) * 320 - 10}
                    fontSize="12"
                    fill="#374151"
                    fontWeight="bold"
                  >
                    ¥{breakevenPoint.toLocaleString()}
                  </text>
                </>
              )}

              {/* Y-axis labels */}
              {gridSteps.map((value, i) => (
                <text
                  key={`y-label-${i}`}
                  x="5"
                  y={320 - (i * 32) + 4}
                  fontSize="10"
                  fill="#6b7280"
                >
                  ¥{Math.round(value / 1000000)}M
                </text>
              ))}

              {/* X-axis labels */}
              {gridSteps.map((value, i) => (
                <text
                  key={`x-label-${i}`}
                  x={i * 50 - 15}
                  y={315}
                  fontSize="10"
                  fill="#6b7280"
                >
                  ¥{Math.round(value / 1000000)}M
                </text>
              ))}

              {/* Line labels on graph */}
              <text
                x="450"
                y="50"
                fontSize="12"
                fill="#3b82f6"
                fontWeight="bold"
              >
                総費用線
              </text>
              <text
                x="450"
                y="70"
                fontSize="12"
                fill="#f97316"
                fontWeight="bold"
              >
                売上高線
              </text>

              {/* Legend */}
              <rect x="10" y="10" width="12" height="3" fill="#3b82f6" />
              <text x="25" y="20" fontSize="10" fill="#374151" fontWeight="500">
                総費用
              </text>
              <rect x="80" y="10" width="12" height="3" fill="#f97316" />
              <text x="95" y="20" fontSize="10" fill="#374151" fontWeight="500">
                売上高
              </text>
              <circle cx="145" cy="11" r="3" fill="#fff" stroke="#000" strokeWidth="1" />
              <text x="155" y="20" fontSize="10" fill="#374151" fontWeight="500">
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
    <div className="h-full flex flex-col space-y-4 overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">損益分岐点分析</h1>
          <p className="text-gray-600">
            現状と来期の損益分岐点を比較分析します。
          </p>
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

      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
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
              (Number(data?.[sheetName]?.[5]?.[1]) || 0) * 1.2
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
              (Number(data?.[sheetName]?.[5]?.[4]) || 0) * 1.2
            )}
          />
        </div>
      </div>
    </div>
  );
}
