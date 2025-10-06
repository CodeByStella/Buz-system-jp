import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const MainRowSchema = new Schema({
  incomeStatement: { type: Number },
  manufacturingCostReport: { type: Number },
});

const OthersRowSchema = new Schema({
  title: { type: Number },
  amount: { type: Number },
});

const StartSheetSchema = new Schema({
  recentSales: MainRowSchema, // 直近売上 (Recent Sales)
  grossProfit: MainRowSchema, // 売上総利益 (Gross Profit)
  profitMargin: MainRowSchema, // 利益率(%) (Profit Margin %)
  employeeSalary: MainRowSchema, // 社員給料 (Employee Salary)
  commutingAllowance: MainRowSchema, // 通勤手当 (Commuting Allowance)
  bonus: MainRowSchema, // 賞与 (Bonus)
  retirementAllowance: MainRowSchema, // 退職金 (Retirement Allowance)
  miscellaneousSalary: MainRowSchema, // 雑給料 (Miscellaneous Salary)
  temporaryStaffCost: MainRowSchema, // 派遣社員費 (Temporary Staff Cost)
  contractStaffCost: MainRowSchema, // 契約社員費 (Contract Staff Cost)
  variousExpenses: MainRowSchema, // 諸費用 (Various Expenses)
  executiveCompensation: MainRowSchema, // 役員報酬 (Executive Compensation)
  recruitmentCost: MainRowSchema, // 募集費 (Recruitment Cost)
  educationTraining: MainRowSchema, // 教育研修 (Education and Training)
  trainingCost: MainRowSchema, // 研修費 (Training Cost)
  reserve1: MainRowSchema, // 予備 (Reserve 1)
  reserve2: MainRowSchema, // 予備 (Reserve 2)
  welfareExpenses: MainRowSchema, // 福利厚生費 (Welfare Expenses)
  statutoryWelfare: MainRowSchema, // 法定福利費 (Statutory Welfare)
  businessStrategy: MainRowSchema, // 事業戦略費 (Business Strategy Expenses)
  presidentStrategyA: MainRowSchema, // 社長戦略費Ａ (President Strategy A)
  presidentStrategyB: MainRowSchema, // 社長戦略費Ｂ (President Strategy B)
  salesCommission: MainRowSchema, // 開拓手数料(外交員) (Sales Commission [Agents])
  consumableMaterials: MainRowSchema, // 消耗資材費 (Consumable Materials Cost)
  royalty: MainRowSchema, // ロイヤリティー (Royalty)
  outsourcedProcessing: MainRowSchema, // 外注加工費 (Outsourced Processing Cost)
  freightAndPacking: MainRowSchema, // 運賃荷造費 (Freight and Packing Cost)
  tenantFee: MainRowSchema, // テナント料 (Tenant Fee)
  packagingCost: MainRowSchema, // 包装費 (Packaging Cost)
  salesPlanning: MainRowSchema, // 販売企画費 (Sales Planning)
  sampleDmCost: MainRowSchema, // 試供品ＤＭ費 (Samples / DM Cost)
  salesPromotion: MainRowSchema, // 販売促進費 (Sales Promotion Expenses)
  advertising: MainRowSchema, // 広告宣伝費 (Advertising Expenses)
  beginMerchInventory: MainRowSchema, // 期首商品棚卸高 (Beginning Merchandise Inventory)
  beginProductInventory: MainRowSchema, // 期首製品棚卸高 (Beginning Product Inventory)
  merchPurchases: MainRowSchema, // 商品仕入高 (Merchandise Purchases)
  productPurchases: MainRowSchema, // 製品仕入高 (Product Purchases)
  endMerchInventory: MainRowSchema, // 期末商品棚卸高 (Ending Merchandise Inventory)
  endProductInventory: MainRowSchema, // 期末製品棚卸高 (Ending Product Inventory)
  beginRawInventory: MainRowSchema, // 期首原材料棚卸高 (Beginning Raw Material Inventory)
  rawPurchase1: MainRowSchema, // 原材料仕入高１ (Raw Material Purchase 1)
  rawPurchase2: MainRowSchema, // 原材料仕入高２ (Raw Material Purchase 2)
  rawPurchase3: MainRowSchema, // 原材料仕入高３ (Raw Material Purchase 3)
  workInProcess: MainRowSchema, // 仕掛品 (Work in Process)
  endRawInventory: MainRowSchema, // 期末原材料棚卸高 (Ending Raw Material Inventory)
  inventory: MainRowSchema, // 在庫 (Inventory)
  outsourcingCost: MainRowSchema, // 外注費 (Outsourcing Cost)
  laborCost: MainRowSchema, // 労務費 (Labor Cost)
  outsourcedProcessingLabor: MainRowSchema, // 外注加工費 (Outsourced Processing Labor Cost)
  laborBreakdownHeader: MainRowSchema, // (労務費内訳） (Labor Cost Breakdown Header)
  laborEmployeeSalary: MainRowSchema, // 社員給料 (Employee Salary - Labor Breakdown)
  laborMiscSalary: MainRowSchema, // 雑給料 (Miscellaneous Salary - Labor Breakdown)
  laborContractStaff: MainRowSchema, // 契約社員費 (Contract Staff Cost - Labor Breakdown)
  electricityCost: MainRowSchema, // 電力費 (Electricity Cost)
  powerCost: MainRowSchema, // 動力費 (Power Cost)
  gasUtilities: MainRowSchema, // ガス光熱費 (Gas and Utilities)
  fuelCost: MainRowSchema, // 燃料費 (Fuel Cost)
  waterSupplyCost: MainRowSchema, // 上水道費 (Water Supply Cost)
  sewageCost: MainRowSchema, // 下水道費 (Sewage Cost)
  vehicleCost: MainRowSchema, // 車輌費 (Vehicle Cost)
  rentLand: MainRowSchema, // 家賃地代 (Rent / Land Lease)
  rentalFee: MainRowSchema, // 賃貸料 (Rental Fee)
  researchDevelopment: MainRowSchema, // 研究開発費 (Research and Development)
  researchSurvey: MainRowSchema, // 調査研究費 (Survey and Research)
  taxesAndDues: MainRowSchema, // 租税公課 (Taxes and Public Dues)
  entertainment: MainRowSchema, // 接待交際費 (Entertainment)
  serviceFees: MainRowSchema, // 支払手数料 (Service Fees)
  advisorFees: MainRowSchema, // 顧問料 (Advisor Fees)
  leaseFees: MainRowSchema, // リース料 (Lease Fees)
  communicationTransport: MainRowSchema, // 通信交通費 (Communication & Transport)
  travelExpenses: MainRowSchema, // 出張費 (Travel Expenses)
  consumableSupplies: MainRowSchema, // 消耗品費 (Consumable Supplies)
  officeSupplies: MainRowSchema, // 事務用品費 (Office Supplies)
  otherExpenses: MainRowSchema, // その他経費 (Other Expenses)
  miscellaneousExpenses: MainRowSchema, // 雑費 (Miscellaneous Expenses)
  decorationCost: MainRowSchema, // 装飾費 (Decoration Cost)
  sanitationCost: MainRowSchema, // 衛生費 (Sanitation Cost)
  freightCost: MainRowSchema, // 運賃 (Freight Cost)
  packingCost: MainRowSchema, // 荷造包装費 (Packing and Wrapping Cost)
  utilitiesCost: MainRowSchema, // 水道光熱費 (Utilities)
  travelTransport: MainRowSchema, // 旅費交通費 (Travel and Transportation)
  membershipFees: MainRowSchema, // 諸会費 (Membership Fees)
  adminExpenses: MainRowSchema, // 管理諸費 (Administrative Expenses)
  maintenanceCost: MainRowSchema, // 保守管理費 (Maintenance Cost)
  bookExpenses: MainRowSchema, // 図書費 (Book Expenses)
  repairCost: MainRowSchema, // 修繕費 (Repair Cost)
  repairMaintenance: MainRowSchema, // 修繕維持費 (Repair and Maintenance)
  insurancePremium: MainRowSchema, // 保険料 (Insurance Premium)
  equipmentCost: MainRowSchema, // 備品費 (Equipment Cost)
  donation: MainRowSchema, // 寄付金 (Donation)
  depreciation: MainRowSchema, // 減価償却費 (Depreciation)
  headOfficeCost: MainRowSchema, // 本社費 (Head Office Cost)
  nonOperatingIncome: MainRowSchema, // 営業外収益 (Non-operating Income)
  nonOperatingExpenses: MainRowSchema, // 営業外費用 (Non-operating Expenses)
  ordinaryProfit: MainRowSchema, // 経常利益 (Ordinary Profit)
  extraordinaryGain: MainRowSchema, // 特別利益・除却益 (Extraordinary Gain / Disposal Gain)
  extraordinaryLoss: MainRowSchema, // 特別損失・除却損 (Extraordinary Loss / Disposal Loss)

  non_operating_income_name: [OthersRowSchema], //営業外収益名称 (Name of Non-operating Income)
  securities_valuation_loss: [OthersRowSchema], //有価証券評価損 (Loss on Valuation of Securities)
  extraordinary_gain_name: [OthersRowSchema], //特別利益・除却益名称 (Name of Extraordinary Gain / Disposal Gain)
  extraordinary_loss_name: [OthersRowSchema], //特別損失・除却損名称 (Name of Extraordinary Loss / Disposal Loss)

  cost_of_sales_total: { type: Number }, //売上原価 合計 (Total Cost of Sales)
  general_admin_expenses_total: { type: Number }, //一般管理費 合計 (Total General and Administrative Expenses)
  operating_profit: { type: Number }, //営業利益 (Operating Profit)
  profit_before_tax: { type: Number }, //税引前利益 (Profit Before Tax)
}, { timestamps: true });

export type StartSheetDocument = InferSchemaType<typeof StartSheetSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const StartSheet: Model<StartSheetDocument> =
  mongoose.models.StartSheet ||
  mongoose.model<StartSheetDocument>(
    "StartSheet",
    StartSheetSchema,
    "start_sheets"
  );
