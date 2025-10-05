import React, { useState } from 'react'

// Types for the simplified model
interface TrackedValue {
  target: number
  actual: number
  cumulative: number
}

interface ProgressData {
  basicInfo: {
    period: string
    targetSalesGrowthRate: number
    lastUpdated: Date
  }
  settlementTarget: {
    recentSales: TrackedValue
    targetSales: TrackedValue
    grossProfit: TrackedValue
    grossProfitMargin: TrackedValue
    manufacturingCost: TrackedValue
    fixedCosts: TrackedValue
    operatingIncome: TrackedValue
    netIncome: TrackedValue
  }
  expenseCategories: {
    business: {
      strategy: TrackedValue
      materials: TrackedValue
      outsourcing: TrackedValue
      total: TrackedValue
    }
    personnel: {
      salaries: TrackedValue
      bonuses: TrackedValue
      welfare: TrackedValue
      statutoryWelfare: TrackedValue
      total: TrackedValue
    }
    promotion: {
      advertising: TrackedValue
      samples: TrackedValue
      planning: TrackedValue
      total: TrackedValue
    }
  }
  // ... other categories
}

// Individual field component for easy editing
const TrackedValueField: React.FC<{
  label: string
  value: TrackedValue
  onChange: (field: keyof TrackedValue, newValue: number) => void
  unit?: string
}> = ({ label, value, onChange, unit = "万円" }) => {
  return (
    <div className="grid grid-cols-4 gap-2 p-2 border rounded">
      <div className="font-medium text-sm">{label}</div>
      <div>
        <label className="block text-xs text-gray-600">目標</label>
        <input
          type="number"
          value={value.target}
          onChange={(e) => onChange('target', Number(e.target.value))}
          className="w-full px-2 py-1 text-sm border rounded"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-600">実績</label>
        <input
          type="number"
          value={value.actual}
          onChange={(e) => onChange('actual', Number(e.target.value))}
          className="w-full px-2 py-1 text-sm border rounded"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-600">累積</label>
        <input
          type="number"
          value={value.cumulative}
          onChange={(e) => onChange('cumulative', Number(e.target.value))}
          className="w-full px-2 py-1 text-sm border rounded"
        />
      </div>
    </div>
  )
}

// Category section component
const CategorySection: React.FC<{
  title: string
  data: any
  onUpdate: (field: string, key: keyof TrackedValue, value: number) => void
}> = ({ title, data, onUpdate }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 border-b pb-2">{title}</h3>
      <div className="space-y-2">
        {Object.entries(data).map(([key, value]) => (
          <TrackedValueField
            key={key}
            label={getFieldLabel(key)}
            value={value as TrackedValue}
            onChange={(field, newValue) => onUpdate(key, field, newValue)}
          />
        ))}
      </div>
    </div>
  )
}

// Helper function to get Japanese labels
const getFieldLabel = (key: string): string => {
  const labels: Record<string, string> = {
    recentSales: "直近売上",
    targetSales: "目標売上",
    grossProfit: "売上総利益",
    grossProfitMargin: "粗利益率(%)",
    manufacturingCost: "製造原価",
    fixedCosts: "固定費",
    operatingIncome: "営業利益",
    netIncome: "純利益",
    strategy: "事業戦略費",
    materials: "消耗資材費",
    outsourcing: "外注加工費",
    salaries: "社員給料",
    bonuses: "賞与",
    welfare: "福利厚生費",
    statutoryWelfare: "法定福利費",
    advertising: "広告宣伝費",
    samples: "試供品DM費",
    planning: "販売企画費",
    total: "計"
  }
  return labels[key] || key
}

// Main component
const ProgressResultInputSheet: React.FC<{
  data: ProgressData
  onSave: (data: ProgressData) => void
}> = ({ data, onSave }) => {
  const [formData, setFormData] = useState<ProgressData>(data)

  const handleUpdate = (category: string, field: string, key: keyof TrackedValue, value: number) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: {
          ...prev[category][field],
          [key]: value
        }
      }
    }))
  }

  const handleSave = () => {
    onSave(formData)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">進捗実績入力シート</h1>
        <div className="flex justify-between items-center">
          <div>
            <span className="font-medium">期間: {formData.basicInfo.period}</span>
            <span className="ml-4 font-medium">
              目標売上成長率: {formData.basicInfo.targetSalesGrowthRate}%
            </span>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            保存
          </button>
        </div>
      </div>

      {/* 決算目標 */}
      <CategorySection
        title="決算目標"
        data={formData.settlementTarget}
        onUpdate={(field, key, value) => handleUpdate('settlementTarget', field, key, value)}
      />

      {/* 経費カテゴリ */}
      <CategorySection
        title="経費カテゴリ - 事業費"
        data={formData.expenseCategories.business}
        onUpdate={(field, key, value) => handleUpdate('expenseCategories.business', field, key, value)}
      />

      <CategorySection
        title="経費カテゴリ - 人件費"
        data={formData.expenseCategories.personnel}
        onUpdate={(field, key, value) => handleUpdate('expenseCategories.personnel', field, key, value)}
      />

      <CategorySection
        title="経費カテゴリ - 販売促進費"
        data={formData.expenseCategories.promotion}
        onUpdate={(field, key, value) => handleUpdate('expenseCategories.promotion', field, key, value)}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800">総売上</h4>
          <p className="text-2xl font-bold text-blue-600">
            {formData.settlementTarget.targetSales.target}万円
          </p>
          <p className="text-sm text-gray-600">
            実績: {formData.settlementTarget.targetSales.actual}万円
          </p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800">純利益</h4>
          <p className="text-2xl font-bold text-green-600">
            {formData.settlementTarget.netIncome.target}万円
          </p>
          <p className="text-sm text-gray-600">
            実績: {formData.settlementTarget.netIncome.actual}万円
          </p>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="font-semibold text-orange-800">総経費</h4>
          <p className="text-2xl font-bold text-orange-600">
            {Object.values(formData.expenseCategories).reduce((sum, category) => 
              sum + (category.total?.target || 0), 0
            )}万円
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProgressResultInputSheet
