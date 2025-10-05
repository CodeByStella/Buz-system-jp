import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const ManufacturingExpensesSheetSchema = new Schema(
  {
    // 経費(固定) - Fixed Expenses
    fixedExpenses: {
      electricity: { type: Number, default: 0 }, // 電力費 (Electricity Expenses)
      power: { type: Number, default: 0 }, // 動力費 (Power Expenses)
      gasHeating: { type: Number, default: 0 }, // ガス光熱費 (Gas and Heating Expenses)
      fuel: { type: Number, default: 0 }, // 燃料費 (Fuel Expenses)
      waterSupply: { type: Number, default: 0 }, // 上水道費 (Water Supply Expenses)
      sewage: { type: Number, default: 0 }, // 下水道費 (Sewerage Expenses)
      vehicle: { type: Number, default: 0 }, // 車輌費 (Vehicle Expenses)
      rentLand: { type: Number, default: 0 }, // 家賃地代 (Rent and Land Lease)
      rentalFee: { type: Number, default: 0 }, // 賃貸料 (Lease/Rental Fees)
      researchDevelopment: { type: Number, default: 0 }, // 研究開発費 (R&D Expenses)
      researchSurvey: { type: Number, default: 0 }, // 調査研究費 (Research and Survey Expenses)
      taxesPublicDues: { type: Number, default: 0 }, // 租税公課 (Taxes and Public Dues)
      entertainment: { type: Number, default: 0 }, // 接待交際費 (Entertainment Expenses)
      paymentFees: { type: Number, default: 0 }, // 支払手数料 (Payment Fees)
      consultantFees: { type: Number, default: 0 }, // 顧問料 (Consultant Fees)
      leaseFees: { type: Number, default: 0 }, // リース料 (Lease Fees)
      communicationTransport: { type: Number, default: 0 }, // 通信交通費 (Communication and Transportation)
      travel: { type: Number, default: 0 }, // 出張費 (Travel Expenses)
      consumables: { type: Number, default: 0 }, // 消耗品費 (Consumables Expenses)
      officeSupplies: { type: Number, default: 0 }, // 事務用品費 (Office Supplies Expenses)
      otherExpenses: { type: Number, default: 0 }, // その他経費 (Other Expenses)
      miscellaneous: { type: Number, default: 0 }, // 雑費 (Miscellaneous Expenses)
      decoration: { type: Number, default: 0 }, // 装飾費 (Decoration Expenses)
      sanitation: { type: Number, default: 0 }, // 衛生費 (Sanitation Expenses)
      freight: { type: Number, default: 0 }, // 運賃 (Freight Charges)
      packingPackaging: { type: Number, default: 0 }, // 荷造包装費 (Packing and Packaging Expenses)
      utilities: { type: Number, default: 0 }, // 水道光熱費 (Water, Heating, and Electricity Expenses)
      travelTransport: { type: Number, default: 0 }, // 旅費交通費 (Travel and Transportation Expenses)
      membershipFees: { type: Number, default: 0 }, // 諸会費 (Membership Fees)
      managementExpenses: { type: Number, default: 0 }, // 管理諸費 (Management Fees)
      maintenanceManagement: { type: Number, default: 0 }, // 保守管理費 (Maintenance and Management Fees)
      books: { type: Number, default: 0 }, // 図書費 (Book Expenses)
      repair: { type: Number, default: 0 }, // 修繕費 (Repair Expenses)
      repairMaintenance: { type: Number, default: 0 }, // 修繕維持費 (Repair and Maintenance Expenses)
      insurance: { type: Number, default: 0 }, // 保険料 (Insurance Premiums)
      equipment: { type: Number, default: 0 }, // 備品費 (Equipment Expenses)
      donations: { type: Number, default: 0 }, // 寄付金 (Donations)
      depreciation: { type: Number, default: 0 }, // 減価償却費 (Depreciation Expenses)
      total: { type: Number, default: 0 }, // 計 (Total)
      currentTotal: { type: Number, default: 0 }, // 現状計 (Current Total)
    },

    // 販売促進費 - Sales Promotion Expenses
    salesPromotion: {
      salesPromotionPlanning: { type: Number, default: 0 }, // 販促企画費 (Sales Promotion Planning Expenses)
      consumableMaterials: { type: Number, default: 0 }, // 消耗資材費 (Consumable Materials Expenses)
      advertising: { type: Number, default: 0 }, // 広告宣伝費 (Advertising and Publicity Expenses)
      recruitment: { type: Number, default: 0 }, // 募集費 (Recruitment Expenses)
      educationTraining: { type: Number, default: 0 }, // 教育研修 (Training Expenses)
      reserve1: { type: Number, default: 0 }, // 予備1 (Reserve/Contingency 1)
      reserve2: { type: Number, default: 0 }, // 予備2 (Reserve/Contingency 2)
      reserve3: { type: Number, default: 0 }, // 予備3 (Reserve/Contingency 3)
      reserve4: { type: Number, default: 0 }, // 予備4 (Reserve/Contingency 4)
      total: { type: Number, default: 0 }, // 計 (Total)
      currentTotal: { type: Number, default: 0 }, // 現状計 (Current Total)
    },

    // 人件費 - Personnel Expenses
    personnelExpenses: {
      employeeSalaries: { type: Number, default: 0 }, // 社員給料 (Employee Salaries)
      miscellaneousSalaries: { type: Number, default: 0 }, // 雑給料 (Miscellaneous Salaries)
      tempStaffing: { type: Number, default: 0 }, // 派遣社員費 (Temporary Staffing Expenses)
      bonuses: { type: Number, default: 0 }, // 賞与 (Bonus)
      welfareExpenses: { type: Number, default: 0 }, // 福利厚生費 (Welfare Expenses)
      statutoryWelfare: { type: Number, default: 0 }, // 法定福利費 (Statutory Welfare Expenses)
      commutingAllowance: { type: Number, default: 0 }, // 通勤手当 (Commuting Allowance)
      reserve1: { type: Number, default: 0 }, // 予備1 (Reserve/Contingency 1)
      reserve2: { type: Number, default: 0 }, // 予備2 (Reserve/Contingency 2)
      reserve3: { type: Number, default: 0 }, // 予備3 (Reserve/Contingency 3)
      others: { type: Number, default: 0 }, // その他 (Others)
      total: { type: Number, default: 0 }, // 計 (Total)
      currentTotal: { type: Number, default: 0 }, // 現状計 (Current Total)
    },

    // 事業費 - Business Expenses
    businessExpenses: {
      // 期首在庫 (Beginning Inventory)
      beginningGoodsInventory: { type: Number, default: 0 }, // 期首商品棚卸高 (Beginning Inventory of Goods)
      beginningProductInventory: { type: Number, default: 0 }, // 期首製品棚卸高 (Beginning Inventory of Products)
      beginningRawMaterialInventory: { type: Number, default: 0 }, // 期首原材料棚卸高 (Beginning Inventory of Raw Materials)

      // 仕入高 (Purchase Amounts)
      goodsPurchase: { type: Number, default: 0 }, // 商品仕入高 (Goods Purchase Amount)
      productPurchase: { type: Number, default: 0 }, // 製品仕入高 (Product Purchase Amount)
      rawMaterialPurchase1: { type: Number, default: 0 }, // 原材料仕入高1 (Raw Material Purchase Amount 1)
      rawMaterialPurchase2: { type: Number, default: 0 }, // 原材料仕入高2 (Raw Material Purchase Amount 2)
      rawMaterialPurchase3: { type: Number, default: 0 }, // 原材料仕入高3 (Raw Material Purchase Amount 3)

      // 期末在庫 (Ending Inventory)
      endingGoodsInventory: { type: Number, default: 0 }, // 期末商品棚卸高 (Ending Inventory of Goods)
      endingProductInventory: { type: Number, default: 0 }, // 期末製品棚卸高 (Ending Inventory of Products)
      endingRawMaterialInventory: { type: Number, default: 0 }, // 期末原材料棚卸高 (Ending Inventory of Raw Materials)

      // その他事業費 (Other Business Expenses)
      workInProgress: { type: Number, default: 0 }, // 仕掛品 (Work-in-Progress)
      inventory: { type: Number, default: 0 }, // 在庫 (Inventory)
      outsourcing: { type: Number, default: 0 }, // 外注 (Outsourcing)
      outsourcingProcessing: { type: Number, default: 0 }, // 外注加工費 (Outsourcing Processing Cost)

      total: { type: Number, default: 0 }, // 計 (Total)
      currentTotal: { type: Number, default: 0 }, // 現状計 (Current Total)
    },

    // 在庫・仕入管理 (Inventory and Purchase Management)
    inventoryManagement: {
      begin_merch_inventory: { type: Number, default: 0 }, //期首商品棚卸高 (Beginning Merchandise Inventory)
      begin_product_inventory: { type: Number, default: 0 }, //期首製品棚卸高 (Beginning Finished Goods Inventory)
      merch_purchases: { type: Number, default: 0 }, //商品仕入高 (Merchandise Purchases)
      product_purchases: { type: Number, default: 0 }, //製品仕入高 (Finished Goods Purchases)
      end_merch_inventory: { type: Number, default: 0 }, //期末商品棚卸高 (Ending Merchandise Inventory)
      end_product_inventory: { type: Number, default: 0 }, //期末製品棚卸高 (Ending Finished Goods Inventory)
      begin_raw_inventory: { type: Number, default: 0 }, //期首原材料棚卸高 (Beginning Raw Materials Inventory)
      raw_purchase_1: { type: Number, default: 0 }, //原材料仕入高１ (Raw Material Purchases 1)
      raw_purchase_2: { type: Number, default: 0 }, //原材料仕入高２ (Raw Material Purchases 2)
      raw_purchase_3: { type: Number, default: 0 }, //原材料仕入高３ (Raw Material Purchases 3)
      work_in_process: { type: Number, default: 0 }, //仕掛品 (Work in Process)
      end_raw_inventory: { type: Number, default: 0 }, //期末原材料棚卸高 (Ending Raw Materials Inventory)
      inventory: { type: Number, default: 0 }, //在庫 (Inventory)
      outsourcing: { type: Number, default: 0 }, //外注 (Outsourcing)
      outsourced_processing_cost: { type: Number, default: 0 }, //外注加工費 (Outsourced Processing Cost)
    },

    // 全体合計 (Overall Total)
    overallTotal: { type: Number, default: 0 }, // 総合計 (Total of all expenses in millions of yen)
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
