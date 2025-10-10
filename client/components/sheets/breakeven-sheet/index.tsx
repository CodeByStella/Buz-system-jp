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
    const chartData = generateChartData(sales, variableCosts, fixedCosts, breakevenPoint);

    return (
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-orange-500 text-white px-3 py-1 text-sm font-semibold">
          {title}
        </div>
        <div className="p-4">
          <div className="relative h-64 bg-gray-50 border">
            <svg className="w-full h-full" viewBox="0 0 400 250">
              {/* Grid lines */}
              {[0, 50, 100, 150, 200, 250, 300, 350, 400].map((x) => (
                <line
                  key={`v-${x}`}
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={250}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}
              {[0, 50, 100, 150, 200, 250].map((y) => (
                <line
                  key={`h-${y}`}
                  x1={0}
                  y1={y}
                  x2={400}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}

              {/* Sales line (orange) */}
              {chartData.length > 0 && (
                <polyline
                  points={chartData
                    .map(
                      (point) =>
                        `${(point.x / maxValue) * 400},${250 - (point.sales / maxValue) * 250}`
                    )
                    .join(" ")}
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                />
              )}

              {/* Total costs line (blue) */}
              {chartData.length > 0 && (
                <polyline
                  points={chartData
                    .map(
                      (point) =>
                        `${(point.x / maxValue) * 400},${250 - (point.totalCosts / maxValue) * 250}`
                    )
                    .join(" ")}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
              )}

              {/* Break-even point */}
              {breakevenPoint > 0 && (
                <circle
                  cx={(breakevenPoint / maxValue) * 400}
                  cy={250 - (breakevenPoint / maxValue) * 250}
                  r="4"
                  fill="#000"
                />
              )}

              {/* Labels */}
              <text x="10" y="20" fontSize="10" fill="#666">
                ¥0
              </text>
              <text x="10" y="240" fontSize="10" fill="#666">
                ¥{maxValue.toLocaleString()}
              </text>

              {/* Legend */}
              <rect x="10" y="10" width="8" height="2" fill="#3b82f6" />
              <text x="20" y="18" fontSize="8" fill="#666">
                総費用
              </text>
              <rect x="60" y="10" width="8" height="2" fill="#f97316" />
              <text x="70" y="18" fontSize="8" fill="#666">
                売上高
              </text>
              <circle cx="120" cy="11" r="2" fill="#000" />
              <text x="125" y="18" fontSize="8" fill="#666">
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
          />

          <BreakevenChart
            title="現状"
            sales={data?.[sheetName]?.[1]?.[1] || 0} // B2
            variableCosts={data?.[sheetName]?.[2]?.[1] || 0} // B3
            fixedCosts={data?.[sheetName]?.[3]?.[1] || 0} // B4
            breakevenPoint={data?.[sheetName]?.[5]?.[1] || 0} // B6
            maxValue={Math.max(
              data?.[sheetName]?.[1]?.[1] || 0,
              (data?.[sheetName]?.[5]?.[1] || 0) * 1.2
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
          />

          <BreakevenChart
            title="来期"
            sales={data?.[sheetName]?.[1]?.[4] || 0} // E2
            variableCosts={data?.[sheetName]?.[2]?.[4] || 0} // E3
            fixedCosts={data?.[sheetName]?.[3]?.[4] || 0} // E4
            breakevenPoint={data?.[sheetName]?.[5]?.[4] || 0} // E6
            maxValue={Math.max(
              data?.[sheetName]?.[1]?.[4] || 0,
              (data?.[sheetName]?.[5]?.[4] || 0) * 1.2
            )}
          />
        </div>
      </div>
    </div>
  );
}