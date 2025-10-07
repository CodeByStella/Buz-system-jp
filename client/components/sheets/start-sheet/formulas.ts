/**
 * FORMULAS SYSTEM - Cross-Object References
 *
 * This file manages all formulas for readonly fields (type === 2).
 * Formulas can reference values from ANY data source: main, others, or summary.
 *
 * HOW TO USE:
 *
 * 1. MAIN TABLE FORMULAS (calculateFormulas):
 *    - Use getMain(key, field) to get values from main table
 *    - Use sumMain([keys], field) to sum multiple main fields
 *    - Use getOthers(key) to get values from others table
 *    - Use getSummary(key) to get values from summary table
 *
 * 2. SUMMARY TABLE FORMULAS (calculateSummaryFormulas):
 *    - Use same helpers to calculate summary values
 *    - Summary typically aggregates from main and others
 *
 * EXAMPLES:
 *
 * Simple calculation:
 *   fieldName: {
 *     incomeStatement: getMain("otherField", "incomeStatement") * 2,
 *   }
 *
 * Cross-object reference:
 *   fieldName: {
 *     incomeStatement: getMain("sales", "incomeStatement") + getOthers("extraCost"),
 *   }
 *
 * Division with safety:
 *   profitMargin: {
 *     incomeStatement: getMain("revenue", "incomeStatement") > 0
 *       ? (getMain("profit", "incomeStatement") / getMain("revenue", "incomeStatement")) * 100
 *       : 0,
 *   }
 *
 * Sum multiple fields:
 *   totalCost: {
 *     incomeStatement: sumMain(["cost1", "cost2", "cost3"], "incomeStatement"),
 *   }
 *
 * Complex formula:
 *   complexValue: {
 *     incomeStatement:
 *       (sumMain(["a", "b"], "incomeStatement") + getOthers("c")) *
 *       getMain("d", "incomeStatement") / 100 +
 *       getSummary("e"),
 *   }
 */

import {
  MainRowDataType,
  OthersRowDataType,
  SummaryRowDataType,
} from "./StartSheetCells";

// Helper type for formula results
export type FormulaResult = {
  incomeStatement?: number;
  manufacturingCostReport?: number;
};

// All data sources for formulas
export type AllDataSources = {
  main: MainRowDataType[];
  others: OthersRowDataType[];
  summary: SummaryRowDataType[];
};

// Helper function to get field value from main data
export const getMainValue = (
  data: MainRowDataType[],
  key: string,
  field: "incomeStatement" | "manufacturingCostReport"
): number => {
  const row = data.find((r) => r.key === key);
  return row?.[field]?.value || 0;
};

// Helper function to get value from others data
export const getOthersValue = (
  data: OthersRowDataType[],
  key: string
): number => {
  // Sum all items where r.parent_key === key && r.editable
  return data
    .filter((r) => r.parent_key === key && r.editable)
    .reduce((sum, r) => {
      const v = typeof r.value === "number" ? r.value : Number(r.value) || 0;
      return sum + v;
    }, 0);
};

// Helper function to get value from summary data
export const getSummaryValue = (
  data: SummaryRowDataType[],
  key: string
): number => {
  const row = data.find((r) => r.key === key);
  return row?.value || 0;
};

// Helper function to sum multiple fields from main
export const sumMainFields = (
  data: MainRowDataType[],
  keys: string[],
  field: "incomeStatement" | "manufacturingCostReport"
): number => {
  return keys.reduce((sum, key) => sum + getMainValue(data, key, field), 0);
};

// All formula definitions in one place
export const calculateFormulas = (
  dataSources: AllDataSources
): { main: Record<string, FormulaResult>; summary: Record<string, number> } => {
  const { main, others, summary } = dataSources;

  // Shorthand helpers for main data
  const getMain = (
    key: string,
    field: "incomeStatement" | "manufacturingCostReport"
  ) => getMainValue(main, key, field);

  const sumMain = (
    keys: string[],
    field: "incomeStatement" | "manufacturingCostReport"
  ) => sumMainFields(main, keys, field);

  // Shorthand helpers for other data sources
  const getOthers = (key: string) => getOthersValue(others, key);
  const getSummary = (key: string) => getSummaryValue(summary, key);

  const laborCost = {
    manufacturingCostReport:
      getMain("laborEmployeeSalary", "manufacturingCostReport") +
      getMain("laborMiscSalary", "manufacturingCostReport") +
      getMain("laborContractStaff", "manufacturingCostReport"),
  };

  const cost_of_sales_total =
    sumMain(
      [
        "employeeSalary",
        "commutingAllowance",
        "bonus",
        "retirementAllowance",
        "miscellaneousSalary",
        "temporaryStaffCost",
        "contractStaffCost",
        "variousExpenses",
        "executiveCompensation",
        "recruitmentCost",
        "educationTraining",
        "trainingCost",
        "meetingCost",
        "reserve1",
        "reserve2",
        "welfareExpenses",
        "statutoryWelfare",
        "businessStrategy",
        "presidentStrategyA",
        "presidentStrategyB",
        "salesCommission",
        "tenantFee",
        "royalty",
        "salesPromotion",
        "advertising",
        "consumableMaterials",
        "sampleDmCost",
        "outsourcedProcessingLabor",
        "freightAndPacking",
        "packagingCost",
        "advertising",
        "beginMerchInventory",
        "beginProductInventory",
        "merchPurchases",
        "productPurchases",
        "endMerchInventory",
        "endProductInventory",
        "beginRawInventory",
        "rawPurchase1",
        "rawPurchase2",
        "rawPurchase3",
        "workInProcess",
        "endRawInventory",
        "inventory",
        "outsourcingCost",
      ],
      "manufacturingCostReport"
    ) +
    laborCost.manufacturingCostReport +
    getMain("outsourcedProcessingLabor", "manufacturingCostReport") +
    sumMain(
      [
        "electricityCost",
        "powerCost",
        "gasUtilities",
        "fuelCost",
        "waterSupplyCost",
        "sewageCost",
        "vehicleCost",
        "rentLand",
        "rentalFee",
        "researchDevelopment",
        "researchSurvey",
        "taxesAndDues",
        "entertainment",
        "serviceFees",
        "advisorFees",
        "leaseFees",
        "communicationTransport",
        "travelExpenses",
        "consumableSupplies",
        "officeSupplies",
        "otherExpenses",
        "miscellaneousExpenses",
        "decorationCost",
        "sanitationCost",
        "freightCost",
        "packingCost",
        "utilitiesCost",
        "travelTransport",
        "membershipFees",
        "adminExpenses",
        "maintenanceCost",
        "bookExpenses",
        "repairCost",
        "repairMaintenance",
        "insurancePremium",
        "equipmentCost",
        "donation",
        "depreciation",
      ],
      "manufacturingCostReport"
    );

  const general_admin_expenses_total = sumMain(
    [
      `employeeSalary`,
      `commutingAllowance`,
      `bonus`,
      `retirementAllowance`,
      `miscellaneousSalary`,
      `temporaryStaffCost`,
      `contractStaffCost`,
      `variousExpenses`,
      `executiveCompensation`,
      `recruitmentCost`,
      `educationTraining`,
      `trainingCost`,
      `meetingCost`,
      `reserve1`,
      `reserve2`,
      `welfareExpenses`,
      `statutoryWelfare`,
      `businessStrategy`,
      `presidentStrategyA`,
      `presidentStrategyB`,
      `salesCommission`,
      `consumableMaterials`,
      `royalty`,
      `outsourcedProcessing`,
      `freightAndPacking`,
      `tenantFee`,
      `packagingCost`,
      `salesPlanning`,
      `sampleDmCost`,
      `salesPromotion`,
      `advertising`,
      `beginMerchInventory`,
      `beginProductInventory`,
      `merchPurchases`,
      `productPurchases`,
      `endMerchInventory`,
      `endProductInventory`,
      `beginRawInventory`,
      `rawPurchase1`,
      `rawPurchase2`,
      `rawPurchase3`,
      `workInProcess`,
      `endRawInventory`,
      `inventory`,
      `outsourcingCost`,
      `laborCost`,
      `outsourcedProcessingLabor`,
      `laborBreakdownHeader`,
      `laborEmployeeSalary`,
      `laborMiscSalary`,
      `laborContractStaff`,
      `electricityCost`,
      `powerCost`,
      `gasUtilities`,
      `fuelCost`,
      `waterSupplyCost`,
      `sewageCost`,
      `vehicleCost`,
      `rentLand`,
      `rentalFee`,
      `researchDevelopment`,
      `researchSurvey`,
      `taxesAndDues`,
      `entertainment`,
      `serviceFees`,
      `advisorFees`,
      `leaseFees`,
      `communicationTransport`,
      `travelExpenses`,
      `consumableSupplies`,
      `officeSupplies`,
      `otherExpenses`,
      `miscellaneousExpenses`,
      `decorationCost`,
      `sanitationCost`,
      `freightCost`,
      `packingCost`,
      `utilitiesCost`,
      `travelTransport`,
      `membershipFees`,
      `adminExpenses`,
      `maintenanceCost`,
      `bookExpenses`,
      `repairCost`,
      `repairMaintenance`,
      `insurancePremium`,
      `equipmentCost`,
      `donation`,
      `depreciation`,
    ],
    "incomeStatement"
  );

  const grossProfit = {
    incomeStatement:
      getMain("recentSales", "incomeStatement") - cost_of_sales_total,
  };

  const operating_profit =
    grossProfit.incomeStatement - general_admin_expenses_total;

  const profitMargin = {
    incomeStatement:
      (grossProfit.incomeStatement /
        getMain("recentSales", "incomeStatement")) *
      100,
  };

  const nonOperatingIncome = {
    incomeStatement: getOthers("non_operating_income_name"),
  };

  const nonOperatingExpenses = {
    incomeStatement: getOthers("non_operating_expenses_name"),
  };

  const ordinaryProfit = {
    incomeStatement:
      operating_profit +
      nonOperatingIncome.incomeStatement -
      nonOperatingExpenses.incomeStatement,
  };

  const extraordinaryGain = {
    incomeStatement: getOthers("extraordinary_gain_name"), // Example: reference from others
  };

  const extraordinaryLoss = {
    incomeStatement: getOthers("extraordinary_loss_name"), // Example: reference from others
  };

  const profit_before_tax =
    ordinaryProfit.incomeStatement +
    extraordinaryGain.incomeStatement -
    extraordinaryLoss.incomeStatement;

  return {
    main: {
      // 売上総利益 (Gross Profit) = Revenue - Cost
      grossProfit,

      // 利益率 (Profit Margin %) = (Gross Profit / Revenue) * 100
      profitMargin,

      // 労務費 (Labor Cost) = Sum of all labor breakdown items
      laborCost,

      // 営業外収益 (Non-operating Income) - Can reference from others data
      nonOperatingIncome,

      // 営業外費用 (Non-operating Expenses) - Can reference from others data
      nonOperatingExpenses,

      // 経常利益 (Ordinary Profit) = Operating Profit + Non-operating Income - Non-operating Expenses
      ordinaryProfit,

      // 特別利益 (Extraordinary Gain)
      extraordinaryGain,

      // 特別損失 (Extraordinary Loss)
      extraordinaryLoss,
    },
    summary: {
      cost_of_sales_total,
      general_admin_expenses_total,
      operating_profit,
      profit_before_tax,
    }
  };
};

// Apply formulas to the main and summary data
export const applyFormulas = (
  dataSources: AllDataSources
): { main: MainRowDataType[]; summary: SummaryRowDataType[] } => {
  const formulas = calculateFormulas(dataSources);

  const main = dataSources.main.map((row) => {
    const formula = formulas.main[row.key];
    if (!formula) return row;

    return {
      ...row,
      incomeStatement:
        formula.incomeStatement !== undefined
          ? { ...row.incomeStatement, value: formula.incomeStatement }
          : row.incomeStatement,
      manufacturingCostReport:
        formula.manufacturingCostReport !== undefined
          ? {
              ...row.manufacturingCostReport,
              value: formula.manufacturingCostReport,
            }
          : row.manufacturingCostReport,
    };
  });

  const summary = dataSources.summary.map((row) => {
    const formulaValue = formulas.summary[row.key];
    if (formulaValue === undefined) return row;

    return {
      ...row,
      value: formulaValue,
    };
  });

  return { main, summary };
};

