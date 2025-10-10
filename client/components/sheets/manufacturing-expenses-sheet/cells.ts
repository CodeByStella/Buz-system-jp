export interface ManufacturingExpensesRowDataType {
  label: string;
  value: string;
  bgcolor: string;
  readonly?: boolean;
}

export interface ManufacturingExpensesSummaryRowDataType {
  label: string;
  value: string;
  bgcolor: string;
}

const colors = {
  yellow: "bg-yellow-400",
  lightYellow: "bg-yellow-200",
  white: "bg-white",
  gray: "bg-gray-100",
  lightBlue: "bg-blue-200",
  lightGreen: "bg-green-200",
  lightPink: "bg-pink-200",
};

// 経費(固定) - Fixed Expenses
export const fixedExpensesRows: ManufacturingExpensesRowDataType[] = [
  {
    label: "電力費",
    value: "C5",
    bgcolor: colors.white,
  },
  {
    label: "動力費",
    value: "C6",
    bgcolor: colors.white,
  },
  {
    label: "ガス光熱費",
    value: "C7",
    bgcolor: colors.white,
  },
  {
    label: "燃料費",
    value: "C8",
    bgcolor: colors.white,
  },
  {
    label: "上水道費",
    value: "C9",
    bgcolor: colors.white,
  },
  {
    label: "下水道費",
    value: "C10",
    bgcolor: colors.white,
  },
  {
    label: "車輌費",
    value: "C11",
    bgcolor: colors.white,
  },
  {
    label: "家賃地代",
    value: "C12",
    bgcolor: colors.white,
  },
  {
    label: "賃貸料",
    value: "C13",
    bgcolor: colors.white,
  },
  {
    label: "研究開発費",
    value: "C14",
    bgcolor: colors.white,
  },
  {
    label: "調査研究費",
    value: "C15",
    bgcolor: colors.white,
  },
  {
    label: "租税公課",
    value: "C16",
    bgcolor: colors.white,
  },
  {
    label: "接待交際費",
    value: "C17",
    bgcolor: colors.white,
  },
  {
    label: "支払手数料",
    value: "C18",
    bgcolor: colors.white,
  },
  {
    label: "顧問料",
    value: "C19",
    bgcolor: colors.white,
  },
  {
    label: "リース料",
    value: "C20",
    bgcolor: colors.white,
  },
  {
    label: "通信交通費",
    value: "C21",
    bgcolor: colors.white,
  },
  {
    label: "出張費",
    value: "C22",
    bgcolor: colors.white,
  },
  {
    label: "消耗品費",
    value: "C23",
    bgcolor: colors.white,
  },
  {
    label: "事務用品費",
    value: "C24",
    bgcolor: colors.white,
  },
  {
    label: "その他経費",
    value: "C25",
    bgcolor: colors.white,
  },
  {
    label: "雑費",
    value: "C26",
    bgcolor: colors.white,
  },
  {
    label: "装飾費",
    value: "C27",
    bgcolor: colors.white,
  },
  {
    label: "衛生費",
    value: "C28",
    bgcolor: colors.white,
  },
  {
    label: "運賃",
    value: "C29",
    bgcolor: colors.white,
  },
  {
    label: "荷造包装費",
    value: "C30",
    bgcolor: colors.white,
  },
  {
    label: "水道光熱費",
    value: "C31",
    bgcolor: colors.white,
  },
  {
    label: "旅費交通費",
    value: "C32",
    bgcolor: colors.white,
  },
  {
    label: "諸会費",
    value: "C33",
    bgcolor: colors.white,
  },
  {
    label: "管理諸費",
    value: "C34",
    bgcolor: colors.white,
  },
  {
    label: "保守管理費",
    value: "C35",
    bgcolor: colors.white,
  },
  {
    label: "図書費",
    value: "C36",
    bgcolor: colors.white,
  },
  {
    label: "修繕費",
    value: "C37",
    bgcolor: colors.white,
  },
  {
    label: "修繕維持費",
    value: "C38",
    bgcolor: colors.white,
  },
  {
    label: "保険料",
    value: "C39",
    bgcolor: colors.white,
  },
  {
    label: "備品費",
    value: "C40",
    bgcolor: colors.white,
  },
  {
    label: "寄付金",
    value: "C41",
    bgcolor: colors.white,
  },
  {
    label: "減価償却費",
    value: "C42",
    bgcolor: colors.white,
  },
];

export const fixedExpensesSummary: ManufacturingExpensesSummaryRowDataType[] = [
  {
    label: "計",
    value: "C43",
    bgcolor: colors.lightYellow,
  },
  {
    label: "現状計",
    value: "C44",
    bgcolor: colors.lightYellow,
  },
];

// 販売促進費 - Sales Promotion Expenses
export const salesPromotionRows: ManufacturingExpensesRowDataType[] = [
  {
    label: "販促企画費",
    value: "F4",
    bgcolor: colors.white,
  },
  {
    label: "消耗資材費",
    value: "F5",
    bgcolor: colors.white,
  },
  {
    label: "広告宣伝費",
    value: "F6",
    bgcolor: colors.white,
  },
  {
    label: "募集費",
    value: "F7",
    bgcolor: colors.white,
  },
  {
    label: "教育研修",
    value: "F8",
    bgcolor: colors.white,
  },
  {
    label: "予備",
    value: "F9",
    bgcolor: colors.white,
  },
  {
    label: "予備",
    value: "F10",
    bgcolor: colors.white,
  },
  {
    label: "予備",
    value: "F11",
    bgcolor: colors.white,
  },
  {
    label: "予備",
    value: "F12",
    bgcolor: colors.white,
  },
];

export const salesPromotionSummary: ManufacturingExpensesSummaryRowDataType[] = [
  {
    label: "計",
    value: "F13",
    bgcolor: colors.lightBlue,
  },
  {
    label: "現状計",
    value: "F14",
    bgcolor: colors.lightBlue,
  },
];

// 人件費 - Personnel Expenses
export const personnelExpensesRows: ManufacturingExpensesRowDataType[] = [
  {
    label: "社員給料",
    value: "I5",
    bgcolor: colors.white,
    readonly: true,
  },
  {
    label: "雑給料",
    value: "I6",
    bgcolor: colors.white,
    readonly: true,
  },
  {
    label: "派遣社員費",
    value: "I7",
    bgcolor: colors.white,
    readonly: true,
  },
  {
    label: "賞与",
    value: "I8",
    bgcolor: colors.white,
  },
  {
    label: "福利厚生費",
    value: "I9",
    bgcolor: colors.white,
  },
  {
    label: "法定福利費",
    value: "I10",
    bgcolor: colors.white,
  },
  {
    label: "通勤手当",
    value: "I11",
    bgcolor: colors.white,
  },
  {
    label: "予備",
    value: "I12",
    bgcolor: colors.white,
  },
  {
    label: "予備",
    value: "I13",
    bgcolor: colors.white,
  },
  {
    label: "予備",
    value: "I14",
    bgcolor: colors.white,
  },
  {
    label: "その他",
    value: "I15",
    bgcolor: colors.white,
  },
];

export const personnelExpensesSummary: ManufacturingExpensesSummaryRowDataType[] = [
  {
    label: "計",
    value: "I16",
    bgcolor: colors.lightGreen,
  },
  {
    label: "現状計",
    value: "I17",
    bgcolor: colors.lightGreen,
  },
];

// 事業費 - Business Expenses
export const businessExpensesRows: ManufacturingExpensesRowDataType[] = [
  {
    label: "期首商品棚卸高",
    value: "L5",
    bgcolor: colors.white,
  },
  {
    label: "期首製品棚卸高",
    value: "L6",
    bgcolor: colors.white,
  },
  {
    label: "商品仕入高",
    value: "L7",
    bgcolor: colors.white,
  },
  {
    label: "製品仕入高",
    value: "L8",
    bgcolor: colors.white,
  },
  {
    label: "期末商品棚卸高",
    value: "L9",
    bgcolor: colors.white,
  },
  {
    label: "期末製品棚卸高",
    value: "L10",
    bgcolor: colors.white,
  },
  {
    label: "期首原材料棚卸高",
    value: "L11",
    bgcolor: colors.white,
  },
  {
    label: "原材料仕入高1",
    value: "L12",
    bgcolor: colors.white,
  },
  {
    label: "原材料仕入高2",
    value: "L13",
    bgcolor: colors.white,
  },
  {
    label: "原材料仕入高3",
    value: "L14",
    bgcolor: colors.white,
  },
  {
    label: "仕掛品",
    value: "L15",
    bgcolor: colors.white,
  },
  {
    label: "期末原材料棚卸高",
    value: "L16",
    bgcolor: colors.white,
  },
  {
    label: "在庫",
    value: "L17",
    bgcolor: colors.white,
  },
  {
    label: "外注",
    value: "L18",
    bgcolor: colors.white,
  },
  {
    label: "外注加工費",
    value: "L19",
    bgcolor: colors.white,
  },
];

export const businessExpensesSummary: ManufacturingExpensesSummaryRowDataType[] = [
  {
    label: "計",
    value: "L20",
    bgcolor: colors.lightPink,
  },
  {
    label: "現状計",
    value: "L21",
    bgcolor: colors.lightPink,
  },
];

// Grand Total
export const grandTotalRow: ManufacturingExpensesSummaryRowDataType = {
  label: "合計",
  value: "I2",
  bgcolor: colors.yellow,
};
