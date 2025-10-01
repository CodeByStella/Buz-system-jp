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
        const f = this.getCellValue('target_f_fixed_costs')
        const m = this.getCellValue('target_m_gross_profit')
        const pq = this.getCellValue('target_pq_sales')
        const vq = this.getCellValue('target_vq_variable_costs')
        const p = this.getCellValue('unit_price_per_item')
        const q = this.getCellValue('quantity')

        results['calculated_m'] = pq - vq
        results['calculated_f'] = m - g
        results['calculated_p'] = m + vq
        results['calculated_v'] = p - m
        results['total_sales_calculated'] = p * q
        results['difference'] = (p * q) - pq
        results['target_pq_sales'] = pq
        results['target_vq_variable_costs'] = vq
        results['target_g_profit'] = g
        break
      }
      case 'profit':
        results['total_sales'] = this.getCellValue('sales_revenue')
        results['total_costs'] = this.getCellValue('material_costs') + this.getCellValue('labor_costs') + this.getCellValue('overhead_costs')
        results['gross_profit'] = this.calculateProfit('total_sales', 'total_costs')
        results['profit_margin'] = this.calculateProfitMargin('total_sales', 'gross_profit')
        break
        
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
