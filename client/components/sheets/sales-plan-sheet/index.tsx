"use client";

import React, { useMemo } from "react";
import { AdvancedTable, Column, CellSpan } from "@/components/ui/advanced-table";
import { salesPlanRows, monthNames, SalesPlanRowDataType } from "./cells";
import { CustomInput } from "@/components/ui/customInput";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Save, Loader2 } from "lucide-react";
import { useDataContext } from "@/lib/contexts";
import { SheetNameType } from "@/lib/transformers/dataTransformer";

export default function SalesPlanSheet() {
  const { onSave, saving, hasChanges, loading, errorMessage, retry } =
    useDataContext();

  const sheetName: SheetNameType = "sales_plan_by_department";

  // Function to get cell span configuration for each cell
  const getCellSpan = (record: SalesPlanRowDataType, rowIndex: number, column: Column<SalesPlanRowDataType>): CellSpan<SalesPlanRowDataType> | null => {
    if (column.key === 'label') {
      if (record.type === 'target' && record.rowspan) {
        return { rowIndex, colIndex: 0, rowspan: record.rowspan };
      }
      if (record.isSpanned) {
        return { rowIndex, colIndex: 0, isSpanned: true };
      }
    }
    return null;
  };

  // Define columns for the sales plan table
  const salesPlanColumns: Column<SalesPlanRowDataType>[] = useMemo(() => [
    {
      key: 'label',
      title: '商品名',
      width: 120,
      align: 'center',
      cellClassName: '!p-0 !h-full relative',
      render: (value: string, record: SalesPlanRowDataType) => {
        if (record.isSpanned) return null;
        
        return (
          <div className={cn(
            record.bgcolor,
            'flex items-center justify-center h-full w-full absolute top-0 left-0 text-xs font-medium'
          )}>
            {value}
          </div>
        );
      },
    },
    {
      key: 'salesTarget',
      title: '売上目標',
      width: 100,
      align: 'center',
      cellClassName: '!p-0 !h-full relative',
      render: (value: string, record: SalesPlanRowDataType) => {
        if (record.isSpanned) return null;
        if (!value) return <div className="text-center text-xs text-gray-500">-</div>;
        
        return (
          <CustomInput
            type="number"
            sheet={sheetName}
            cell={value}
            className="border-transparent h-full text-xs text-center w-full"
          />
        );
      },
    },
    // Generate monthly columns
    ...monthNames.map((month, monthIndex) => ({
      key: `month_${monthIndex}`,
      title: month,
      width: 140,
      align: 'center' as const,
      colspan: 2,
      headerClassName: 'bg-blue-100 text-center',
      render: (value: any, record: SalesPlanRowDataType) => {
        if (record.isSpanned) return null;
        
        return (
          <div className="grid grid-cols-2 gap-1 h-full">
            <div className="text-center text-xs text-gray-500">当月</div>
            <div className="text-center text-xs text-gray-500">累計</div>
          </div>
        );
      },
    })),
    // Generate sub-columns for each month (当月 and 累計)
    ...monthNames.flatMap((month, monthIndex) => [
      {
        key: `month_${monthIndex}_current`,
        title: '当月',
        width: 70,
        align: 'center' as const,
        cellClassName: '!p-0 !h-full relative',
        render: (value: any, record: SalesPlanRowDataType) => {
          if (record.isSpanned) return null;
          
          const cellKey = record.type === 'target' 
            ? record.monthlyTargets[monthIndex]
            : record.monthlyActuals[monthIndex];
            
          if (!cellKey) return <div className="text-center text-xs text-gray-500">-</div>;
          
          return (
            <CustomInput
              type="number"
              sheet={sheetName}
              cell={cellKey}
              className="border-transparent h-full text-xs text-center w-full"
            />
          );
        },
      },
      {
        key: `month_${monthIndex}_cumulative`,
        title: '累計',
        width: 70,
        align: 'center' as const,
        cellClassName: '!p-0 !h-full relative',
        render: (value: any, record: SalesPlanRowDataType) => {
          if (record.isSpanned) return null;
          
          const cellKey = record.type === 'target' 
            ? record.cumulativeTargets[monthIndex]
            : record.cumulativeActuals[monthIndex];
            
          if (!cellKey) return <div className="text-center text-xs text-gray-500">-</div>;
          
          return (
            <div className="h-5 flex items-center justify-center text-xs bg-gray-100">
              <CustomInput
                type="number"
                sheet={sheetName}
                cell={cellKey}
                readOnly
                className="border-transparent h-full text-xs text-center w-full"
              />
            </div>
          );
        },
      },
    ]),
  ], [sheetName]);

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
          <h1 className="text-2xl font-bold text-gray-900">部門別販売計画</h1>
          <p className="text-gray-600">
            各商品カテゴリの月次目標と実績を入力して、売上計画を立てます。
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

      {/* Header with unit note */}
      <div className="bg-yellow-100 p-3 rounded-lg border border-yellow-300">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">(千円) 例: 2000万円→20000</span>
        </p>
      </div>

      {/* Main Sales Plan Table */}
      <div className="flex-1 min-h-0">
        <AdvancedTable
          columns={salesPlanColumns}
          data={salesPlanRows}
          bordered
          dense
          maxHeight="full"
          stickyHeader
          getCellSpan={getCellSpan}
          className="border border-gray-300"
        />
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 p-3">
        <div className="text-xs text-yellow-800 space-y-1">
          <p>
            各商品カテゴリの月次目標と実績を入力してください。累計は自動計算されます。
          </p>
          <p>
            ※〇〇の行は追加の商品カテゴリ用のプレースホルダーです。
          </p>
        </div>
      </div>
    </div>
  );
}
  
