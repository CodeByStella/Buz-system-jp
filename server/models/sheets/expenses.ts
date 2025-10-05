import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const ExpensesSheetSchema = new Schema(
  {
    // 経費(固定) - Fixed Expenses
    fixedExpenses: {
      electricity: { type: Number, default: 0 }, // 電力費 (Electricity Expenses)
      power: { type: Number, default: 0 }, // 動力費 (Power Expenses)
      gasHeating: { type: Number, default: 0 }, // ガス光熱費 (Gas and Heating Expenses)
      fuel: { type: Number, default: 0 }, // 燃料費 (Fuel Expenses)
      waterSupply: { type: Number, default: 0 }, // 上水道費 (Water Supply Expenses)
      sewage: { type: Number, default: 0 }, // 下水道費 (Sewerage Expenses)
      vehicle: { type: Number, default: 0 }, // 車輛費 (Vehicle Expenses)
      rentLand: { type: Number, default: 0 }, // 家賃地代 (Rent and Land Lease)
      rentalFee: { type: Number, default: 0 }, // 賃貸料 (Lease/Rental Fees)
      researchDevelopment: { type: Number, default: 0 }, // 研究開発費 (R&D Expenses)
      researchSurvey: { type: Number, default: 0 }, // 調査研究費 (Research Expenses)
      taxesPublicDues: { type: Number, default: 0 }, // 租税公課 (Taxes and Public Dues)
      entertainment: { type: Number, default: 0 }, // 接待交際費 (Entertainment Expenses)
      paymentFees: { type: Number, default: 0 }, // 支払手数料 (Payment Fees)
      consultantFees: { type: Number, default: 0 }, // 顧問料 (Consultant Fees)
      leaseFees: { type: Number, default: 0 }, // リース料 (Lease Fees)
      communicationTransport: { type: Number, default: 0 }, // 通信交通費 (Communication & Transportation)
      travel: { type: Number, default: 0 }, // 出張費 (Travel Expenses)
      consumables: { type: Number, default: 0 }, // 消耗品費 (Consumables)
      officeSupplies: { type: Number, default: 0 }, // 事務用品費 (Office Supplies)
      otherExpenses: { type: Number, default: 0 }, // その他経費 (Other Expenses)
      miscellaneous: { type: Number, default: 0 }, // 雑費 (Miscellaneous Expenses)
      decoration: { type: Number, default: 0 }, // 装飾費 (Decoration Expenses)
      sanitation: { type: Number, default: 0 }, // 衛生費 (Sanitation Expenses)
      freight: { type: Number, default: 0 }, // 運賃 (Freight)
      packingPackaging: { type: Number, default: 0 }, // 荷造包装費 (Packing & Packaging)
      utilities: { type: Number, default: 0 }, // 水道光熱費 (Utilities - Water, Heating, Electricity)
      travelTransport: { type: Number, default: 0 }, // 旅費交通費 (Travel & Transportation)
      membershipFees: { type: Number, default: 0 }, // 諸会費 (Membership Fees)
      managementExpenses: { type: Number, default: 0 }, // 管理諸費 (Management Expenses)
      maintenanceManagement: { type: Number, default: 0 }, // 保守管理費 (Maintenance & Management)
      books: { type: Number, default: 0 }, // 図書費 (Book Expenses)
      repair: { type: Number, default: 0 }, // 修繕費 (Repair Expenses)
      repairMaintenance: { type: Number, default: 0 }, // 修繕維持費 (Repair & Maintenance)
      insurance: { type: Number, default: 0 }, // 保険料 (Insurance Premiums)
      equipment: { type: Number, default: 0 }, // 備品費 (Equipment Expenses)
      donations: { type: Number, default: 0 }, // 寄付金 (Donations)
      depreciation: { type: Number, default: 0 }, // 減価償却費 (Depreciation)
      total: { type: Number, default: 0 }, // 計 (Total)
      currentTotal: { type: Number, default: 0 }, // 現状計 (Current Total)
    },

    // 販売促進費 - Sales Promotion Expenses
    salesPromotion: {
      tenantFees: { type: Number, default: 0 }, // テナント料 (Tenant Fees)
      sampleDmCosts: { type: Number, default: 0 }, // 試供品DM費 (Sample/DM Costs)
      salesPlanning: { type: Number, default: 0 }, // 販売企画費 (Sales Planning Expenses)
      salesPromotion: { type: Number, default: 0 }, // 販売促進費    (Sales Promotion Expenses)
      advertising: { type: Number, default: 0 }, // 広告宣伝費 (Advertising & Publicity)
      reserve1: { type: Number, default: 0 }, // 予備1 (Reserve/Contingency 1)
      reserve2: { type: Number, default: 0 }, // 予備2 (Reserve/Contingency 2)
      reserve3: { type: Number, default: 0 }, // 予備3 (Reserve/Contingency 3)
      total: { type: Number, default: 0 }, // 計 (Total)
      currentTotal: { type: Number, default: 0 }, // 現状計 (Current Total)
    },

    // 人件費 - Personnel Expenses
    personnelExpenses: {
      employeeSalaries: { type: Number, default: 0 }, // 社員給料 (Employee Salaries)
      miscellaneousSalaries: { type: Number, default: 0 }, // 雑給料 (Miscellaneous Salaries)
      tempStaffing: { type: Number, default: 0 }, // 派遣社員費 (Temporary Staffing Costs)
      retirementAllowance: { type: Number, default: 0 }, // 退職金 (Retirement Allowance)
      bonuses: { type: Number, default: 0 }, // 賞与 (Bonuses)
      commutingAllowance: { type: Number, default: 0 }, // 通勤手当 (Commuting Allowance)
      executiveCompensation: { type: Number, default: 0 }, // 役員報酬 (Executive Compensation)
      miscellaneousExpenses: { type: Number, default: 0 }, // 諸費用 (Miscellaneous Expenses)
      recruitmentCosts: { type: Number, default: 0 }, // 募集費 (Recruitment Costs)
      educationTraining: { type: Number, default: 0 }, // 教育研修 (Education & Training)
      trainingExpenses: { type: Number, default: 0 }, // 研修費 (Training Expenses)
      meetingExpenses: { type: Number, default: 0 }, // 会議費 (Meeting Expenses)
      welfareExpenses: { type: Number, default: 0 }, // 福利厚生費 (Welfare Expenses)
      statutoryWelfare: { type: Number, default: 0 }, // 法定福利費 (Statutory Welfare Expenses)
      reserve1: { type: Number, default: 0 }, // 予備1 (Reserve/Contingency 1)
      reserve2: { type: Number, default: 0 }, // 予備2 (Reserve/Contingency 2)
      reserve3: { type: Number, default: 0 }, // 予備3 (Reserve/Contingency 3)
      reserve4: { type: Number, default: 0 }, // 予備4 (Reserve/Contingency 4)
      reserve5: { type: Number, default: 0 }, // 予備5 (Reserve/Contingency 5)
      total: { type: Number, default: 0 }, // 計 (Total)
      currentTotal: { type: Number, default: 0 }, // 現状計 (Current Total)
    },

    // 事業費 - Business Expenses
    businessExpenses: {
      businessStrategy: { type: Number, default: 0 }, // 事業戦略費 (Business Strategy Expenses)
      presidentStrategyA: { type: Number, default: 0 }, // 社長戦略費A (President's Strategy Expenses A)
      presidentStrategyB: { type: Number, default: 0 }, // 社長戦略費B (President's Strategy Expenses B)
      developmentFees: { type: Number, default: 0 }, // 開拓手数料(外交員) (Development Fees - Sales Reps)
      consumableMaterials: { type: Number, default: 0 }, // 消耗資材費 (Consumable Materials)
      royalties: { type: Number, default: 0 }, // ロイヤリティー (Royalties)
      outsourcingProcessing: { type: Number, default: 0 }, // 外注加工費 (Outsourcing Processing Fees)
      freightPacking: { type: Number, default: 0 }, // 運賃荷造費 (Freight & Packing)
      reserve1: { type: Number, default: 0 }, // 予備1 (Reserve/Contingency 1)
      reserve2: { type: Number, default: 0 }, // 予備2 (Reserve/Contingency 2)
      reserve3: { type: Number, default: 0 }, // 予備3 (Reserve/Contingency 3)
      total: { type: Number, default: 0 }, // 計 (Total)
      currentTotal: { type: Number, default: 0 }, // 現状計 (Current Total)
    },

    // 全体合計 (Overall Total)
    overallTotal: { type: Number, default: 0 }, // 総合計 (Total of all expenses)
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
