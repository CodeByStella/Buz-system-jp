import mongoose, { Schema, InferSchemaType, Model } from "mongoose";
import { NumberInputSchema } from "./numberInputSchema";

const ExpensesSheetSchema = new Schema(
  {
    // 経費(固定) - Fixed Expenses
    fixedExpenses: {
      electricity: NumberInputSchema, // 電力費 (Electricity Expenses)
      power: NumberInputSchema, // 動力費 (Power Expenses)
      gasHeating: NumberInputSchema, // ガス光熱費 (Gas and Heating Expenses)
      fuel: NumberInputSchema, // 燃料費 (Fuel Expenses)
      waterSupply: NumberInputSchema, // 上水道費 (Water Supply Expenses)
      sewage: NumberInputSchema, // 下水道費 (Sewerage Expenses)
      vehicle: NumberInputSchema, // 車輛費 (Vehicle Expenses)
      rentLand: NumberInputSchema, // 家賃地代 (Rent and Land Lease)
      rentalFee: NumberInputSchema, // 賃貸料 (Lease/Rental Fees)
      researchDevelopment: NumberInputSchema, // 研究開発費 (R&D Expenses)
      researchSurvey: NumberInputSchema, // 調査研究費 (Research Expenses)
      taxesPublicDues: NumberInputSchema, // 租税公課 (Taxes and Public Dues)
      entertainment: NumberInputSchema, // 接待交際費 (Entertainment Expenses)
      paymentFees: NumberInputSchema, // 支払手数料 (Payment Fees)
      consultantFees: NumberInputSchema, // 顧問料 (Consultant Fees)
      leaseFees: NumberInputSchema, // リース料 (Lease Fees)
      communicationTransport: NumberInputSchema, // 通信交通費 (Communication & Transportation)
      travel: NumberInputSchema, // 出張費 (Travel Expenses)
      consumables: NumberInputSchema, // 消耗品費 (Consumables)
      officeSupplies: NumberInputSchema, // 事務用品費 (Office Supplies)
      otherExpenses: NumberInputSchema, // その他経費 (Other Expenses)
      miscellaneous: NumberInputSchema, // 雑費 (Miscellaneous Expenses)
      decoration: NumberInputSchema, // 装飾費 (Decoration Expenses)
      sanitation: NumberInputSchema, // 衛生費 (Sanitation Expenses)
      freight: NumberInputSchema, // 運賃 (Freight)
      packingPackaging: NumberInputSchema, // 荷造包装費 (Packing & Packaging)
      utilities: NumberInputSchema, // 水道光熱費 (Utilities - Water, Heating, Electricity)
      travelTransport: NumberInputSchema, // 旅費交通費 (Travel & Transportation)
      membershipFees: NumberInputSchema, // 諸会費 (Membership Fees)
      managementExpenses: NumberInputSchema, // 管理諸費 (Management Expenses)
      maintenanceManagement: NumberInputSchema, // 保守管理費 (Maintenance & Management)
      books: NumberInputSchema, // 図書費 (Book Expenses)
      repair: NumberInputSchema, // 修繕費 (Repair Expenses)
      repairMaintenance: NumberInputSchema, // 修繕維持費 (Repair & Maintenance)
      insurance: NumberInputSchema, // 保険料 (Insurance Premiums)
      equipment: NumberInputSchema, // 備品費 (Equipment Expenses)
      donations: NumberInputSchema, // 寄付金 (Donations)
      depreciation: NumberInputSchema, // 減価償却費 (Depreciation)
      total: NumberInputSchema, // 計 (Total)
      currentTotal: NumberInputSchema, // 現状計 (Current Total)
    },

    // 販売促進費 - Sales Promotion Expenses
    salesPromotion: {
      tenantFees: NumberInputSchema, // テナント料 (Tenant Fees)
      sampleDmCosts: NumberInputSchema, // 試供品DM費 (Sample/DM Costs)
      salesPlanning: NumberInputSchema, // 販売企画費 (Sales Planning Expenses)
      salesPromotion: NumberInputSchema, // 販売促進費    (Sales Promotion Expenses)
      advertising: NumberInputSchema, // 広告宣伝費 (Advertising & Publicity)
      reserve1: NumberInputSchema, // 予備1 (Reserve/Contingency 1)
      reserve2: NumberInputSchema, // 予備2 (Reserve/Contingency 2)
      reserve3: NumberInputSchema, // 予備3 (Reserve/Contingency 3)
      total: NumberInputSchema, // 計 (Total)
      currentTotal: NumberInputSchema, // 現状計 (Current Total)
    },

    // 人件費 - Personnel Expenses
    personnelExpenses: {
      employeeSalaries: NumberInputSchema, // 社員給料 (Employee Salaries)
      miscellaneousSalaries: NumberInputSchema, // 雑給料 (Miscellaneous Salaries)
      tempStaffing: NumberInputSchema, // 派遣社員費 (Temporary Staffing Costs)
      retirementAllowance: NumberInputSchema, // 退職金 (Retirement Allowance)
      bonuses: NumberInputSchema, // 賞与 (Bonuses)
      commutingAllowance: NumberInputSchema, // 通勤手当 (Commuting Allowance)
      executiveCompensation: NumberInputSchema, // 役員報酬 (Executive Compensation)
      miscellaneousExpenses: NumberInputSchema, // 諸費用 (Miscellaneous Expenses)
      recruitmentCosts: NumberInputSchema, // 募集費 (Recruitment Costs)
      educationTraining: NumberInputSchema, // 教育研修 (Education & Training)
      trainingExpenses: NumberInputSchema, // 研修費 (Training Expenses)
      meetingExpenses: NumberInputSchema, // 会議費 (Meeting Expenses)
      welfareExpenses: NumberInputSchema, // 福利厚生費 (Welfare Expenses)
      statutoryWelfare: NumberInputSchema, // 法定福利費 (Statutory Welfare Expenses)
      reserve1: NumberInputSchema, // 予備1 (Reserve/Contingency 1)
      reserve2: NumberInputSchema, // 予備2 (Reserve/Contingency 2)
      reserve3: NumberInputSchema, // 予備3 (Reserve/Contingency 3)
      reserve4: NumberInputSchema, // 予備4 (Reserve/Contingency 4)
      reserve5: NumberInputSchema, // 予備5 (Reserve/Contingency 5)
      total: NumberInputSchema, // 計 (Total)
      currentTotal: NumberInputSchema, // 現状計 (Current Total)
    },

    // 事業費 - Business Expenses
    businessExpenses: {
      businessStrategy: NumberInputSchema, // 事業戦略費 (Business Strategy Expenses)
      presidentStrategyA: NumberInputSchema, // 社長戦略費A (President's Strategy Expenses A)
      presidentStrategyB: NumberInputSchema, // 社長戦略費B (President's Strategy Expenses B)
      developmentFees: NumberInputSchema, // 開拓手数料(外交員) (Development Fees - Sales Reps)
      consumableMaterials: NumberInputSchema, // 消耗資材費 (Consumable Materials)
      royalties: NumberInputSchema, // ロイヤリティー (Royalties)
      outsourcingProcessing: NumberInputSchema, // 外注加工費 (Outsourcing Processing Fees)
      freightPacking: NumberInputSchema, // 運賃荷造費 (Freight & Packing)
      reserve1: NumberInputSchema, // 予備1 (Reserve/Contingency 1)
      reserve2: NumberInputSchema, // 予備2 (Reserve/Contingency 2)
      reserve3: NumberInputSchema, // 予備3 (Reserve/Contingency 3)
      total: NumberInputSchema, // 計 (Total)
      currentTotal: NumberInputSchema, // 現状計 (Current Total)
    },

    // 全体合計 (Overall Total)
    overallTotal: NumberInputSchema, // 総合計 (Total of all expenses)
  },
  {
    timestamps: true, // 作成日時・更新日時 (Created/Updated timestamps)
  }
);

export type ExpensesSheetDocument = InferSchemaType<
  typeof ExpensesSheetSchema
> & { _id: mongoose.Types.ObjectId };
export const ExpensesSheet: Model<ExpensesSheetDocument> =
  mongoose.models.ExpensesSheet ||
  mongoose.model<ExpensesSheetDocument>(
    "ExpensesSheet",
    ExpensesSheetSchema,
    "expenses_sheets"
  );
