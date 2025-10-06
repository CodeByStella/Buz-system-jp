export interface RowDataType {
    key: string;
    no: string;
    label: string;
    incomeStatement: {
      value: number;
      editable: boolean;
    },
    manufacturingCostReport: {
      value: number;
      editable: boolean;
    },
    bgcolor1: string;
    bgcolor2: string;
}

export const startSheetRows_main: RowDataType[] = [
  {
    key: "recentSales",
    no: "売上",
    label: "直近売上",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "grossProfit",
    no: "総益",
    label: "売上総利益",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "profitMargin",
    no: "益率",
    label: "利益率(%)",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "employeeSalary",
    no: "人件1",
    label: "社員給料",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "commutingAllowance",
    no: "人件2",
    label: "通勤手当",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "bonus",
    no: "人件3",
    label: "賞与",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "retirementAllowance",
    no: "人件4",
    label: "退職金",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "miscellaneousSalary",
    no: "人件5",
    label: "雑給料",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "temporaryStaffCost",
    no: "人件6",
    label: "派遣社員費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "contractStaffCost",
    no: "人件7",
    label: "契約社員費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "variousExpenses",
    no: "人件8",
    label: "諸費用",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "executiveCompensation",
    no: "人件9",
    label: "役員報酬",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "recruitmentCost",
    no: "人件10",
    label: "募集費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "educationTraining",
    no: "人件11",
    label: "教育研修",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "trainingCost",
    no: "人件12",
    label: "研修費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "meetingCost",
    no: "人件13",
    label: "会議費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "reserve1",
    no: "人件14",
    label: "予備",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "reserve2",
    no: "人件15",
    label: "予備",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "welfareExpenses",
    no: "人件16",
    label: "福利厚生費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "statutoryWelfare",
    no: "人件17",
    label: "法定福利費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "businessStrategy",
    no: "事業費1",
    label: "事業戦略費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "presidentStrategyA",
    no: "事業費2",
    label: "社長戦略費Ａ",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "presidentStrategyB",
    no: "事業費3",
    label: "社長戦略費Ｂ",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "salesCommission",
    no: "事業費4",
    label: "開拓手数料(外交員)",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "consumableMaterials",
    no: "事業費5",
    label: "消耗資材費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "royalty",
    no: "事業費6",
    label: "ロイヤリティー",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "outsourcedProcessing",
    no: "事業費7",
    label: "外注加工費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "freightAndPacking",
    no: "事業費8",
    label: "運賃荷造費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "tenantFee",
    no: "販促費1",
    label: "テナント料",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "packagingCost",
    no: "販促費2",
    label: "包装費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "salesPlanning",
    no: "販促費3",
    label: "販売企画費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "sampleDmCost",
    no: "販促費4",
    label: "試供品ＤＭ費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "salesPromotion",
    no: "販促費5",
    label: "販売促進費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "advertising",
    no: "販促費6",
    label: "広告宣伝費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "beginMerchInventory",
    no: "原価１",
    label: "期首商品棚卸高",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "beginProductInventory",
    no: "原価２",
    label: "期首製品棚卸高",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "merchPurchases",
    no: "原価３",
    label: "商品仕入高",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "productPurchases",
    no: "原価4",
    label: "製品仕入高",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "endMerchInventory",
    no: "原価5",
    label: "期末商品棚卸高",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "endProductInventory",
    no: "原価6",
    label: "期末製品棚卸高",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "beginRawInventory",
    no: "原価7",
    label: "期首原材料棚卸高",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "rawPurchase1",
    no: "原価8",
    label: "原材料仕入高１",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "rawPurchase2",
    no: "原価9",
    label: "原材料仕入高２",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "rawPurchase3",
    no: "原仕10",
    label: "原材料仕入高３",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "workInProcess",
    no: "原価１1",
    label: "仕掛品",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "endRawInventory",
    no: "原価１2",
    label: "期末原材料棚卸高",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "inventory",
    no: "原価１3",
    label: "在庫",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "outsourcingCost",
    no: "原価１４",
    label: "外注費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "laborCost",
    no: "原価１５",
    label: "労務費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "outsourcedProcessingLabor",
    no: "原価１６",
    label: "外注加工費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "laborBreakdownHeader",
    no: "労務費内訳",
    label: "(労務費内訳）",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "laborEmployeeSalary",
    no: "労務費内訳",
    label: "社員給料",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "laborMiscSalary",
    no: "労務費内訳",
    label: "雑給料",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "laborContractStaff",
    no: "労務費内訳",
    label: "契約社員費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "electricityCost",
    no: "経費１",
    label: "電力費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "powerCost",
    no: "経費２",
    label: "動力費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "gasUtilities",
    no: "経費３",
    label: "ガス光熱費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "fuelCost",
    no: "経費4",
    label: "燃料費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "waterSupplyCost",
    no: "経費5",
    label: "上水道費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "sewageCost",
    no: "経費6",
    label: "下水道費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "vehicleCost",
    no: "経費7",
    label: "車輌費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "rentLand",
    no: "経費8",
    label: "家賃地代",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "rentalFee",
    no: "経費9",
    label: "賃貸料",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "researchDevelopment",
    no: "経費１0",
    label: "研究開発費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "researchSurvey",
    no: "経費１1",
    label: "調査研究費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "taxesAndDues",
    no: "経費１2",
    label: "租税公課",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "entertainment",
    no: "経費１3",
    label: "接待交際費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "serviceFees",
    no: "経費１4",
    label: "支払手数料",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "advisorFees",
    no: "経費１5",
    label: "顧問料",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "leaseFees",
    no: "経費１6",
    label: "リース料",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "communicationTransport",
    no: "経費１7",
    label: "通信交通費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "travelExpenses",
    no: "経費１8",
    label: "出張費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "consumableSupplies",
    no: "経費１9",
    label: "消耗品費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "officeSupplies",
    no: "経費20",
    label: "事務用品費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "otherExpenses",
    no: "経費21",
    label: "その他経費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "miscellaneousExpenses",
    no: "経費22",
    label: "雑費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "decorationCost",
    no: "経費23",
    label: "装飾費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "sanitationCost",
    no: "経費24",
    label: "衛生費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "freightCost",
    no: "経費25",
    label: "運賃",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "packingCost",
    no: "経費26",
    label: "荷造包装費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "utilitiesCost",
    no: "経費27",
    label: "水道光熱費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "travelTransport",
    no: "経費28",
    label: "旅費交通費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "membershipFees",
    no: "経費29",
    label: "諸会費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "adminExpenses",
    no: "経費30",
    label: "管理諸費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "maintenanceCost",
    no: "経費3１",
    label: "保守管理費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "bookExpenses",
    no: "経費32",
    label: "図書費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "repairCost",
    no: "経費33",
    label: "修繕費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "repairMaintenance",
    no: "経費34",
    label: "修繕維持費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "insurancePremium",
    no: "経費35",
    label: "保険料",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "equipmentCost",
    no: "経費36",
    label: "備品費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "donation",
    no: "経費37",
    label: "寄付金",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "depreciation",
    no: "減償",
    label: "減価償却費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "headOfficeCost",
    no: "営00",
    label: "本社費",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "nonOperatingIncome",
    no: "営01",
    label: "営業外収益",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "nonOperatingExpenses",
    no: "営02",
    label: "営業外費用",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "ordinaryProfit",
    no: "営03",
    label: "経常利益",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "extraordinaryGain",
    no: "営04",
    label: "特別利益・除却益",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
  {
    key: "extraordinaryLoss",
    no: "営05",
    label: "特別損失・除却損",
    incomeStatement: {
      value: 0,
      editable: true,
    },
    manufacturingCostReport: {
      value: 0,
      editable: true,
    },
    bgcolor1: "",
    bgcolor2: "",
  },
];
