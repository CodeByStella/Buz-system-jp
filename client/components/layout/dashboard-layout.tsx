'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { api } from '@/lib/api'

// Import all sheet components
import { ExcelForm } from '@/components/user/excel-form'
import MQCurrentSheet from '@/components/sheets/mq-current-sheet'
import { ProfitSheet } from '@/components/sheets/profit-sheet'
import MQFutureSheet from '@/components/sheets/mq-future-sheet'
import BreakevenSheet from '@/components/sheets/breakeven-sheet'
import SalarySheet from '@/components/sheets/salary-sheet'
import ExpensesSheet from '@/components/sheets/expenses-sheet'
import ManufacturingLaborSheet from '@/components/sheets/manufacturing-labor-sheet'
import ManufacturingExpensesSheet from '@/components/sheets/manufacturing-expenses-sheet'
import CostDetailsSheet from '@/components/sheets/cost-details-sheet'
import ProgressSheet from '@/components/sheets/progress-sheet'
import SalesPlanSheet from '@/components/sheets/sales-plan-sheet'
import ProfitPlanSheet from '@/components/sheets/profit-plan-sheet'

interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'USER'
}

const startSheetCells = [
  // 売上・粗利
  { key: 'sales_net', label: '直売上', value: 0, editable: true },
  { key: 'gross_profit_amount', label: '売上総利益(額)', value: 0, editable: false, calculated: true, formula: '直売上 - 売上原価' },
  { key: 'gross_profit_rate', label: '粗利率(%)', value: 0, editable: false, calculated: true, formula: '売上総利益(額) / 直売上' },

  // 人件費 (例項目)
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
  { key: 'labor16_employee_benefit', label: '人件16 福利厚生費(行事)', value: 0, editable: true },
  { key: 'labor17_childcare', label: '人件17 子女手当/扶養', value: 0, editable: true },

  // 販売費・一般管理費（青）
  { key: 'sgna21_sales_promotion', label: '販管21 販売奨励費', value: 0, editable: true },
  { key: 'sgna22_transport', label: '販管22 運賃発送費', value: 0, editable: true },
  { key: 'sgna23_executive', label: '販管23 社長関連費用', value: 0, editable: true },
  { key: 'sgna24_tools', label: '販管24 備品・小物(消耗品)', value: 0, editable: true },
  { key: 'sgna25_tent', label: '販管25 テント/什器', value: 0, editable: true },
  { key: 'sgna26_royalty', label: '販管26 ロイヤリティ', value: 0, editable: true },
  { key: 'sgna27_depreciation', label: '販管27 減価償却費', value: 0, editable: true },
  { key: 'sgna28_insurance', label: '販管28 保険料', value: 0, editable: true },
  { key: 'sgna29_subcontract', label: '販管29 外注費', value: 0, editable: true },
  { key: 'sgna210_dm', label: '販管210 販促DM費', value: 0, editable: true },
  { key: 'sgna211_pr', label: '販管211 広報宣伝費', value: 0, editable: true },
  { key: 'sgna212_misc', label: '販管212 販売費雑費', value: 0, editable: true },

  // 製造原価 (例項目)
  { key: 'cogs01_opening', label: '原価01 期首商品棚卸高', value: 0, editable: true },
  { key: 'cogs02_purchase_discount', label: '原価02 仕入返品値引', value: 0, editable: true },
  { key: 'cogs03_purchases', label: '原価03 商品仕入高', value: 0, editable: true },
  { key: 'cogs04_purchase_expenses', label: '原価04 仕入諸掛', value: 0, editable: true },
  { key: 'cogs05_material1', label: '原価05 原材料仕入高1', value: 0, editable: true },
  { key: 'cogs06_material2', label: '原価06 原材料仕入高2', value: 0, editable: true },
  { key: 'cogs07_material3', label: '原価07 原材料仕入高3', value: 0, editable: true },
  { key: 'cogs08_submaterial', label: '原価08 仕損費', value: 0, editable: true },
  { key: 'cogs09_supplies', label: '原価09 工場消耗品', value: 0, editable: true },
  { key: 'cogs10_power', label: '原価10 工場水道光熱費', value: 0, editable: true },
  { key: 'cogs11_outsourcing', label: '原価11 外注費', value: 0, editable: true },
  { key: 'cogs12_subcontract', label: '原価12 外注工賃', value: 0, editable: true },
  { key: 'cogs13_wages', label: '原価13 (労務費内訳)', value: 0, editable: true },
  { key: 'cogs14_depreciation', label: '原価14 減価償却費', value: 0, editable: true },
  { key: 'cogs15_misc', label: '原価15 工場諸経費', value: 0, editable: true },
  { key: 'cogs16_transport', label: '原価16 運搬費', value: 0, editable: true },
  { key: 'cogs17_other', label: '原価17 その他', value: 0, editable: true },
  { key: 'cogs18_closing', label: '原価18 期末商品棚卸高', value: 0, editable: true, formula: '期末棚卸はマイナスで入力' },

  // 計算系（参考）
  { key: 'cogs_total', label: '売上原価 合計', value: 0, editable: false, calculated: true, formula: '原価項目の自動計算' },
  { key: 'operating_profit', label: '営業利益', value: 0, editable: false, calculated: true, formula: '売上総利益 - 販管費' },

  // 経費（オレンジ）抜粋
  { key: 'exp01_power', label: '経費1 電力費', value: 0, editable: true },
  { key: 'exp02_gas', label: '経費2 ガス代', value: 0, editable: true },
  { key: 'exp03_water', label: '経費3 水道代', value: 0, editable: true },
  { key: 'exp04_fuel', label: '経費4 燃料費', value: 0, editable: true },
  { key: 'exp05_comm', label: '経費5 通信費', value: 0, editable: true },
  { key: 'exp06_rent', label: '経費6 地代家賃', value: 0, editable: true },
  { key: 'exp07_land_rent', label: '経費7 土地賃借料', value: 0, editable: true },
  { key: 'exp08_vehicle', label: '経費8 車両費', value: 0, editable: true },
  { key: 'exp09_repair', label: '経費9 修繕費', value: 0, editable: true },
  { key: 'exp10_tools', label: '経費10 工具器具備品', value: 0, editable: true },
  { key: 'exp11_consumables', label: '経費11 消耗品費', value: 0, editable: true },
  { key: 'exp12_transport', label: '経費12 旅費交通費', value: 0, editable: true },
  { key: 'exp13_postage', label: '経費13 郵便料', value: 0, editable: true },
  { key: 'exp14_print', label: '経費14 印刷製本費', value: 0, editable: true },
  { key: 'exp15_commission', label: '経費15 支払手数料', value: 0, editable: true },
  { key: 'exp16_lease', label: '経費16 リース料', value: 0, editable: true },
  { key: 'exp17_comm', label: '経費17 通信交通費', value: 0, editable: true },
  { key: 'exp18_tax', label: '経費18 租税公課', value: 0, editable: true },
  { key: 'exp19_welfare', label: '経費19 福利厚生費', value: 0, editable: true },
  { key: 'exp20_office', label: '経費20 事務用品費', value: 0, editable: true },
  { key: 'exp21_heating', label: '経費21 暖房費', value: 0, editable: true },
  { key: 'exp22_light', label: '経費22 電灯料', value: 0, editable: true },
  { key: 'exp23_water', label: '経費23 水道料', value: 0, editable: true },
  { key: 'exp24_insurance', label: '経費24 保険料', value: 0, editable: true },
  { key: 'exp25_vehicle', label: '経費25 車両費(維持)', value: 0, editable: true },
  { key: 'exp26_travel', label: '経費26 旅費', value: 0, editable: true },
  { key: 'exp27_comm', label: '経費27 通信費', value: 0, editable: true },
  { key: 'exp28_meeting', label: '経費28 会議費', value: 0, editable: true },
  { key: 'exp29_entertain', label: '経費29 交際費', value: 0, editable: true },
  { key: 'exp30_repair', label: '経費30 修繕費', value: 0, editable: true },
  { key: 'exp31_outsource', label: '経費31 外注費', value: 0, editable: true },
  { key: 'exp32_depreciation', label: '経費32 減価償却費', value: 0, editable: true },
  { key: 'exp33_research', label: '経費33 研究開発費', value: 0, editable: true },
  { key: 'exp34_donation', label: '経費34 寄付金', value: 0, editable: true },
  { key: 'exp35_training', label: '経費35 研修費', value: 0, editable: true },
  { key: 'exp36_misc', label: '経費36 雑費', value: 0, editable: true },
  { key: 'exp37_bad_debt', label: '経費37 貸倒損失', value: 0, editable: true },

  // 営業外収益・費用・特別損益（紫）
  { key: 'nonop_income01', label: '営外収益 土地売却益', value: 0, editable: true },
  { key: 'nonop_income02', label: '営外収益 不動産賃貸', value: 0, editable: true },
  { key: 'nonop_expense01', label: '営外費用 有価証券評価損', value: 0, editable: true },
  { key: 'extraordinary_gain01', label: '特別利益 土地売却益', value: 0, editable: true },
  { key: 'extraordinary_gain02', label: '特別利益 事業再編補助', value: 0, editable: true },
  { key: 'extraordinary_loss01', label: '特別損失 土地売却損', value: 0, editable: true },

  // チェック欄（黄色）
  { key: 'check_cogs_total', label: 'チェック欄: 売上原価 合計', value: 0, editable: false, calculated: true },
  { key: 'check_sgna_total', label: 'チェック欄: 一般管理費 合計', value: 0, editable: false, calculated: true },
  { key: 'check_operating_profit', label: 'チェック欄: 営業利益', value: 0, editable: false, calculated: true },
  { key: 'check_profit_before_tax', label: 'チェック欄: 税引前利益', value: 0, editable: false, calculated: true },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('start') // State for active tab
  const router = useRouter()

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const data = await api.auth.me()
      setUser(data.user)
    } catch (error) {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'start':
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
      case 'mq-current':
        return <MQCurrentSheet />
      case 'profit':
        return <ProfitSheet />
      case 'mq-future':
        return <MQFutureSheet />
      case 'salary':
        return <SalarySheet />
      case 'expenses':
        return <ExpensesSheet />
      case 'manufacturing-labor':
        return <ManufacturingLaborSheet />
      case 'manufacturing-expenses':
        return <ManufacturingExpensesSheet />
      case 'cost-details':
        return <CostDetailsSheet />
      case 'breakeven':
        return <BreakevenSheet />
      case 'progress':
        return <ProgressSheet />
      case 'sales-plan':
        return <SalesPlanSheet />
      case 'profit-plan':
        return <ProfitPlanSheet />
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Coming Soon</h1>
            <p className="text-gray-600">This section is under development.</p>
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <div className="w-64 bg-white border-r border-gray-200 h-screen">
            <div className="p-4">
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="mt-4 space-y-2">
              {[...Array(13)].map((_, i) => (
                <div key={i} className="px-4 py-2">
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="p-6">
              <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">
      <Header />
      <div className="flex-1 overflow-hidden flex justify-center">
        <div className="w-full max-w-[1440px] h-full p-4">
          <div className="h-full border border-gray-200 bg-white overflow-hidden">
            <div className="flex h-full">
              <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
              <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 p-6 overflow-auto">
                  {renderContent()}
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
