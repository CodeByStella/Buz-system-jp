import { StartSheet, StartSheetDocument } from "@/models/sheets/start";

const data: Partial<StartSheetDocument> = {
  recentSales: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C6",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "=C6-G102",
      sheet: "スタート",
      absolutePath: "D6",
    },
  }, // 直近売上 (Recent Sales)
  grossProfit: {
    incomeStatement: {
      value: 0,
      formula: "=C6-G102",
      sheet: "スタート",
      absolutePath: "C7",
    },
    manufacturingCostReport: {
      sheet: "スタート",
      value: 0,
      formula: '=IFERROR(C7/C6,"")',
      absolutePath: "D7",
    },
  }, // 売上総利益 (Gross Profit)
  profitMargin: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C8",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D8",
    },
  }, // 利益率(%) (Profit Margin %)
  employeeSalary: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C12",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D12",
    },
  }, // 社員給料 (Employee Salary)
  commutingAllowance: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C13",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D13",
    },
  }, // 通勤手当 (Commuting Allowance)
  bonus: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C14",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D14",
    },
  }, // 賞与 (Bonus)
  retirementAllowance: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C15",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D15",
    },
  }, // 退職金 (Retirement Allowance)
  miscellaneousSalary: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C16",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D16",
    },
  }, // 雑給料 (Miscellaneous Salary)
  temporaryStaffCost: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C17",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D17",
    },
  }, // 派遣社員費 (Temporary Staff Cost)
  contractStaffCost: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C18",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D18",
    },
  }, // 契約社員費 (Contract Staff Cost)
  variousExpenses: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C19",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D19",
    },
  }, // 諸費用 (Various Expenses)
  executiveCompensation: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C20",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D20",
    },
  }, // 役員報酬 (Executive Compensation)
  recruitmentCost: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C21",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D21",
    },
  }, // 募集費 (Recruitment Cost)
  educationTraining: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C22",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D22",
    },
  }, // 教育研修 (Education and Training)
  trainingCost: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C23",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D23",
    },
  }, // 研修費 (Training Cost)
  conferenceCost: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C24",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D24",
    },
  }, // 会議費 (Conference Cost)
  reserve1: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C25",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D25",
    },
  }, // 予備 (Reserve 1)
  reserve2: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C26",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D26",
    },
  }, // 予備 (Reserve 2)
  welfareExpenses: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C27",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D27",
    },
  }, // 福利厚生費 (Welfare Expenses)
  statutoryWelfare: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C28",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D28",
    },
  }, // 法定福利費 (Statutory Welfare)
  businessStrategy: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C29",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D29",
    },
  }, // 事業戦略費 (Business Strategy Expenses)
  presidentStrategyA: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C30",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D30",
    },
  }, // 社長戦略費Ａ (President Strategy A)
  presidentStrategyB: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C31",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D31",
    },
  }, // 社長戦略費Ｂ (President Strategy B)
  salesCommission: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C32",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D32",
    },
  }, // 開拓手数料(外交員) (Sales Commission [Agents])
  consumableMaterials: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C33",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D33",
    },
  }, // 消耗資材費 (Consumable Materials Cost)
  royalty: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C34",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D34",
    },
  }, // ロイヤリティー (Royalty)
  outsourcedProcessing: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C35",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D35",
    },
  }, // 外注加工費 (Outsourced Processing Cost)
  freightAndPacking: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C36",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D36",
    },
  }, // 運賃荷造費 (Freight and Packing Cost)
  tenantFee: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C37",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D37",
    },
  }, // テナント料 (Tenant Fee)
  packagingCost: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C38",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D38",
    },
  }, // 包装費 (Packaging Cost)
  salesPlanning: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C39",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D39",
    },
  }, // 販売企画費 (Sales Planning)
  sampleDmCost: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C40",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D40",
    },
  }, // 試供品ＤＭ費 (Samples / DM Cost)
  salesPromotion: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C41",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D41",
    },
  }, // 販売促進費 (Sales Promotion Expenses)
  advertising: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C42",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D42",
    },
  }, // 広告宣伝費 (Advertising Expenses)
  beginMerchInventory: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C43",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D43",
    },
  }, // 期首商品棚卸高 (Beginning Merchandise Inventory)
  beginProductInventory: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C44",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D44",
    },
  }, // 期首製品棚卸高 (Beginning Product Inventory)
  merchPurchases: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C45",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D45",
    },
  }, // 商品仕入高 (Merchandise Purchases)
  productPurchases: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C46",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D46",
    },
  }, // 製品仕入高 (Product Purchases)
  endMerchInventory: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C47",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D47",
    },
  }, // 期末商品棚卸高 (Ending Merchandise Inventory)
  endProductInventory: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C48",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D48",
    },
  }, // 期末製品棚卸高 (Ending Product Inventory)
  beginRawInventory: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C49",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D49",
    },
  }, // 期首原材料棚卸高 (Beginning Raw Material Inventory)
  rawPurchase1: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C50",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D50",
    },
  }, // 原材料仕入高１ (Raw Material Purchase 1)
  rawPurchase2: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C51",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D51",
    },
  }, // 原材料仕入高２ (Raw Material Purchase 2)
  rawPurchase3: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C52",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D52",
    },
  }, // 原材料仕入高３ (Raw Material Purchase 3)
  workInProcess: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C53",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D53",
    },
  }, // 仕掛品 (Work in Process)
  endRawInventory: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C54",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D54",
    },
  }, // 期末原材料棚卸高 (Ending Raw Material Inventory)
  inventory: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C55",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D55",
    },
  }, // 在庫 (Inventory)
  outsourcingCost: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C56",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D56",
    },
  }, // 外注費 (Outsourcing Cost)
  laborCost: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C57",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "=SUM(D60:D62)",
      sheet: "スタート",
      absolutePath: "D57",
    },
  }, // 労務費 (Labor Cost)
  outsourcedProcessingLabor: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C58",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D58",
    },
  }, // 外注加工費 (Outsourced Processing Labor Cost)
  laborBreakdownHeader: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C59",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D59",
    },
  }, // (労務費内訳） (Labor Cost Breakdown Header)
  laborEmployeeSalary: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C60",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D60",
    },
  }, // 社員給料 (Employee Salary - Labor Breakdown)
  laborMiscSalary: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C61",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D61",
    },
  }, // 雑給料 (Miscellaneous Salary - Labor Breakdown)
  laborContractStaff: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C62",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D62",
    },
  }, // 契約社員費 (Contract Staff Cost - Labor Breakdown)
  electricityCost: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C63",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D63",
    },
  }, // 電力費 (Electricity Cost)
  powerCost: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C64",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D64",
    },
  }, // 動力費 (Power Cost)
  gasUtilities: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C65",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D65",
    },
  }, // ガス光熱費 (Gas and Utilities)
  fuelCost: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C66",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D66",
    },
  }, // 燃料費 (Fuel Cost)
  waterSupplyCost: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C67",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D67",
    },
  }, // 上水道費 (Water Supply Cost)
  sewageCost: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C68",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D68",
    },
  }, // 下水道費 (Sewage Cost)
  vehicleCost: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C69",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D69",
    },
  }, // 車輌費 (Vehicle Cost)
  rentLand: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C70",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D70",
    },
  }, // 家賃地代 (Rent / Land Lease)
  rentalFee: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C71",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D71",
    },
  }, // 賃貸料 (Rental Fee)
  researchDevelopment: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C72",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D72",
    },
  }, // 研究開発費 (Research and Development)
  researchSurvey: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C73",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D73",
    },
  }, // 調査研究費 (Survey and Research)
  taxesAndDues: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C74",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D74",
    },
  }, // 租税公課 (Taxes and Public Dues)
  entertainment: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C75",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D75",
    },
  }, // 接待交際費 (Entertainment)
  serviceFees: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C76",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D76",
    },
  }, // 支払手数料 (Service Fees)
  advisorFees: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C77",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D77",
    },
  }, // 顧問料 (Advisor Fees)
  leaseFees: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C78",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D78",
    },
  }, // リース料 (Lease Fees)
  communicationTransport: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C79",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D79",
    },
  }, // 通信交通費 (Communication & Transport)
  travelExpenses: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C80",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D80",
    },
  }, // 出張費 (Travel Expenses)
  consumableSupplies: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C81",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D81",
    },
  }, // 消耗品費 (Consumable Supplies)
  officeSupplies: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C82",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D82",
    },
  }, // 事務用品費 (Office Supplies)
  otherExpenses: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C83",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D83",
    },
  }, // その他経費 (Other Expenses)
  miscellaneousExpenses: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C84",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D84",
    },
  }, // 雑費 (Miscellaneous Expenses)
  decorationCost: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C85",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D85",
    },
  }, // 装飾費 (Decoration Cost)
  sanitationCost: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C86",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D86",
    },
  }, // 衛生費 (Sanitation Cost)
  freightCost: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C87",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D87",
    },
  }, // 運賃 (Freight Cost)
  packingCost: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C88",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D88",
    },
  }, // 荷造包装費 (Packing and Wrapping Cost)
  utilitiesCost: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C89",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D89",
    },
  }, // 水道光熱費 (Utilities)
  travelTransport: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C90",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D90",
    },
  }, // 旅費交通費 (Travel and Transportation)
  membershipFees: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C91",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D91",
    },
  }, // 諸会費 (Membership Fees)
  adminExpenses: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C92",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D92",
    },
  }, // 管理諸費 (Administrative Expenses)
  maintenanceCost: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C93",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D93",
    },
  }, // 保守管理費 (Maintenance Cost)
  bookExpenses: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C94",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D94",
    },
  }, // 図書費 (Book Expenses)
  repairCost: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C95",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D95",
    },
  }, // 修繕費 (Repair Cost)
  repairMaintenance: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C96",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D96",
    },
  }, // 修繕維持費 (Repair and Maintenance)
  insurancePremium: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C97",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D97",
    },
  }, // 保険料 (Insurance Premium)
  equipmentCost: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C98",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D98",
    },
  }, // 備品費 (Equipment Cost)
  donation: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C99",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D99",
    },
  }, // 寄付金 (Donation)
  depreciation: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C100",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D100",
    },
  }, // 減価償却費 (Depreciation)
  headOfficeCost: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "",
      absolutePath: "C101",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D101",
    },
  }, // 本社費 (Head Office Cost)
  nonOperatingIncome: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "=SUM(G64:G67)",
      absolutePath: "C102",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D102",
    },
  }, // 営業外収益 (Non-operating Income)
  nonOperatingExpenses: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "=SUM(G69:G72)",
      absolutePath: "C103",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D103",
    },
  }, // 営業外費用 (Non-operating Expenses)
  ordinaryProfit: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "=G105+C102-C103",
      absolutePath: "C104",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D104",
    },
  }, // 経常利益 (Ordinary Profit)
  extraordinaryGain: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "=SUM(G74:G77)",
      absolutePath: "C105",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D105",
    },
  }, // 特別利益・除却益 (Extraordinary Gain / Disposal Gain)
  extraordinaryLoss: {
    incomeStatement: {
      sheet: "スタート",
      value: 0,
      formula: "=SUM(G79:G82)",
      absolutePath: "C106",
    },
    manufacturingCostReport: {
      value: 0,
      formula: "",
      sheet: "スタート",
      absolutePath: "D106",
    },
  }, // 特別損失・除却損 (Extraordinary Loss / Disposal Loss)

  non_operating_income_name: [
    {
      title: "土地売却益",
      amount: {
        value: 0,
        formula: "",
        sheet: "スタート",
        absolutePath: "G64",
      },
    },
    {
      title: "不動産賃貸",
      amount: {
        value: 0,
        formula: "",
        sheet: "スタート",
        absolutePath: "G65",
      },
    },
    {
      title: "",
      amount: {
        value: 0,
        formula: "",
        sheet: "スタート",
        absolutePath: "G66",
      },
    },
    {
      title: "",
      amount: {
        value: 0,
        formula: "",
        sheet: "スタート",
        absolutePath: "G67",
      },
    }
  ] as any, //営業外収益名称 (Name of Non-operating Income)
  non_operating_expenses_name: [
    {
      title: "有価証券評価損",
      amount: {
        value: 0,
        formula: "",
        sheet: "スタート",
        absolutePath: "G69",
      },
    },
    {
      title: "",
      amount: {
        value: 0,
        formula: "",
        sheet: "スタート",
        absolutePath: "G70",
      },
    },
    {
      title: "",
      amount: {
        value: 0,
        formula: "",
        sheet: "スタート",
        absolutePath: "G71",
      },
    },
    {
      title: "",
      amount: {
        value: 0,
        formula: "",
        sheet: "スタート",
        absolutePath: "G72",
      },
    },
  ] as any, //有価証券評価損 (Loss on Valuation of Securities)
  extraordinary_gain_name: [
    {
      title: "土地売却益",
      amount: {
        value: 0,
        formula: "",
        sheet: "スタート",
        absolutePath: "G74",
      },
    },
    {
      title: "事業再構築補助",
      amount: {
        value: 0,
        formula: "",
        sheet: "スタート",
        absolutePath: "G75",
      },
    },
    {
      title: "",
      amount: {
        value: 0,
        formula: "",
        sheet: "スタート",
        absolutePath: "G76",
      },
    },
    {
      title: "",
      amount: {
        value: 0,
        formula: "",
        sheet: "スタート",
        absolutePath: "G77",
      },
    },
  ] as any, //特別利益・除却益名称 (Name of Extraordinary Gain / Disposal Gain)
  extraordinary_loss_name: [
    {
      title: "土地売却損",
      amount: {
        value: 0,
        formula: "",
        sheet: "スタート",
        absolutePath: "G79",
      },
    },
    {
      title: "",
      amount: {
        value: 0,
        formula: "",
        sheet: "スタート",
        absolutePath: "G80",
      },
    },
    {
      title: "",
      amount: {
        value: 0,
        formula: "",
        sheet: "スタート",
        absolutePath: "G81",
      },
    },
    {
      title: "",
      amount: {
        value: 0,
        formula: "",
        sheet: "スタート",
        absolutePath: "G82",
      },
    },
  ] as any, //特別損失・除却損名称 (Name of Extraordinary Loss / Disposal Loss)

  cost_of_sales_total: {
    sheet: "スタート",
    value: 0,
    formula: "=SUM(D12:D58)+SUM(D63:D100)",
    absolutePath: "G102",
  }, //売上原価 合計 (Total Cost of Sales)
  general_admin_expenses_total: {
    sheet: "スタート",
    value: 0,
    formula: "=SUM(C12:C100)",
    absolutePath: "G103",
  }, //一般管理費 合計 (Total General and Administrative Expenses)
  operating_profit: {
    sheet: "スタート",
    value: 0,
    formula: "=C7-G103",
    absolutePath: "G105",
  }, //営業利益 (Operating Profit)
  profit_before_tax: {
    sheet: "スタート",
    value: 0,
    formula: "=C104+C105-C106",
    absolutePath: "G106",
  }, //税引前利益 (Profit Before Tax)
};

const startSeed = async () => {
  await StartSheet.updateOne({}, { $set: data }, { upsert: true });
};
