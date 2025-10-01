// Calculation engine for business formulas
export interface CalculationContext {
  globalParams: Record<string, number>
  userInputs: Record<string, number>
  sheet: string
}

export class CalculationEngine {
  private context: CalculationContext

  constructor(context: CalculationContext) {
    this.context = context
  }

  // Basic arithmetic operations
  sum(...values: (number | string)[]): number {
    return values.reduce<number>((acc, val) => {
      const num = typeof val === 'string' ? this.getCellValue(val) : Number(val)
      return acc + (isNaN(num) ? 0 : num)
    }, 0)
  }

  multiply(...values: (number | string)[]): number {
    return values.reduce<number>((acc, val) => {
      const num = typeof val === 'string' ? this.getCellValue(val) : Number(val)
      return acc * (isNaN(num) ? 1 : num)
    }, 1)
  }

  divide(numerator: number | string, denominator: number | string): number {
    const num = typeof numerator === 'string' ? this.getCellValue(numerator) : numerator
    const den = typeof denominator === 'string' ? this.getCellValue(denominator) : denominator
    return den !== 0 ? num / den : 0
  }

  // Business-specific calculations
  calculateProfit(sales: number | string, costs: number | string): number {
    const salesValue = typeof sales === 'string' ? this.getCellValue(sales) : sales
    const costsValue = typeof costs === 'string' ? this.getCellValue(costs) : costs
    return salesValue - costsValue
  }

  calculateProfitMargin(sales: number | string, profit: number | string): number {
    const salesValue = typeof sales === 'string' ? this.getCellValue(sales) : sales
    const profitValue = typeof profit === 'string' ? this.getCellValue(profit) : profit
    return salesValue !== 0 ? (profitValue / salesValue) * 100 : 0
  }

  calculateBreakevenPoint(fixedCosts: number | string, contributionMargin: number | string): number {
    const fixed = typeof fixedCosts === 'string' ? this.getCellValue(fixedCosts) : fixedCosts
    const margin = typeof contributionMargin === 'string' ? this.getCellValue(contributionMargin) : contributionMargin
    return margin !== 0 ? fixed / margin : 0
  }

  calculateROI(investment: number | string, returnValue: number | string): number {
    const inv = typeof investment === 'string' ? this.getCellValue(investment) : investment
    const ret = typeof returnValue === 'string' ? this.getCellValue(returnValue) : returnValue
    return inv !== 0 ? (ret / inv) * 100 : 0
  }

  // Get cell value from context
  private getCellValue(cellKey: string): number {
    // First check user inputs for this sheet
    const userValue = this.context.userInputs[cellKey]
    if (userValue !== undefined) {
      return userValue
    }

    // Then check global parameters
    const globalValue = this.context.globalParams[cellKey]
    if (globalValue !== undefined) {
      return globalValue
    }

    return 0
  }

  // Set cell value in context
  setCellValue(cellKey: string, value: number): void {
    this.context.userInputs[cellKey] = value
  }

  // Get all calculated values for a sheet
  calculateSheet(sheetName: string): Record<string, number> {
    const results: Record<string, number> = {}
    
    switch (sheetName) {
      case 'mq-current': {
        const pq = this.getCellValue('pq_sales')
        const vq = this.getCellValue('vq_variable_costs')
        const p = this.getCellValue('p_price')
        const q = this.getCellValue('q_quantity')
        const calcSales = p * q
        results['calculated_sales'] = calcSales
        results['m_gross_profit'] = pq - vq
        const f = this.getCellValue('f_fixed_costs')
        results['f_fixed_costs'] = f
        results['g_profit'] = results['m_gross_profit'] - f
        // If pq not provided, align pq to calc P*Q
        if (!pq && calcSales) {
          results['pq_sales'] = calcSales
        } else {
          results['pq_sales'] = pq
        }
        results['vq_variable_costs'] = vq
        break
      }
      case 'mq-future': {
        const g = this.getCellValue('target_g_profit')
        const pq = this.getCellValue('target_pq_sales')
        const vq = this.getCellValue('target_vq_variable_costs')
        const unitPriceP = this.getCellValue('unit_price_p')
        const quantityQ = this.getCellValue('quantity_q')
        const unitPriceV = this.getCellValue('unit_price_v')
        const quantityV = this.getCellValue('quantity_v')

        // Calculate M = P - V
        results['calculated_m'] = pq - vq
        
        // Calculate F = M - G
        results['calculated_f'] = results['calculated_m'] - g
        
        // Calculate percentages
        const totalSales = pq
        results['pq_percentage'] = totalSales > 0 ? (pq / totalSales) * 100 : 0
        results['vq_percentage'] = totalSales > 0 ? (vq / totalSales) * 100 : 0
        results['m_percentage'] = totalSales > 0 ? (results['calculated_m'] / totalSales) * 100 : 0
        results['f_percentage'] = totalSales > 0 ? (results['calculated_f'] / totalSales) * 100 : 0
        results['g_percentage'] = totalSales > 0 ? (g / totalSales) * 100 : 0
        
        // Calculate total sales from P×Q
        results['total_sales_calculated'] = unitPriceP * quantityQ
        
        // Calculate difference
        results['difference'] = pq - results['total_sales_calculated']
        
        // Keep input values
        results['target_g_profit'] = g
        results['target_pq_sales'] = pq
        results['target_vq_variable_costs'] = vq
        results['unit_price_p'] = unitPriceP
        results['quantity_q'] = quantityQ
        results['unit_price_v'] = unitPriceV
        results['quantity_v'] = quantityV
        
        // Keep target values
        results['target_value_1'] = this.getCellValue('target_value_1')
        results['target_value_2'] = this.getCellValue('target_value_2')
        results['target_value_3'] = this.getCellValue('target_value_3')
        results['target_value_4'] = this.getCellValue('target_value_4')
        results['target_value_5'] = this.getCellValue('target_value_5')
        break
      }
      case 'profit':
        results['total_sales'] = this.getCellValue('sales_revenue')
        results['total_costs'] = this.getCellValue('material_costs') + this.getCellValue('labor_costs') + this.getCellValue('overhead_costs')
        results['gross_profit'] = this.calculateProfit('total_sales', 'total_costs')
        results['profit_margin'] = this.calculateProfitMargin('total_sales', 'gross_profit')
        break
        
      case 'salary': {
        // Calculate individual totals for employees
        for (let i = 1; i <= 8; i++) {
          const unitPrice = this.getCellValue(`employee_${i}_unit_price`)
          const count = this.getCellValue(`employee_${i}_count`)
          results[`employee_${i}_total`] = unitPrice * count
        }
        
        // Calculate employee totals
        let employeeTotal = 0
        let employeeCount = 0
        for (let i = 1; i <= 8; i++) {
          employeeTotal += this.getCellValue(`employee_${i}_total`)
          employeeCount += this.getCellValue(`employee_${i}_count`)
        }
        results['employee_salary_total'] = employeeTotal
        results['employee_count'] = employeeCount
        
        // Calculate individual totals for part-time workers
        for (let i = 1; i <= 5; i++) {
          const unitPrice = this.getCellValue(`part_${i}_unit_price`)
          const count = this.getCellValue(`part_${i}_count`)
          results[`part_${i}_total`] = unitPrice * count
        }
        
        // Calculate individual totals for arubaito workers
        for (let i = 1; i <= 3; i++) {
          const unitPrice = this.getCellValue(`arubaito_${i}_unit_price`)
          const count = this.getCellValue(`arubaito_${i}_count`)
          results[`arubaito_${i}_total`] = unitPrice * count
        }
        
        // Calculate miscellaneous totals
        let miscTotal = 0
        let miscCount = 0
        for (let i = 1; i <= 5; i++) {
          miscTotal += this.getCellValue(`part_${i}_total`)
          miscCount += this.getCellValue(`part_${i}_count`)
        }
        for (let i = 1; i <= 3; i++) {
          miscTotal += this.getCellValue(`arubaito_${i}_total`)
          miscCount += this.getCellValue(`arubaito_${i}_count`)
        }
        results['misc_salary_total'] = miscTotal
        results['misc_count'] = miscCount
        
        // Calculate individual totals for dispatched workers
        for (let i = 1; i <= 6; i++) {
          const unitPrice = this.getCellValue(`dispatched_${i}_unit_price`)
          const count = this.getCellValue(`dispatched_${i}_count`)
          results[`dispatched_${i}_total`] = unitPrice * count
        }
        
        // Calculate individual totals for contract workers
        for (let i = 1; i <= 2; i++) {
          const unitPrice = this.getCellValue(`contract_${i}_unit_price`)
          const count = this.getCellValue(`contract_${i}_count`)
          results[`contract_${i}_total`] = unitPrice * count
        }
        
        // Calculate dispatched totals
        let dispatchedTotal = 0
        let dispatchedCount = 0
        for (let i = 1; i <= 6; i++) {
          dispatchedTotal += this.getCellValue(`dispatched_${i}_total`)
          dispatchedCount += this.getCellValue(`dispatched_${i}_count`)
        }
        for (let i = 1; i <= 2; i++) {
          dispatchedTotal += this.getCellValue(`contract_${i}_total`)
          dispatchedCount += this.getCellValue(`contract_${i}_count`)
        }
        results['dispatched_total'] = dispatchedTotal
        results['dispatched_count'] = dispatchedCount
        
        // Calculate income increase rate
        const futureIncome = this.getCellValue('future_avg_income')
        const currentIncome = this.getCellValue('current_avg_income')
        results['income_increase_rate'] = currentIncome > 0 ? (futureIncome / currentIncome) * 100 : 0
        
        // Keep input values
        results['future_avg_income'] = futureIncome
        results['current_avg_income'] = currentIncome
        
        // Keep current values (these would be input separately)
        results['employee_salary_current_total'] = this.getCellValue('employee_salary_current_total')
        results['employee_count_current'] = this.getCellValue('employee_count_current')
        results['misc_salary_current_total'] = this.getCellValue('misc_salary_current_total')
        results['misc_count_current'] = this.getCellValue('misc_count_current')
        results['dispatched_current_total'] = this.getCellValue('dispatched_current_total')
        results['dispatched_count_current'] = this.getCellValue('dispatched_count_current')
        break
      }
      case 'expenses': {
        // Calculate fixed expenses total
        const fixedExpensesItems = [
          'vehicle_expenses', 'rent_land_lease', 'rental_fees', 'taxes_public_dues',
          'entertainment_expenses', 'payment_fees', 'communication_transportation',
          'consumables', 'office_supplies', 'other_expenses', 'miscellaneous_expenses',
          'utilities', 'travel_transportation', 'membership_fees', 'book_expenses',
          'repair_expenses', 'insurance_premiums', 'electricity', 'power', 'gas_heating',
          'fuel', 'water_supply', 'sewerage', 'rd_expenses', 'research_expenses',
          'consultant_fees', 'lease_fees', 'travel_expenses', 'decoration_expenses',
          'sanitation_expenses', 'freight_charges', 'packing_packaging', 'management_fees',
          'maintenance_management', 'maintenance_upkeep', 'equipment_expenses',
          'donations', 'depreciation'
        ]
        
        let fixedTotal = 0
        fixedExpensesItems.forEach(item => {
          fixedTotal += this.getCellValue(item)
        })
        results['fixed_expenses_total'] = fixedTotal
        
        // Calculate sales promotion total
        const salesPromotionItems = [
          'sales_promotion_planning', 'consumable_materials', 'advertising_publicity',
          'recruitment_expenses', 'education_training', 'reserve_1', 'reserve_2',
          'reserve_3', 'reserve_4'
        ]
        
        let salesPromotionTotal = 0
        salesPromotionItems.forEach(item => {
          salesPromotionTotal += this.getCellValue(item)
        })
        results['sales_promotion_total'] = salesPromotionTotal
        
        // Calculate personnel total
        const personnelItems = [
          'employee_salaries', 'miscellaneous_salaries', 'dispatched_employee_costs',
          'executive_compensation', 'welfare_expenses', 'statutory_welfare_expenses',
          'personnel_reserve_1', 'personnel_reserve_2', 'personnel_reserve_3', 'personnel_reserve_4'
        ]
        
        let personnelTotal = 0
        personnelItems.forEach(item => {
          personnelTotal += this.getCellValue(item)
        })
        results['personnel_total'] = personnelTotal
        
        // Calculate business expenses total
        const businessExpensesItems = [
          'education_training_expenses', 'business_strategy_expenses', 'royalties',
          'planning_fees', 'business_recruitment_expenses', 'business_training_expenses',
          'meeting_expenses', 'newspaper_book_expenses', 'business_reserve_1',
          'business_reserve_2', 'business_reserve_3', 'business_reserve_4'
        ]
        
        let businessTotal = 0
        businessExpensesItems.forEach(item => {
          businessTotal += this.getCellValue(item)
        })
        results['business_expenses_total'] = businessTotal
        
        // Calculate grand total
        results['grand_total'] = fixedTotal + salesPromotionTotal + personnelTotal + businessTotal
        
        // Keep current values (these would be input separately)
        results['fixed_expenses_current_total'] = this.getCellValue('fixed_expenses_current_total')
        results['sales_promotion_current_total'] = this.getCellValue('sales_promotion_current_total')
        results['personnel_current_total'] = this.getCellValue('personnel_current_total')
        results['business_expenses_current_total'] = this.getCellValue('business_expenses_current_total')
        
        // Keep all input values
        fixedExpensesItems.forEach(item => {
          results[item] = this.getCellValue(item)
        })
        salesPromotionItems.forEach(item => {
          results[item] = this.getCellValue(item)
        })
        personnelItems.forEach(item => {
          results[item] = this.getCellValue(item)
        })
        businessExpensesItems.forEach(item => {
          results[item] = this.getCellValue(item)
        })
        break
      }
      case 'breakeven':
        results['fixed_costs'] = this.getCellValue('rent') + this.getCellValue('utilities') + this.getCellValue('salaries')
        results['variable_costs_per_unit'] = this.getCellValue('material_cost_per_unit') + this.getCellValue('labor_cost_per_unit')
        results['selling_price_per_unit'] = this.getCellValue('price_per_unit')
        results['contribution_margin'] = results['selling_price_per_unit'] - results['variable_costs_per_unit']
        results['breakeven_units'] = this.calculateBreakevenPoint('fixed_costs', 'contribution_margin')
        results['breakeven_sales'] = results['breakeven_units'] * results['selling_price_per_unit']
        break
        
      default:
        // For other sheets, return basic calculations
        Object.keys(this.context.userInputs).forEach(key => {
          if (key.startsWith(sheetName + '_')) {
            results[key] = this.getCellValue(key)
          }
        })
    }
    
    return results
  }
}

// Factory function to create calculation engine
export function createCalculationEngine(
  globalParams: Record<string, number>,
  userInputs: Record<string, number>,
  sheet: string
): CalculationEngine {
  return new CalculationEngine({
    globalParams,
    userInputs,
    sheet
  })
}
