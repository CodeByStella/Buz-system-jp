'use client'

import React from 'react'
import { ExcelForm } from '@/components/user/excel-form'

const startSheetCells = [
  { key: 'sales_net', label: '直売上', value: 0, editable: true },
  { key: 'gross_profit_amount', label: '売上総利益(額)', value: 0, editable: false, calculated: true, formula: '直売上 - 売上原価' },
  { key: 'gross_profit_rate', label: '粗利率(%)', value: 0, editable: false, calculated: true, formula: '売上総利益(額) / 直売上' },

  { key: 'labor01_salary', label: '人件1 給料総計', value: 0, editable: true },
  { key: 'labor02_bonus', label: '人件2 賞与', value: 0, editable: true },
  { key: 'labor03_allowances', label: '人件3 諸手当', value: 0, editable: true },
  { key: 'labor04_social_insurance', label: '人件4 法定福利費', value: 0, editable: true },
  { key: 'labor05_retirement', label: '人件5 退職給付費用', value: 0, editable: true },
  { key: 'labor06_outsourced', label: '人件6 派遣社員費用', value: 0, editable: true },
  { key: 'labor07_welfare', label: '人件7 福利厚生費', value: 0, editable: true },
  { key: 'labor08_travel', label: '人件8 旅費交通費', value: 0, editable: true },
  { key: 'labor09_recruit', label: '人件9 採用費', value: 0, editable: true },
  { key: 'labor10_beauty', label: '人件10 美装費', value: 0, editable: true },
  { key: 'labor11_training', label: '人件11 教育研修', value: 0, editable: true },
  { key: 'labor12_welfare_misc', label: '人件12 厚生費', value: 0, editable: true },
  { key: 'labor13_meeting', label: '人件13 会議費', value: 0, editable: true },
  { key: 'labor14_recruit_training', label: '人件14 研修教育費', value: 0, editable: true },
  { key: 'labor15_newspaper', label: '人件15 新聞図書費', value: 0, editable: true },
]

export default function StartSheet() {
  return (
    <div className="h-full flex flex-col space-y-4 overflow-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">スタート</h1>
        <p className="text-gray-600">このページで元データを入力します（画像の項目に対応）。</p>
      </div>
      <div className="flex-1 min-h-0">
        <ExcelForm
          sheetName="start"
          sheetTitle="スタート入力シート"
          cells={startSheetCells as any}
          dense
          showDescription={false}
          showGuide
          guideContent={
            <div>
              決算書を見ながら一つ一つ直近の数字を入力してください。製造原価を別に集計していない決算書であれば製造原価は未入力で構いません。期末の棚卸・仕掛はマイナスで入力してください。
            </div>
          }
        />
      </div>
    </div>
  )
}


