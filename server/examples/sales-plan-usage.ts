// Example usage of SalesPlanByDepartmentSheet model
import { SalesPlanByDepartmentSheet } from '../models/sheets/sales_plan_by_department'

// Example: Creating a new sales plan
export async function createSalesPlan() {
  const salesPlan = new SalesPlanByDepartmentSheet({
    basicInfo: {
      fiscalYear: "2024年度",
      totalSalesTarget: 450000000, // 450 million yen as shown in image
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // Add custom categories (like the 〇〇 rows in the image)
    categories: [
      {
        name: "新サービスA",
        salesTarget: 0,
        description: "新しいサービスカテゴリA",
        isActive: true,
        monthlyData: {
          // All months will have default values (0) for target/actual
          september: { currentMonth: { target: 0, actual: 0, currentMonth: 0, cumulative: 0 }, cumulative: { target: 0, actual: 0, currentMonth: 0, cumulative: 0 } },
          // ... other months
        },
        annualTotals: {
          totalTarget: 0,
          totalActual: 0,
          totalCurrentMonth: 0,
          totalCumulative: 0
        }
      }
    ],

    // Construction categories with preset values from image
    constructionCategories: {
      painting: {
        salesTarget: 350.0,
        // monthlyData will be initialized with default values
        annualTotals: {
          totalTarget: 0,
          totalActual: 0,
          totalCurrentMonth: 0,
          totalCumulative: 0
        }
      },
      renovation: {
        salesTarget: 49.3,
        annualTotals: {
          totalTarget: 0,
          totalActual: 0,
          totalCurrentMonth: 0,
          totalCumulative: 0
        }
      },
      minorWork: {
        salesTarget: 5.8,
        annualTotals: {
          totalTarget: 0,
          totalActual: 0,
          totalCurrentMonth: 0,
          totalCumulative: 0
        }
      },
      sheetMetal: {
        salesTarget: 45.0,
        annualTotals: {
          totalTarget: 0,
          totalActual: 0,
          totalCurrentMonth: 0,
          totalCumulative: 0
        }
      }
    },

    otherDetails: {
      salesTarget: 0,
      annualTotals: {
        totalTarget: 0,
        totalActual: 0,
        totalCurrentMonth: 0,
        totalCumulative: 0
      }
    },

    overallTotals: {
      totalSalesTarget: 450000000,
      totalActual: 0,
      totalCurrentMonth: 0,
      totalCumulative: 0,
      monthlyTotals: {
        // All months will have default values
        september: { target: 0, actual: 0, currentMonth: 0, cumulative: 0 },
        // ... other months
      }
    }
  })

  return await salesPlan.save()
}

// Example: Updating actual sales data
export async function updateSalesData(planId: string) {
  const salesPlan = await SalesPlanByDepartmentSheet.findById(planId)
  
  if (salesPlan) {
    // Update actual sales for painting work in December
    await salesPlan.updateActualSales('construction', 'painting', 'december', 25000, 150000)
    
    // Update actual sales for renovation work in January
    await salesPlan.updateActualSales('construction', 'renovation', 'january', 12000, 45000)
    
    // Recalculate annual totals for painting category
    await salesPlan.calculateAnnualTotals('construction', 'painting')
    
    // Get summary for dashboard
    const summary = salesPlan.getSummary()
    console.log('Sales Plan Summary:', summary)
    
    return salesPlan
  }
  
  throw new Error('Sales plan not found')
}

// Example: Getting monthly data
export async function getMonthlyData(planId: string) {
  const salesPlan = await SalesPlanByDepartmentSheet.findById(planId)
  
  if (salesPlan) {
    // Get December data for painting work
    const decemberData = salesPlan.getMonthlyData('construction', 'painting', 'december')
    console.log('December Painting Data:', decemberData)
    
    return decemberData
  }
  
  return null
}

// Example: Creating a visual-friendly data structure for frontend
export async function getVisualData(planId: string) {
  const salesPlan = await SalesPlanByDepartmentSheet.findById(planId)
  
  if (!salesPlan) return null
  
  const months = ['september', 'october', 'november', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august']
  const monthNames = ['9月', '10月', '11月', '12月', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月']
  
  // Structure data for easy frontend consumption
  const visualData = {
    fiscalYear: salesPlan.basicInfo.fiscalYear,
    totalSalesTarget: salesPlan.basicInfo.totalSalesTarget,
    months: months.map((month, index) => ({
      key: month,
      name: monthNames[index],
      // Add monthly totals here
    })),
    constructionCategories: Object.keys(salesPlan.constructionCategories).map(categoryName => ({
      name: categoryName,
      salesTarget: (salesPlan.constructionCategories as any)[categoryName].salesTarget,
      monthlyData: months.map(month => ({
        month,
        data: salesPlan.getMonthlyData('construction', categoryName, month)
      }))
    })),
    customCategories: salesPlan.categories.map(category => ({
      name: category.name,
      salesTarget: category.salesTarget,
      monthlyData: months.map(month => ({
        month,
        data: salesPlan.getMonthlyData('custom', category.name, month)
      }))
    }))
  }
  
  return visualData
}
