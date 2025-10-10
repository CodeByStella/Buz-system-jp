'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CustomInput } from '@/components/ui/customInput'
import { Button } from '@/components/ui/button'
import { userService } from '@/lib/services'

interface ExpensesData {
  // 経費(固定) - Fixed Expenses
  vehicle_expenses: number
  rent_land_lease: number
  rental_fees: number
  taxes_public_dues: number
  entertainment_expenses: number
  payment_fees: number
  communication_transportation: number
  consumables: number
  office_supplies: number
  other_expenses: number
  miscellaneous_expenses: number
  utilities: number
  travel_transportation: number
  membership_fees: number
  book_expenses: number
  repair_expenses: number
  insurance_premiums: number
  electricity: number
  power: number
  gas_heating: number
  fuel: number
  water_supply: number
  sewerage: number
  rd_expenses: number
  research_expenses: number
  consultant_fees: number
  lease_fees: number
  travel_expenses: number
  decoration_expenses: number
  sanitation_expenses: number
  freight_charges: number
  packing_packaging: number
  management_fees: number
  maintenance_management: number
  maintenance_upkeep: number
  equipment_expenses: number
  donations: number
  depreciation: number
  
  // Fixed expenses totals
  fixed_expenses_total: number
  fixed_expenses_current_total: number
  
  // 販売促進費 - Sales Promotion Expenses
  sales_promotion_planning: number
  consumable_materials: number
  advertising_publicity: number
  recruitment_expenses: number
  education_training: number
  reserve_1: number
  reserve_2: number
  reserve_3: number
  reserve_4: number
  
  // Sales promotion totals
  sales_promotion_total: number
  sales_promotion_current_total: number
  
  // 人件費 - Personnel Expenses
  employee_salaries: number
  miscellaneous_salaries: number
  dispatched_employee_costs: number
  executive_compensation: number
  welfare_expenses: number
  statutory_welfare_expenses: number
  personnel_reserve_1: number
  personnel_reserve_2: number
  personnel_reserve_3: number
  personnel_reserve_4: number
  
  // Personnel totals
  personnel_total: number
  personnel_current_total: number
  
  // 事業費 - Business Expenses
  education_training_expenses: number
  business_strategy_expenses: number
  royalties: number
  planning_fees: number
  business_recruitment_expenses: number
  business_training_expenses: number
  meeting_expenses: number
  newspaper_book_expenses: number
  business_reserve_1: number
  business_reserve_2: number
  business_reserve_3: number
  business_reserve_4: number
  
  // Business expenses totals
  business_expenses_total: number
  business_expenses_current_total: number
  
  // Grand total
  grand_total: number
}

export default function ExpensesSheet() {
  const [data, setData] = useState<ExpensesData>({
    // Fixed expenses
    vehicle_expenses: 2.5,
    rent_land_lease: 8.0,
    rental_fees: 4.3,
    taxes_public_dues: 2.0,
    entertainment_expenses: 5.0,
    payment_fees: 5.6,
    communication_transportation: 1.4,
    consumables: 2.3,
    office_supplies: 1.5,
    other_expenses: 3.5,
    miscellaneous_expenses: 3.0,
    utilities: 1.7,
    travel_transportation: 3.0,
    membership_fees: 1.5,
    book_expenses: 0.4,
    repair_expenses: 1.0,
    insurance_premiums: 3.0,
    electricity: 0,
    power: 0,
    gas_heating: 0,
    fuel: 0,
    water_supply: 0,
    sewerage: 0,
    rd_expenses: 0,
    research_expenses: 0,
    consultant_fees: 0,
    lease_fees: 0,
    travel_expenses: 0,
    decoration_expenses: 0,
    sanitation_expenses: 0,
    freight_charges: 0,
    packing_packaging: 0,
    management_fees: 0,
    maintenance_management: 0,
    maintenance_upkeep: 0,
    equipment_expenses: 0,
    donations: 0,
    depreciation: 0,
    
    fixed_expenses_total: 49.7,
    fixed_expenses_current_total: 46.3,
    
    // Sales promotion expenses
    sales_promotion_planning: 6.0,
    consumable_materials: 0,
    advertising_publicity: 0,
    recruitment_expenses: 0,
    education_training: 0,
    reserve_1: 0,
    reserve_2: 0,
    reserve_3: 0,
    reserve_4: 0,
    
    sales_promotion_total: 6.0,
    sales_promotion_current_total: 2.0,
    
    // Personnel expenses
    employee_salaries: 31.2,
    miscellaneous_salaries: 1.0,
    dispatched_employee_costs: 0.0,
    executive_compensation: 15.0,
    welfare_expenses: 6.0,
    statutory_welfare_expenses: 12.0,
    personnel_reserve_1: 0,
    personnel_reserve_2: 0,
    personnel_reserve_3: 0,
    personnel_reserve_4: 0,
    
    personnel_total: 65.2,
    personnel_current_total: 55.5,
    
    // Business expenses
    education_training_expenses: 4.0,
    business_strategy_expenses: 0,
    royalties: 0,
    planning_fees: 0,
    business_recruitment_expenses: 0,
    business_training_expenses: 0,
    meeting_expenses: 0,
    newspaper_book_expenses: 0,
    business_reserve_1: 0,
    business_reserve_2: 0,
    business_reserve_3: 0,
    business_reserve_4: 0,
    
    business_expenses_total: 4.0,
    business_expenses_current_total: 0.0,
    
    grand_total: 124.9
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    initializeData()
  }, [])

  const initializeData = async () => {
    try {
      const result = await api.user.getInputs('expenses')
      const inputMap: Partial<ExpensesData> = {}
      ;(result.inputs || []).forEach((i: any) => {
        inputMap[i.cellKey as keyof ExpensesData] = Number(i.value) || 0
      })
      setData(prev => ({ ...prev, ...inputMap }))
    } catch (error) {
      console.error('Failed to load expenses data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = async (key: keyof ExpensesData, value: number) => {
    const newData = { ...data, [key]: value }
    setData(newData)

    try {
      await userService.saveUserInput({ sheet: 'expenses', cell: key, value })
      
      // Trigger recalculation
      const inputs = Object.fromEntries(
        Object.entries(newData).map(([k, v]) => [k, v])
      )
      const result = await userService.calculate({ sheet: 'expenses', inputs })
      
      // Update with calculated values
      setData(prev => ({ ...prev, ...(result.results || {}) }))
    } catch (error) {
      console.error('Failed to save input:', error)
    }
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      const promises = Object.entries(data).map(([key, value]) =>
        userService.saveUserInput({ sheet: 'expenses', cell: key, value })
      )
      await Promise.all(promises)
    } catch (error) {
      console.error('Failed to save all:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-3 text-sm">読み込み中...</div>
  }

  return (
    <div className="p-3 space-y-3 text-sm">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">④ (F) 経費を入力する</h1>
        <div className="flex items-center gap-4">
          <div className="text-xs text-gray-500">(百万円)</div>
          <div className="bg-yellow-100 border border-yellow-300 px-3 py-1 text-sm font-medium">
            ¥{data.grand_total.toFixed(1)}
          </div>
          <Button onClick={handleSaveAll} disabled={saving} className="h-8 px-3 text-xs">
            {saving ? '保存中...' : 'すべて保存'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* 経費(固定) - Fixed Expenses */}
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm">経費(固定)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Pre-filled items */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium">車輛費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.vehicle_expenses}
                  onChange={(e) => handleInputChange('vehicle_expenses', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">家賃地代</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.rent_land_lease}
                  onChange={(e) => handleInputChange('rent_land_lease', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">賃貸料</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.rental_fees}
                  onChange={(e) => handleInputChange('rental_fees', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">租税公課</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.taxes_public_dues}
                  onChange={(e) => handleInputChange('taxes_public_dues', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">接待交際費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.entertainment_expenses}
                  onChange={(e) => handleInputChange('entertainment_expenses', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">支払手数料</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.payment_fees}
                  onChange={(e) => handleInputChange('payment_fees', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">通信交通費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.communication_transportation}
                  onChange={(e) => handleInputChange('communication_transportation', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">消耗品費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.consumables}
                  onChange={(e) => handleInputChange('consumables', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">事務用品費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.office_supplies}
                  onChange={(e) => handleInputChange('office_supplies', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">その他経費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.other_expenses}
                  onChange={(e) => handleInputChange('other_expenses', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">雑費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.miscellaneous_expenses}
                  onChange={(e) => handleInputChange('miscellaneous_expenses', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">水道光熱費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.utilities}
                  onChange={(e) => handleInputChange('utilities', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">旅費交通費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.travel_transportation}
                  onChange={(e) => handleInputChange('travel_transportation', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">諸会費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.membership_fees}
                  onChange={(e) => handleInputChange('membership_fees', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">図書費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.book_expenses}
                  onChange={(e) => handleInputChange('book_expenses', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">修繕費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.repair_expenses}
                  onChange={(e) => handleInputChange('repair_expenses', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">保険料</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.insurance_premiums}
                  onChange={(e) => handleInputChange('insurance_premiums', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
            </div>
            
            {/* Additional items */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <label className="text-xs font-medium">電力費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.electricity}
                  onChange={(e) => handleInputChange('electricity', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">動力費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.power}
                  onChange={(e) => handleInputChange('power', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">ガス光熱費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.gas_heating}
                  onChange={(e) => handleInputChange('gas_heating', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">燃料費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.fuel}
                  onChange={(e) => handleInputChange('fuel', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">上水道費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.water_supply}
                  onChange={(e) => handleInputChange('water_supply', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">下水道費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.sewerage}
                  onChange={(e) => handleInputChange('sewerage', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">研究開発費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.rd_expenses}
                  onChange={(e) => handleInputChange('rd_expenses', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">調査研究費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.research_expenses}
                  onChange={(e) => handleInputChange('research_expenses', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">顧問料</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.consultant_fees}
                  onChange={(e) => handleInputChange('consultant_fees', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">リース料</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.lease_fees}
                  onChange={(e) => handleInputChange('lease_fees', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">出張費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.travel_expenses}
                  onChange={(e) => handleInputChange('travel_expenses', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">装飾費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.decoration_expenses}
                  onChange={(e) => handleInputChange('decoration_expenses', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">衛生費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.sanitation_expenses}
                  onChange={(e) => handleInputChange('sanitation_expenses', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">運賃</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.freight_charges}
                  onChange={(e) => handleInputChange('freight_charges', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">荷造包装費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.packing_packaging}
                  onChange={(e) => handleInputChange('packing_packaging', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">管理諸費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.management_fees}
                  onChange={(e) => handleInputChange('management_fees', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">保守管理費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.maintenance_management}
                  onChange={(e) => handleInputChange('maintenance_management', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">修繕維持費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.maintenance_upkeep}
                  onChange={(e) => handleInputChange('maintenance_upkeep', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">備品費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.equipment_expenses}
                  onChange={(e) => handleInputChange('equipment_expenses', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">寄付金</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.donations}
                  onChange={(e) => handleInputChange('donations', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">減価償却費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.depreciation}
                  onChange={(e) => handleInputChange('depreciation', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
            </div>
            
            {/* Totals */}
            <div className="border-t pt-2 mt-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-100 p-2">
                  <label className="text-xs font-medium">計</label>
                  <div className="text-xs text-gray-600">{data.fixed_expenses_total.toFixed(1)}</div>
                </div>
                <div className="bg-gray-100 p-2">
                  <label className="text-xs font-medium">現状 計</label>
                  <div className="text-xs text-gray-600">{data.fixed_expenses_current_total.toFixed(1)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 販売促進費 - Sales Promotion Expenses */}
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm">販売促進費</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium">販促企画費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.sales_promotion_planning}
                  onChange={(e) => handleInputChange('sales_promotion_planning', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">消耗資材費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.consumable_materials}
                  onChange={(e) => handleInputChange('consumable_materials', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">広告宣伝費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.advertising_publicity}
                  onChange={(e) => handleInputChange('advertising_publicity', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">募集費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.recruitment_expenses}
                  onChange={(e) => handleInputChange('recruitment_expenses', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">教育研修</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.education_training}
                  onChange={(e) => handleInputChange('education_training', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">予備1</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.reserve_1}
                  onChange={(e) => handleInputChange('reserve_1', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">予備2</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.reserve_2}
                  onChange={(e) => handleInputChange('reserve_2', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">予備3</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.reserve_3}
                  onChange={(e) => handleInputChange('reserve_3', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">予備4</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.reserve_4}
                  onChange={(e) => handleInputChange('reserve_4', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
            </div>
            
            {/* Totals */}
            <div className="border-t pt-2 mt-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-100 p-2">
                  <label className="text-xs font-medium">計</label>
                  <div className="text-xs text-gray-600">{data.sales_promotion_total.toFixed(1)}</div>
                </div>
                <div className="bg-gray-100 p-2">
                  <label className="text-xs font-medium">現状 計</label>
                  <div className="text-xs text-gray-600">{data.sales_promotion_current_total.toFixed(1)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 人件費 - Personnel Expenses */}
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm">人件費</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium">社員給料</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.employee_salaries}
                  onChange={(e) => handleInputChange('employee_salaries', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">雑給料</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.miscellaneous_salaries}
                  onChange={(e) => handleInputChange('miscellaneous_salaries', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">派遣社員費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.dispatched_employee_costs}
                  onChange={(e) => handleInputChange('dispatched_employee_costs', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">役員報酬</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.executive_compensation}
                  onChange={(e) => handleInputChange('executive_compensation', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">福利厚生費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.welfare_expenses}
                  onChange={(e) => handleInputChange('welfare_expenses', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">法定福利費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.statutory_welfare_expenses}
                  onChange={(e) => handleInputChange('statutory_welfare_expenses', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">予備1</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.personnel_reserve_1}
                  onChange={(e) => handleInputChange('personnel_reserve_1', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">予備2</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.personnel_reserve_2}
                  onChange={(e) => handleInputChange('personnel_reserve_2', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">予備3</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.personnel_reserve_3}
                  onChange={(e) => handleInputChange('personnel_reserve_3', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">予備4</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.personnel_reserve_4}
                  onChange={(e) => handleInputChange('personnel_reserve_4', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
            </div>
            
            {/* Totals */}
            <div className="border-t pt-2 mt-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-100 p-2">
                  <label className="text-xs font-medium">計</label>
                  <div className="text-xs text-gray-600">{data.personnel_total.toFixed(1)}</div>
                </div>
                <div className="bg-gray-100 p-2">
                  <label className="text-xs font-medium">現状 計</label>
                  <div className="text-xs text-gray-600">{data.personnel_current_total.toFixed(1)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 事業費 - Business Expenses */}
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm">事業費</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium">教育研修費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.education_training_expenses}
                  onChange={(e) => handleInputChange('education_training_expenses', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">事業戦略費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.business_strategy_expenses}
                  onChange={(e) => handleInputChange('business_strategy_expenses', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">ロイヤリティー</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.royalties}
                  onChange={(e) => handleInputChange('royalties', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">企画料</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.planning_fees}
                  onChange={(e) => handleInputChange('planning_fees', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">募集費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.business_recruitment_expenses}
                  onChange={(e) => handleInputChange('business_recruitment_expenses', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">研修費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.business_training_expenses}
                  onChange={(e) => handleInputChange('business_training_expenses', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">会議費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.meeting_expenses}
                  onChange={(e) => handleInputChange('meeting_expenses', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">新聞図書費</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.newspaper_book_expenses}
                  onChange={(e) => handleInputChange('newspaper_book_expenses', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">予備1</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.business_reserve_1}
                  onChange={(e) => handleInputChange('business_reserve_1', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">予備2</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.business_reserve_2}
                  onChange={(e) => handleInputChange('business_reserve_2', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">予備3</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.business_reserve_3}
                  onChange={(e) => handleInputChange('business_reserve_3', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">予備4</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.business_reserve_4}
                  onChange={(e) => handleInputChange('business_reserve_4', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
            </div>
            
            {/* Totals */}
            <div className="border-t pt-2 mt-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-100 p-2">
                  <label className="text-xs font-medium">計</label>
                  <div className="text-xs text-gray-600">{data.business_expenses_total.toFixed(1)}</div>
                </div>
                <div className="bg-gray-100 p-2">
                  <label className="text-xs font-medium">現状 計</label>
                  <div className="text-xs text-gray-600">{data.business_expenses_current_total.toFixed(1)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 p-3">
        <div className="text-xs text-yellow-800 space-y-1">
          <p>売上が上がれば経費・人件費も上がります。</p>
          <p>必要な経費を使い、不要な経費は圧縮しましょう。</p>
          <p>前期より多くの経費を入れる事、理想は105%~115%です。</p>
          <p>項目は自由に追加・修正できます。</p>
          <p>常に現状より高い数字になるよう調整してください。</p>
        </div>
      </div>
    </div>
  )
}
