import mongoose, { Schema, InferSchemaType, Model } from "mongoose";
import { NumberInputSchema } from "./numberInputSchema";

const ManufacturingExpensesSheetSchema = new Schema(
  {
    // 経費(固定) - Fixed Expenses
    fixedExpenses: {
      electricity: NumberInputSchema, // 電力費 (Electricity Expenses)
      power: NumberInputSchema, // 動力費 (Power Expenses)
      gasHeating: NumberInputSchema, // ガス光熱費 (Gas and Heating Expenses)
      fuel: NumberInputSchema, // 燃料費 (Fuel Expenses)
      waterSupply: NumberInputSchema, // 上水道費 (Water Supply Expenses)
      sewage: NumberInputSchema, // 下水道費 (Sewerage Expenses)
      vehicle: NumberInputSchema, // 車輌費 (Vehicle Expenses)
      rentLand: NumberInputSchema, // 家賃地代 (Rent and Land Lease)
      rentalFee: NumberInputSchema, // 賃貸料 (Lease/Rental Fees)
      researchDevelopment: NumberInputSchema, // 研究開発費 (R&D Expenses)
      researchSurvey: NumberInputSchema, // 調査研究費 (Research and Survey Expenses)
      taxesPublicDues: NumberInputSchema, // 租税公課 (Taxes and Public Dues)
      entertainment: NumberInputSchema, // 接待交際費 (Entertainment Expenses)
      paymentFees: NumberInputSchema, // 支払手数料 (Payment Fees)
      consultantFees: NumberInputSchema, // 顧問料 (Consultant Fees)
      leaseFees: NumberInputSchema, // リース料 (Lease Fees)
      communicationTransport: NumberInputSchema, // 通信交通費 (Communication and Transportation)
      travel: NumberInputSchema, // 出張費 (Travel Expenses)
      consumables: NumberInputSchema, // 消耗品費 (Consumables Expenses)
      officeSupplies: NumberInputSchema, // 事務用品費 (Office Supplies Expenses)
      otherExpenses: NumberInputSchema, // その他経費 (Other Expenses)
      miscellaneous: NumberInputSchema, // 雑費 (Miscellaneous Expenses)
      decoration: NumberInputSchema, // 装飾費 (Decoration Expenses)
      sanitation: NumberInputSchema, // 衛生費 (Sanitation Expenses)
      freight: NumberInputSchema, // 運賃 (Freight Charges)
      packingPackaging: NumberInputSchema, // 荷造包装費 (Packing and Packaging Expenses)
      utilities: NumberInputSchema, // 水道光熱費 (Water, Heating, and Electricity Expenses)
      travelTransport: NumberInputSchema, // 旅費交通費 (Travel and Transportation Expenses)
      membershipFees: NumberInputSchema, // 諸会費 (Membership Fees)
      managementExpenses: NumberInputSchema, // 管理諸費 (Management Fees)
      maintenanceManagement: NumberInputSchema, // 保守管理費 (Maintenance and Management Fees)
      books: NumberInputSchema, // 図書費 (Book Expenses)
      repair: NumberInputSchema, // 修繕費 (Repair Expenses)
      repairMaintenance: NumberInputSchema, // 修繕維持費 (Repair and Maintenance Expenses)
      insurance: NumberInputSchema, // 保険料 (Insurance Premiums)
      equipment: NumberInputSchema, // 備品費 (Equipment Expenses)
      donations: NumberInputSchema, // 寄付金 (Donations)
      depreciation: NumberInputSchema, // 減価償却費 (Depreciation Expenses)
      total: NumberInputSchema, // 計 (Total)
      currentTotal: NumberInputSchema, // 現状計 (Current Total)
    },

    // 販売促進費 - Sales Promotion Expenses
    salesPromotion: {
      salesPromotionPlanning: NumberInputSchema, // 販促企画費 (Sales Promotion Planning Expenses)
      consumableMaterials: NumberInputSchema, // 消耗資材費 (Consumable Materials Expenses)
      advertising: NumberInputSchema, // 広告宣伝費 (Advertising and Publicity Expenses)
      recruitment: NumberInputSchema, // 募集費 (Recruitment Expenses)
      educationTraining: NumberInputSchema, // 教育研修 (Training Expenses)
      reserve1: NumberInputSchema, // 予備1 (Reserve/Contingency 1)
      reserve2: NumberInputSchema, // 予備2 (Reserve/Contingency 2)
      reserve3: NumberInputSchema, // 予備3 (Reserve/Contingency 3)
      reserve4: NumberInputSchema, // 予備4 (Reserve/Contingency 4)
      total: NumberInputSchema, // 計 (Total)
      currentTotal: NumberInputSchema, // 現状計 (Current Total)
    },

    // 人件費 - Personnel Expenses
    personnelExpenses: {
      employeeSalaries: NumberInputSchema, // 社員給料 (Employee Salaries)
      miscellaneousSalaries: NumberInputSchema, // 雑給料 (Miscellaneous Salaries)
      tempStaffing: NumberInputSchema, // 派遣社員費 (Temporary Staffing Expenses)
      bonuses: NumberInputSchema, // 賞与 (Bonus)
      welfareExpenses: NumberInputSchema, // 福利厚生費 (Welfare Expenses)
      statutoryWelfare: NumberInputSchema, // 法定福利費 (Statutory Welfare Expenses)
      commutingAllowance: NumberInputSchema, // 通勤手当 (Commuting Allowance)
      reserve1: NumberInputSchema, // 予備1 (Reserve/Contingency 1)
      reserve2: NumberInputSchema, // 予備2 (Reserve/Contingency 2)
      reserve3: NumberInputSchema, // 予備3 (Reserve/Contingency 3)
      others: NumberInputSchema, // その他 (Others)
      total: NumberInputSchema, // 計 (Total)
      currentTotal: NumberInputSchema, // 現状計 (Current Total)
    },

    // 事業費 - Business Expenses
    businessExpenses: {
      // 期首在庫 (Beginning Inventory)
      beginningGoodsInventory: NumberInputSchema, // 期首商品棚卸高 (Beginning Inventory of Goods)
      beginningProductInventory: NumberInputSchema, // 期首製品棚卸高 (Beginning Inventory of Products)
      beginningRawMaterialInventory: NumberInputSchema, // 期首原材料棚卸高 (Beginning Inventory of Raw Materials)

      // 仕入高 (Purchase Amounts)
      goodsPurchase: NumberInputSchema, // 商品仕入高 (Goods Purchase Amount)
      productPurchase: NumberInputSchema, // 製品仕入高 (Product Purchase Amount)
      rawMaterialPurchase1: NumberInputSchema, // 原材料仕入高1 (Raw Material Purchase Amount 1)
      rawMaterialPurchase2: NumberInputSchema, // 原材料仕入高2 (Raw Material Purchase Amount 2)
      rawMaterialPurchase3: NumberInputSchema, // 原材料仕入高3 (Raw Material Purchase Amount 3)

      // 期末在庫 (Ending Inventory)
      endingGoodsInventory: NumberInputSchema, // 期末商品棚卸高 (Ending Inventory of Goods)
      endingProductInventory: NumberInputSchema, // 期末製品棚卸高 (Ending Inventory of Products)
      endingRawMaterialInventory: NumberInputSchema, // 期末原材料棚卸高 (Ending Inventory of Raw Materials)

      // その他事業費 (Other Business Expenses)
      workInProgress: NumberInputSchema, // 仕掛品 (Work-in-Progress)
      inventory: NumberInputSchema, // 在庫 (Inventory)
      outsourcing: NumberInputSchema, // 外注 (Outsourcing)
      outsourcingProcessing: NumberInputSchema, // 外注加工費 (Outsourcing Processing Cost)

      total: NumberInputSchema, // 計 (Total)
      currentTotal: NumberInputSchema, // 現状計 (Current Total)
    },

    // 在庫・仕入管理 (Inventory and Purchase Management)
    inventoryManagement: {
      begin_merch_inventory: NumberInputSchema, //期首商品棚卸高 (Beginning Merchandise Inventory)
      begin_product_inventory: NumberInputSchema, //期首製品棚卸高 (Beginning Finished Goods Inventory)
      merch_purchases: NumberInputSchema, //商品仕入高 (Merchandise Purchases)
      product_purchases: NumberInputSchema, //製品仕入高 (Finished Goods Purchases)
      end_merch_inventory: NumberInputSchema, //期末商品棚卸高 (Ending Merchandise Inventory)
      end_product_inventory: NumberInputSchema, //期末製品棚卸高 (Ending Finished Goods Inventory)
      begin_raw_inventory: NumberInputSchema, //期首原材料棚卸高 (Beginning Raw Materials Inventory)
      raw_purchase_1: NumberInputSchema, //原材料仕入高１ (Raw Material Purchases 1)
      raw_purchase_2: NumberInputSchema, //原材料仕入高２ (Raw Material Purchases 2)
      raw_purchase_3: NumberInputSchema, //原材料仕入高３ (Raw Material Purchases 3)
      work_in_process: NumberInputSchema, //仕掛品 (Work in Process)
      end_raw_inventory: NumberInputSchema, //期末原材料棚卸高 (Ending Raw Materials Inventory)
      inventory: NumberInputSchema, //在庫 (Inventory)
      outsourcing: NumberInputSchema, //外注 (Outsourcing)
      outsourced_processing_cost: NumberInputSchema, //外注加工費 (Outsourced Processing Cost)
    },

    // 全体合計 (Overall Total)
    overallTotal: NumberInputSchema, // 総合計 (Total of all expenses in millions of yen)
  },
  {
    timestamps: true, // 作成日時・更新日時 (Created/Updated timestamps)
  }
);

export type ManufacturingExpensesSheetDocument = InferSchemaType<
  typeof ManufacturingExpensesSheetSchema
> & { _id: mongoose.Types.ObjectId };

export const ManufacturingExpensesSheet: Model<ManufacturingExpensesSheetDocument> =
  mongoose.models.ManufacturingExpensesSheet ||
  mongoose.model<ManufacturingExpensesSheetDocument>(
    "ManufacturingExpensesSheet",
    ManufacturingExpensesSheetSchema,
    "manufacturing_expenses_sheets"
  );
