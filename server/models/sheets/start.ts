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
  recent_sales: MainRowSchema, //直近売上 (Recent Sales)
  gross_profit: MainRowSchema, //売上総利益 (Gross Profit)
  profit_margin: MainRowSchema, //利益率(%) (Profit Margin %)
  employee_salaries: MainRowSchema, //社員給料 (Employee Salaries)
  commuting_allowance: MainRowSchema, //通勤手当 (Commuting Allowance)
  bonus: MainRowSchema, //賞与 (Bonus)
  retirement_allowance: MainRowSchema, //退職金 (Retirement Allowance)
  misc_wages: MainRowSchema, //雑給料 (Miscellaneous Wages)
  temp_staff_cost: MainRowSchema, //派遣社員費 (Temporary Staff Cost)
  contract_staff_cost: MainRowSchema, //契約社員費 (Contract Staff Cost)
  misc_expenses: MainRowSchema, //諸費用 (Miscellaneous Expenses)
  executive_compensation: MainRowSchema, //役員報酬 (Executive Compensation)
  recruitment_cost: MainRowSchema, //募集費 (Recruitment Cost)
  education_training: MainRowSchema, //教育研修 (Education and Training)
  training_expenses: MainRowSchema, //研修費 (Training Expenses)
  meeting_expenses: MainRowSchema, //会議費 (Meeting Expenses)
  books_education: MainRowSchema, //図書教育費 (Books and Educational Materials)
  newspaper_books: MainRowSchema, //新聞図書費 (Newspaper and Book Expenses)
  welfare_expenses: MainRowSchema, //福利厚生費 (Employee Welfare Expenses)
  statutory_welfare: MainRowSchema, //法定福利費 (Statutory Welfare Expenses)
  business_strategy: MainRowSchema, //事業戦略費 (Business Strategy Expenses)
  president_strategy_a: MainRowSchema, //社長戦略費Ａ (President’s Strategic Expenses A)
  president_strategy_b: MainRowSchema, //社長戦略費Ｂ (President’s Strategic Expenses B)
  sales_commission: MainRowSchema, //開拓手数料(外交員) (Sales Commission [Agents])
  tenant_fee: MainRowSchema, //テナント料 (Tenant Fee / Rent)
  royalty: MainRowSchema, //ロイヤリティー (Royalty)
  sales_promotion: MainRowSchema, //販売促進費 (Sales Promotion Expenses)
  planning_fee: MainRowSchema, //企画料 (Planning Fee)
  consumable_materials: MainRowSchema, //消耗資材費 (Consumable Materials Cost)
  samples_dm: MainRowSchema, //試供品ＤＭ費 (Samples / Direct Mail Cost)
  outsourced_processing: MainRowSchema, //外注加工費 (Outsourced Processing Cost)
  freight_packing: MainRowSchema, //運賃荷造費 (Freight and Packing Cost)
  packaging_cost: MainRowSchema, //包装費 (Packaging Cost)
  advertising: MainRowSchema, //広告宣伝費 (Advertising Expenses)
  begin_merch_inventory: MainRowSchema, //期首商品棚卸高 (Beginning Merchandise Inventory)
  begin_product_inventory: MainRowSchema, //期首製品棚卸高 (Beginning Finished Goods Inventory)
  merch_purchases: MainRowSchema, //商品仕入高 (Merchandise Purchases)
  product_purchases: MainRowSchema, //製品仕入高 (Finished Goods Purchases)
  end_merch_inventory: MainRowSchema, //期末商品棚卸高 (Ending Merchandise Inventory)
  end_product_inventory: MainRowSchema, //期末製品棚卸高 (Ending Finished Goods Inventory)
  begin_raw_inventory: MainRowSchema, //期首原材料棚卸高 (Beginning Raw Materials Inventory)
  raw_purchase_1: MainRowSchema, //原材料仕入高１ (Raw Material Purchases 1)
  raw_purchase_2: MainRowSchema, //原材料仕入高２ (Raw Material Purchases 2)
  raw_purchase_3: MainRowSchema, //原材料仕入高３ (Raw Material Purchases 3)
  work_in_process: MainRowSchema, //仕掛品 (Work in Process)
  end_raw_inventory: MainRowSchema, //期末原材料棚卸高 (Ending Raw Materials Inventory)
  inventory: MainRowSchema, //在庫 (Inventory)
  outsourcing_expenses: MainRowSchema, //外注費 (Outsourcing Expenses)
  labor_cost: MainRowSchema, //労務費 (Labor Cost)
  outsourced_processing_labor: MainRowSchema, //外注加工費 (Outsourced Processing Cost)
  labor_cost_breakdown: MainRowSchema, //(労務費内訳） (Labor Cost Breakdown)
  employee_salaries_labor: MainRowSchema, //社員給料 (Employee Salaries)
  misc_wages_labor: MainRowSchema, //雑給料 (Miscellaneous Wages)
  contract_staff_labor: MainRowSchema, //契約社員費 (Contract Staff Cost)
  electricity_cost: MainRowSchema, //電力費 (Electricity Cost)
  power_cost: MainRowSchema, //動力費 (Power Cost)
  utilities_gas: MainRowSchema, //ガス光熱費 (Gas and Utilities)
  fuel_cost: MainRowSchema, //燃料費 (Fuel Cost)
  water_supply: MainRowSchema, //上水道費 (Water Supply Cost)
  sewage_cost: MainRowSchema, //下水道費 (Sewage Cost)
  vehicle_expenses: MainRowSchema, //車輌費 (Vehicle Expenses)
  rent_land: MainRowSchema, //家賃地代 (Rent and Land Lease)
  rental_fee: MainRowSchema, //賃貸料 (Rental Fee)
  r_and_d: MainRowSchema, //研究開発費 (Research and Development Cost)
  research_survey: MainRowSchema, //調査研究費 (Research and Survey Expenses)
  taxes_public_dues: MainRowSchema, //租税公課 (Taxes and Public Dues)
  entertainment_expenses: MainRowSchema, //接待交際費 (Entertainment Expenses)
  service_fees: MainRowSchema, //支払手数料 (Service Fees / Commissions)
  consulting_fees: MainRowSchema, //顧問料 (Consulting Fees)
  lease_expenses: MainRowSchema, //リース料 (Lease Expenses)
  communication_transport: MainRowSchema, //通信交通費 (Communication and Transportation)
  travel_expenses: MainRowSchema, //出張費 (Travel Expenses)
  supplies_cost: MainRowSchema, //消耗品費 (Supplies Cost)
  office_supplies: MainRowSchema, //事務用品費 (Office Supplies)
  other_expenses: MainRowSchema, //その他経費 (Other Expenses)
  miscellaneous: MainRowSchema, //雑費 (Miscellaneous Expenses)
  decoration_cost: MainRowSchema, //装飾費 (Decoration Cost)
  sanitation_cost: MainRowSchema, //衛生費 (Sanitation Cost)
  freight_cost: MainRowSchema, //運賃 (Freight Cost)
  packing_wrapping: MainRowSchema, //荷造包装費 (Packing and Wrapping Cost)
  utilities: MainRowSchema, //水道光熱費 (Utilities)
  travel_transport: MainRowSchema, //旅費交通費 (Travel and Transportation)
  membership_fees: MainRowSchema, //諸会費 (Membership Fees)
  admin_expenses: MainRowSchema, //管理諸費 (Administrative Expenses)
  maintenance_costs: MainRowSchema, //保守管理費 (Maintenance Costs)
  book_expenses: MainRowSchema, //図書費 (Book Expenses)
  repair_cost: MainRowSchema, //修繕費 (Repair Cost)
  repair_maintenance: MainRowSchema, //修繕維持費 (Repair and Maintenance)
  insurance_premiums: MainRowSchema, //保険料 (Insurance Premiums)
  equipment_cost: MainRowSchema, //備品費 (Equipment Cost)
  donations: MainRowSchema, //寄付金 (Donations)
  depreciation: MainRowSchema, //減価償却費 (Depreciation)
  head_office_expenses: MainRowSchema, //本社費 (Head Office Expenses)
  non_operating_income: MainRowSchema, //営業外収益 (Non-operating Income)
  non_operating_expenses: MainRowSchema, //営業外費用 (Non-operating Expenses)
  ordinary_profit: MainRowSchema, //経常利益 (Ordinary Profit)
  extraordinary_gain: MainRowSchema, //特別利益・除却益 (Extraordinary Gain / Disposal Gain)
  extraordinary_loss: MainRowSchema, //特別損失・除却損 (Extraordinary Loss / Disposal Loss)

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
