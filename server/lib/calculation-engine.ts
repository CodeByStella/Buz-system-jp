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
      case 'manufacturing-labor': {
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
      case 'manufacturing-expenses': {
        // Calculate fixed expenses total
        const fixedExpensesItems = [
          'electricity', 'power', 'gas_utilities', 'fuel', 'water_supply', 'sewerage',
          'vehicle_expenses', 'rent_land_rent', 'lease_rental_fees', 'rd_expenses',
          'survey_research_expenses', 'taxes_public_dues', 'entertainment_expenses',
          'payment_fees', 'consultant_fees', 'lease_fees', 'communication_transportation',
          'travel_expenses', 'consumables', 'office_supplies', 'other_expenses',
          'miscellaneous_expenses', 'decoration_expenses', 'sanitation_expenses',
          'freight_shipping', 'packing_expenses', 'water_utilities', 'travel_transportation',
          'membership_fees', 'management_expenses', 'maintenance_management',
          'book_expenses', 'repair_expenses', 'repair_maintenance', 'insurance_premiums',
          'equipment_expenses', 'donations', 'depreciation'
        ]
        
        let fixedTotal = 0
        fixedExpensesItems.forEach(item => {
          fixedTotal += this.getCellValue(item)
        })
        results['fixed_expenses_total'] = fixedTotal
        
        // Calculate sales promotion total
        const salesPromotionItems = [
          'sales_promotion_planning', 'consumable_materials', 'advertising_publicity',
          'recruitment_expenses', 'training_education', 'reserve_1', 'reserve_2',
          'reserve_3', 'reserve_4'
        ]
        
        let salesPromotionTotal = 0
        salesPromotionItems.forEach(item => {
          salesPromotionTotal += this.getCellValue(item)
        })
        results['sales_promotion_total'] = salesPromotionTotal
        
        // Calculate personnel total
        const personnelItems = [
          'employee_salaries', 'temporary_wages', 'temporary_staffing_fees',
          'executive_compensation', 'welfare_expenses', 'statutory_welfare_expenses',
          'personnel_reserve_1', 'personnel_reserve_2', 'personnel_reserve_3',
          'personnel_reserve_4', 'personnel_other'
        ]
        
        let personnelTotal = 0
        personnelItems.forEach(item => {
          personnelTotal += this.getCellValue(item)
        })
        results['personnel_total'] = personnelTotal
        
        // Calculate business expenses total
        const businessExpensesItems = [
          'beginning_inventory', 'purchases', 'ending_inventory', 'outsourcing_fees',
          'business_depreciation', 'raw_materials', 'outsourcing_processing_fees',
          'business_reserve_1', 'business_reserve_2', 'business_reserve_3', 'business_reserve_4'
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
      case 'cost-details': {
        // Calculate product-level totals
        let totalGrossProfit = 0
        let totalGrossProfitPerItem = 0
        let totalQuantity = 0
        let totalSales = 0
        
        // Process products (assuming products are stored as individual fields)
        for (let i = 0; i < 20; i++) {
          const grossProfitAmount = this.getCellValue(`product_${i}_gross_profit_amount`)
          const grossProfitPerItem = this.getCellValue(`product_${i}_gross_profit_per_item`)
          const quantity = this.getCellValue(`product_${i}_quantity`)
          const sales = this.getCellValue(`product_${i}_sales`)
          
          totalGrossProfit += grossProfitAmount
          totalGrossProfitPerItem += grossProfitPerItem
          totalQuantity += quantity
          totalSales += sales
        }
        
        results['total_gross_profit'] = totalGrossProfit
        results['total_gross_profit_per_item'] = totalGrossProfitPerItem
        results['total_quantity'] = totalQuantity
        results['total_sales'] = totalSales
        
        // Calculate averages
        results['average_customer_unit_price'] = totalQuantity > 0 ? totalSales / totalQuantity : 0
        results['average_gross_profit_rate'] = totalSales > 0 ? (totalGrossProfit / totalSales) * 100 : 0
        
        // Calculate deficiency amount
        const workforce = this.getCellValue('workforce')
        const targetWorkforce = 25 // From image
        results['deficiency_amount'] = workforce - targetWorkforce
        
        // Calculate profit per person
        results['profit_per_person'] = workforce > 0 ? totalGrossProfit / workforce : 0
        
        // Calculate productivity per person
        results['productivity_per_person'] = workforce > 0 ? totalSales / workforce : 0
        
        // Keep input values
        results['target_gross_profit_rate'] = this.getCellValue('target_gross_profit_rate')
        results['monthly_customers'] = this.getCellValue('monthly_customers')
        results['customer_unit_price'] = this.getCellValue('customer_unit_price')
        results['workforce'] = workforce
        results['workforce_profitability_per_person'] = this.getCellValue('workforce_profitability_per_person')
        results['workforce_productivity_per_person'] = this.getCellValue('workforce_productivity_per_person')
        
        // Keep gross profit amounts
        results['gross_profit_amount_1'] = this.getCellValue('gross_profit_amount_1')
        results['gross_profit_amount_2'] = this.getCellValue('gross_profit_amount_2')
        results['gross_profit_amount_3'] = this.getCellValue('gross_profit_amount_3')
        results['gross_profit_amount_4'] = this.getCellValue('gross_profit_amount_4')
        results['gross_profit_amount_5'] = this.getCellValue('gross_profit_amount_5')
        
        break
      }
      case 'breakeven': {
        // Current period calculations
        const currentSales = this.getCellValue('current_sales')
        const currentVariableCosts = this.getCellValue('current_variable_costs')
        const currentFixedCosts = this.getCellValue('current_fixed_costs')
        
        results['current_sales'] = currentSales
        results['current_variable_costs'] = currentVariableCosts
        results['current_fixed_costs'] = currentFixedCosts
        results['current_variable_cost_ratio'] = currentSales > 0 ? currentVariableCosts / currentSales : 0
        results['current_breakeven_point'] = currentSales > 0 && results['current_variable_cost_ratio'] < 1 
          ? currentFixedCosts / (1 - results['current_variable_cost_ratio']) 
          : 0
        
        // Next period calculations
        const nextSales = this.getCellValue('next_sales')
        const nextVariableCosts = this.getCellValue('next_variable_costs')
        const nextFixedCosts = this.getCellValue('next_fixed_costs')
        
        results['next_sales'] = nextSales
        results['next_variable_costs'] = nextVariableCosts
        results['next_fixed_costs'] = nextFixedCosts
        results['next_variable_cost_ratio'] = nextSales > 0 ? nextVariableCosts / nextSales : 0
        results['next_breakeven_point'] = nextSales > 0 && results['next_variable_cost_ratio'] < 1 
          ? nextFixedCosts / (1 - results['next_variable_cost_ratio']) 
          : 0
        
        break
      }
      case 'progress': {
        // Target values (keep as-is)
        const targetFields = ['period_month', 'target_sales_growth', 'target_direct_sales', 'target_gross_profit', 
          'target_gross_profit_rate', 'target_cost_ratio', 'target_business_expenses', 'target_personnel_expenses', 
          'target_other_expenses', 'target_sales_promotion', 'target_external_revenue', 'target_external_expenses', 
          'target_extraordinary_items', 'target_profit', 'target_tax', 'target_retained_earnings']
        
        targetFields.forEach(field => {
          results[field] = this.getCellValue(field)
        })
        
        // Actual values (keep user inputs)
        const actualFields = ['actual_direct_sales', 'actual_gross_profit', 'actual_business_expenses', 
          'actual_personnel_expenses', 'actual_other_expenses', 'actual_sales_promotion', 
          'actual_external_revenue', 'actual_external_expenses', 'actual_extraordinary_items', 
          'actual_profit', 'actual_tax', 'actual_retained_earnings']
        
        actualFields.forEach(field => {
          results[field] = this.getCellValue(field)
        })
        
        // Calculate derived fields
        const actualDirectSales = this.getCellValue('actual_direct_sales')
        const actualGrossProfit = this.getCellValue('actual_gross_profit')
        const targetDirectSales = this.getCellValue('target_direct_sales')
        const targetGrossProfit = this.getCellValue('target_gross_profit')
        const targetProfit = this.getCellValue('target_profit')
        const actualProfit = this.getCellValue('actual_profit')
        
        // Calculate actual rates
        results['actual_gross_profit_rate'] = actualDirectSales > 0 ? (actualGrossProfit / actualDirectSales) * 100 : 0
        results['actual_cost_ratio'] = actualDirectSales > 0 ? ((actualDirectSales - actualGrossProfit) / actualDirectSales) * 100 : 0
        
        // Calculate achievement rates
        results['sales_achievement_rate'] = targetDirectSales > 0 ? (actualDirectSales / targetDirectSales) * 100 : 0
        results['profit_achievement_rate'] = targetProfit > 0 ? (actualProfit / targetProfit) * 100 : 0
        
        // Calculate variances
        results['variance_direct_sales'] = actualDirectSales - targetDirectSales
        results['variance_gross_profit'] = actualGrossProfit - targetGrossProfit
        results['variance_profit'] = actualProfit - targetProfit
        
        break
      }
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
