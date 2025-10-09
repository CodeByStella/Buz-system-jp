import mongoose, { Schema, InferSchemaType, Model } from "mongoose";
import { NumberInputSchema } from "./numberInputSchema";

const RowSchema = new Schema({
  target: NumberInputSchema, //目標
  cumulative: NumberInputSchema, //実績|累積
});

const SummarySchema = new Schema({
  recent_sales: RowSchema, //直近売上 (Recent Sales)
  target_sales: RowSchema, //目標売上 (Target Sales)
  gross_profit: RowSchema, //売上総利益 (Gross Profit)
  gross_margin_rate: RowSchema, //粗利益率(%) (Gross Profit Margin %)
  manufacturing_cost: RowSchema, //製造原価 (Manufacturing Cost)
  fixed_cost: RowSchema, //固定費 (Fixed Cost)
  expenses: RowSchema, //(経費) (Expenses)
  promotion_cost: RowSchema, //(販促費) (Sales Promotion Cost)
  operating_profit: RowSchema, //営業利益 (Operating Profit)
  non_operating_income: RowSchema, //営業外収益 (Non-operating Income)
  non_operating_expenses: RowSchema, //営業外費用 (Non-operating Expenses)
  ordinary_profit: RowSchema, //経常利益 (Ordinary Profit)
  extraordinary_income: RowSchema, //特別利益 (Extraordinary Income)
  extraordinary_loss: RowSchema, //特別損失 (Extraordinary Loss)
  net_profit: RowSchema, //純利益 (Net Profit)
  profit_before_tax: RowSchema, //税引き前利益 (Profit Before Tax)
});

const ExpensesFixedSchema = new Schema({
  electricity_cost: RowSchema, //電力費 (Electricity Cost)
  power_cost: RowSchema, //動力費 (Power Cost)
  gas_utilities: RowSchema, //ガス光熱費 (Gas and Utilities)
  fuel_cost: RowSchema, //燃料費 (Fuel Cost)
  water_supply_cost: RowSchema, //上水道費 (Water Supply Cost)
  sewage_cost: RowSchema, //下水道費 (Sewage Cost)
  vehicle_expenses: RowSchema, //車輌費 (Vehicle Expenses)
  rent_land: RowSchema, //家賃地代 (Rent and Land Lease)
  rental_fee: RowSchema, //賃貸料 (Rental Fee)
  r_and_d: RowSchema, //研究開発費 (Research and Development Cost)
  research_expenses: RowSchema, //調査研究費 (Research and Survey Expenses)
  taxes_public_dues: RowSchema, //租税公課 (Taxes and Public Dues)
  entertainment_expenses: RowSchema, //接待交際費 (Entertainment Expenses)
  service_fees: RowSchema, //支払手数料 (Service Fees / Commissions)
  consulting_fees: RowSchema, //顧問料 (Consulting Fees)
  lease_fees: RowSchema, //リース料 (Lease Expenses)
  communication_transport: RowSchema, //通信交通費 (Communication and Transportation)
  travel_expenses: RowSchema, //出張費 (Travel Expenses)
  supplies_cost: RowSchema, //消耗品費 (Supplies Cost)
  office_supplies: RowSchema, //事務用品費 (Office Supplies)
  other_expenses: RowSchema, //その他経費 (Other Expenses)
  miscellaneous: RowSchema, //雑費 (Miscellaneous Expenses)
  decoration_cost: RowSchema, //装飾費 (Decoration Cost)
  sanitation_cost: RowSchema, //衛生費 (Sanitation Cost)
  freight_cost: RowSchema, //運賃 (Freight Cost)
  packing_cost: RowSchema, //荷造包装費 (Packing and Wrapping Cost)
  utilities_cost: RowSchema, //水道光熱費 (Utilities)
  travel_transport_cost: RowSchema, //旅費交通費 (Travel and Transportation)
  membership_fees: RowSchema, //諸会費 (Membership Fees)
  admin_expenses: RowSchema, //管理諸費 (Administrative Expenses)
  maintenance_cost: RowSchema, //保守管理費 (Maintenance Cost)
  book_expenses: RowSchema, //図書費 (Book Expenses)
  repair_cost: RowSchema, //修繕費 (Repair Cost)
  repair_maintenance: RowSchema, //修繕維持費 (Repair and Maintenance)
  insurance_premiums: RowSchema, //保険料 (Insurance Premiums)
  equipment_cost: RowSchema, //備品費 (Equipment Cost)
  donations: RowSchema, //寄付金 (Donations)
  depreciation: RowSchema, //減価償却費 (Depreciation)
  total: RowSchema, //計 (Total)
});

const ExpensesBreakDownSchema = new Schema({
  //事業費 (Business Expenses)
  business_expenses: {
    business_strategy_expense: RowSchema, //事業戦略費 (Business Strategy Expense)
    president_strategy_a: RowSchema, //社長戦略費Ａ (President’s Strategic Expense A)
    president_strategy_b: RowSchema, //社長戦略費Ｂ (President’s Strategic Expense B)
    sales_commission_agent: RowSchema, //開拓手数料(外交員) (Sales Commission [Agents])
    consumable_materials_cost: RowSchema, //消耗資材費 (Consumable Materials Cost)
    royalty: RowSchema, //ロイヤリティー (Royalty)
    outsourced_processing_cost: RowSchema, //外注加工費 (Outsourced Processing Cost)
    freight_packing_cost: RowSchema, //運賃荷造費 (Freight and Packing Cost)
    spare_1: RowSchema, //予備 (Spare 1)
    spare_2: RowSchema, //予備 (Spare 2)
    spare_3: RowSchema, //予備 (Spare 3)
    total: RowSchema, //計 (Total)
  },
  //人件費内訳 (Personnel Cost Breakdown)
  personnel_costs: {
    employee_salary: RowSchema, //社員給料 (Employee Salary)
    misc_wages: RowSchema, //雑給料 (Miscellaneous Wages)
    temp_staff_cost: RowSchema, //派遣社員費 (Temporary Staff Cost)
    retirement_allowance: RowSchema, //退職金 (Retirement Allowance)
    bonus: RowSchema, //賞与 (Bonus)
    commuting_allowance: RowSchema, //通勤手当 (Commuting Allowance)
    executive_compensation: RowSchema, //役員報酬 (Executive Compensation)
    misc_expenses: RowSchema, //諸費用 (Miscellaneous Expenses)
    recruitment_cost: RowSchema, //募集費 (Recruitment Cost)
    education_training: RowSchema, //教育研修 (Education and Training)
    training_expenses: RowSchema, //研修費 (Training Expenses)
    meeting_expenses: RowSchema, //会議費 (Meeting Expenses)
    welfare_expenses: RowSchema, //福利厚生費 (Employee Welfare Expenses)
    statutory_welfare_expenses: RowSchema, //法定福利費 (Statutory Welfare Expenses)
    spare_1: RowSchema, //予備 (Spare 1)
    spare_2: RowSchema, //予備 (Spare 2)
    spare_3: RowSchema, //予備 (Spare 3)
    spare_4: RowSchema, //予備 (Spare 4)
    spare_5: RowSchema, //予備 (Spare 5)
    total: RowSchema, //計 (Total)
  },
  //販売促進費 (Sales Promotion Expenses)
  sales_promotion: {
    tenant_fee: RowSchema, //テナント料 (Tenant Fee / Rent)
    sample_dm_cost: RowSchema, //試供品DM費 (Sample / Direct Mail Cost)
    sales_planning_cost: RowSchema, //販売企画費 (Sales Planning Cost)
    sample_dm_cost_2: RowSchema, //試供品DM費 (Sample / Direct Mail Cost)
    sales_promotion_cost: RowSchema, //販売促進費 (Sales Promotion Cost)
    advertising_expense: RowSchema, //広告宣伝費 (Advertising Expense)
    spare_1: RowSchema, //予備 (Spare 1)
    spare_2: RowSchema, //予備 (Spare 2)
    spare_3: RowSchema, //予備 (Spare 3)
    total: RowSchema, //計 (Total)
  },
});

const ManufacturingCostBreakDownSchema = new Schema({
  //事業費 (Business Expenses)
  business_expenses: {
    begin_merch_inventory: RowSchema, //期首商品棚卸高 (Beginning Merchandise Inventory)
    begin_product_inventory: RowSchema, //期首製品棚卸高 (Beginning Finished Goods Inventory)
    merch_purchases: RowSchema, //商品仕入高 (Merchandise Purchases)
    product_purchases: RowSchema, //製品仕入高 (Finished Goods Purchases)
    end_merch_inventory: RowSchema, //期末商品棚卸高 (Ending Merchandise Inventory)
    end_product_inventory: RowSchema, //期末製品棚卸高 (Ending Finished Goods Inventory)
    begin_raw_material_inventory: RowSchema, //期首原材料棚卸高 (Beginning Raw Materials Inventory)
    raw_material_purchase_1: RowSchema, //原材料仕入高１ (Raw Material Purchases 1)
    raw_material_purchase_2: RowSchema, //原材料仕入高２ (Raw Material Purchases 2)
    raw_material_purchase_3: RowSchema, //原材料仕入高３ (Raw Material Purchases 3)
    work_in_process: RowSchema, //仕掛品 (Work in Process)
    end_raw_material_inventory: RowSchema, //期末原材料棚卸高 (Ending Raw Materials Inventory)
    inventory: RowSchema, //在庫 (Inventory)
    outsourcing: RowSchema, //外注 (Outsourcing)
    outsourced_processing_cost: RowSchema, //外注加工費 (Outsourced Processing Cost)
    total: RowSchema, //計 (Total)
  },
  //人件費内訳 (Personnel Cost Breakdown)
  personnel_costs: {
    employee_salary: RowSchema, //社員給料 (Employee Salary)
    misc_salary: RowSchema, //雑給料 (Miscellaneous Salary)
    temporary_staff_cost: RowSchema, //派遣社員費 (Temporary Staff Cost)
    bonus: RowSchema, //賞与 (Bonus)
    employee_benefits: RowSchema, //福利厚生費 (Employee Benefits)
    statutory_welfare_cost: RowSchema, //法定福利費 (Statutory Welfare Cost)
    commuting_allowance: RowSchema, //通勤手当 (Commuting Allowance)
    reserve_1: RowSchema, //予備 (Reserve 1)
    reserve_2: RowSchema, //予備 (Reserve 2)
    reserve_3: RowSchema, //予備 (Reserve 3)
    other_expenses: RowSchema, //その他 (Other Expenses)
    total: RowSchema, //計 (Total)
  },
  //販売促進費 (Sales Promotion Expenses)
  sales_promotion: {
    sales_promotion_planning_cost: RowSchema, //販促企画費 (Sales Promotion Planning Cost)
    consumable_material_cost: RowSchema, //消耗資材費 (Consumable Material Cost)
    advertising_expense: RowSchema, //広告宣伝費 (Advertising Expense)
    recruitment_cost: RowSchema, //募集費 (Recruitment Cost)
    education_training_cost: RowSchema, //教育研修 (Education and Training Cost)
    reserve_1: RowSchema, //予備 (Reserve 1)
    reserve_2: RowSchema, //予備 (Reserve 2)
    reserve_3: RowSchema, //予備 (Reserve 3)
    reserve_4: RowSchema, //予備 (Reserve 4)
    total: RowSchema, //計 (Total)
  },
  //経費(固定) (Fixed Costs)
  fixed_costs: {
    electricity_cost: RowSchema, //電力費 (Electricity Cost)
    power_cost: RowSchema, //動力費 (Power Cost)
    gas_utility_cost: RowSchema, //ガス光熱費 (Gas and Utilities)
    fuel_cost: RowSchema, //燃料費 (Fuel Cost)
    water_supply_cost: RowSchema, //上水道費 (Water Supply Cost)
    sewage_cost: RowSchema, //下水道費 (Sewage Cost)
    vehicle_expense: RowSchema, //車輌費 (Vehicle Expense)
    rent_land_fee: RowSchema, //家賃地代 (Rent and Land Fee)
    rental_fee: RowSchema, //賃貸料 (Rental Fee)
    r_and_d_expense: RowSchema, //研究開発費 (Research and Development Expense)
    research_survey_expense: RowSchema, //調査研究費 (Research Survey Expense)
    tax_public_dues: RowSchema, //租税公課 (Taxes and Public Dues)
    entertainment_expense: RowSchema, //接待交際費 (Entertainment Expense)
    commission_fee: RowSchema, //支払手数料 (Commission Fee)
    consulting_fee: RowSchema, //顧問料 (Consulting Fee)
    lease_fee: RowSchema, //リース料 (Lease Fee)
    communication_transport_cost: RowSchema, //通信交通費 (Communication and Transportation)
    travel_expense: RowSchema, //出張費 (Travel Expense)
    supplies_expense: RowSchema, //消耗品費 (Supplies Expense)
    office_supplies_expense: RowSchema, //事務用品費 (Office Supplies Expense)
    other_expenses: RowSchema, //その他経費 (Other Expenses)
    miscellaneous_expense: RowSchema, //雑費 (Miscellaneous Expense)
    decoration_expense: RowSchema, //装飾費 (Decoration Expense)
    sanitation_expense: RowSchema, //衛生費 (Sanitation Expense)
    freight_cost: RowSchema, //運賃 (Freight Cost)
    packing_shipping_cost: RowSchema, //荷造包装費 (Packing and Shipping Cost)
    utilities_cost: RowSchema, //水道光熱費 (Utilities Cost)
    travel_transport_expense: RowSchema, //旅費交通費 (Travel and Transportation Expense)
    membership_fees: RowSchema, //諸会費 (Membership Fees)
    management_misc_expense: RowSchema, //管理諸費 (Management Miscellaneous Expense)
    maintenance_cost: RowSchema, //保守管理費 (Maintenance Cost)
    book_expense: RowSchema, //図書費 (Books and Publications Expense)
    repair_cost: RowSchema, //修繕費 (Repair Cost)
    maintenance_repair_cost: RowSchema, //修繕維持費 (Maintenance and Repair Cost)
    insurance_fee: RowSchema, //保険料 (Insurance Fee)
    equipment_cost: RowSchema, //備品費 (Equipment Cost)
    donation: RowSchema, //寄付金 (Donation)
    depreciation_expense: RowSchema, //減価償却費 (Depreciation Expense)
    total: RowSchema, //計 (Total)
  },
});

const ProgressResultInputSheetSchema = new Schema(
  {
    summary: SummarySchema,
    expensesFixed: ExpensesFixedSchema, //経費（固定）
    expensesBreakDown: ExpensesBreakDownSchema, //経費内訳
    manufacturingCostBreakDown: ManufacturingCostBreakDownSchema, //製造原価内訳
    finalAccountingTarget: NumberInputSchema, //決算目標
    targetSalesGrowthRate: NumberInputSchema, //目標売上成長率
  },
  {
    timestamps: true, // 作成日時・更新日時 (Created/Updated timestamps)
  }
);

export type ProgressResultInputSheetDocument = InferSchemaType<
  typeof ProgressResultInputSheetSchema
> & { _id: mongoose.Types.ObjectId };
export const ProgressResultInputSheet: Model<ProgressResultInputSheetDocument> =
  mongoose.models.ProgressResultInputSheet ||
  mongoose.model<ProgressResultInputSheetDocument>(
    "ProgressResultInputSheet",
    ProgressResultInputSheetSchema,
    "progress_result_input_sheets"
  );
