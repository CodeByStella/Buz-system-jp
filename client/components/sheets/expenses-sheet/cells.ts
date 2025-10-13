export interface ExpensesRowDataType {
  label: string;
  value: string;
  bgcolor: string;
  readonly?: boolean;
}

export interface ExpensesSummaryRowDataType {
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
export const fixedExpensesRows: ExpensesRowDataType[] = [
  {
    label: "B5",
    value: "C5",
    bgcolor: colors.white,
  },
  {
    label: "B6",
    value: "C6",
    bgcolor: colors.white,
  },
  {
    label: "B7",
    value: "C7",
    bgcolor: colors.white,
  },
  {
    label: "B8",
    value: "C8",
    bgcolor: colors.white,
  },
  {
    label: "B9",
    value: "C9",
    bgcolor: colors.white,
  },
  {
    label: "B10",
    value: "C10",
    bgcolor: colors.white,
  },
  {
    label: "B11",
    value: "C11",
    bgcolor: colors.white,
  },
  {
    label: "B12",
    value: "C12",
    bgcolor: colors.white,
  },
  {
    label: "B13",
    value: "C13",
    bgcolor: colors.white,
  },
  {
    label: "B14",
    value: "C14",
    bgcolor: colors.white,
  },
  {
    label: "B15",
    value: "C15",
    bgcolor: colors.white,
  },
  {
    label: "B16",
    value: "C16",
    bgcolor: colors.white,
  },
  {
    label: "B17",
    value: "C17",
    bgcolor: colors.white,
  },
  {
    label: "B18",
    value: "C18",
    bgcolor: colors.white,
  },
  {
    label: "B19",
    value: "C19",
    bgcolor: colors.white,
  },
  {
    label: "B20",
    value: "C20",
    bgcolor: colors.white,
  },
  {
    label: "B21",
    value: "C21",
    bgcolor: colors.white,
  },
  {
    label: "B22",
    value: "C22",
    bgcolor: colors.white,
  },
  {
    label: "B23",
    value: "C23",
    bgcolor: colors.white,
  },
  {
    label: "B24",
    value: "C24",
    bgcolor: colors.white,
  },
  {
    label: "B25",
    value: "C25",
    bgcolor: colors.white,
  },
  {
    label: "B26",
    value: "C26",
    bgcolor: colors.white,
  },
  {
    label: "B27",
    value: "C27",
    bgcolor: colors.white,
  },
  {
    label: "B28",
    value: "C28",
    bgcolor: colors.white,
  },
  {
    label: "B29",
    value: "C29",
    bgcolor: colors.white,
  },
  {
    label: "B30",
    value: "C30",
    bgcolor: colors.white,
  },
  {
    label: "B31",
    value: "C31",
    bgcolor: colors.white,
  },
  {
    label: "B32",
    value: "C32",
    bgcolor: colors.white,
  },
  {
    label: "B33",
    value: "C33",
    bgcolor: colors.white,
  },
  {
    label: "B34",
    value: "C34",
    bgcolor: colors.white,
  },
  {
    label: "B35",
    value: "C35",
    bgcolor: colors.white,
  },
  {
    label: "B36",
    value: "C36",
    bgcolor: colors.white,
  },
  {
    label: "B37",
    value: "C37",
    bgcolor: colors.white,
  },
  {
    label: "B38",
    value: "C38",
    bgcolor: colors.white,
  },
  {
    label: "B39",
    value: "C39",
    bgcolor: colors.white,
  },
  {
    label: "B40",
    value: "C40",
    bgcolor: colors.white,
  },
  {
    label: "B41",
    value: "C41",
    bgcolor: colors.white,
  },
  {
    label: "B42",
    value: "C42",
    bgcolor: colors.white,
  },
];

export const fixedExpensesSummary: ExpensesSummaryRowDataType[] = [
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
export const salesPromotionRows: ExpensesRowDataType[] = [
  {
    label: "E4",
    value: "F4",
    bgcolor: colors.white,
  },
  {
    label: "E5",
    value: "F5",
    bgcolor: colors.white,
  },
  {
    label: "E6",
    value: "F6",
    bgcolor: colors.white,
  },
  {
    label: "E7",
    value: "F7",
    bgcolor: colors.white,
  },
  {
    label: "E8",
    value: "F8",
    bgcolor: colors.white,
  },
  {
    label: "E9",
    value: "F9",
    bgcolor: colors.white,
  },
  {
    label: "E10",
    value: "F10",
    bgcolor: colors.white,
  },
  {
    label: "E11",
    value: "F11",
    bgcolor: colors.white,
  },
  {
    label: "E12",
    value: "F12",
    bgcolor: colors.white,
  },
];

export const salesPromotionSummary: ExpensesSummaryRowDataType[] = [
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
export const personnelExpensesRows: ExpensesRowDataType[] = [
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
    label: "H8",
    value: "I8",
    bgcolor: colors.white,
  },
  {
    label: "H9",
    value: "I9",
    bgcolor: colors.white,
  },
  {
    label: "H10",
    value: "I10",
    bgcolor: colors.white,
  },
  {
    label: "H11",
    value: "I11",
    bgcolor: colors.white,
  },
  {
    label: "H12",
    value: "I12",
    bgcolor: colors.white,
  },
  {
    label: "H13",
    value: "I13",
    bgcolor: colors.white,
  },
  {
    label: "H14",
    value: "I14",
    bgcolor: colors.white,
  },
  {
    label: "H15",
    value: "I15",
    bgcolor: colors.white,
  },
  {
    label: "H16",
    value: "I16",
    bgcolor: colors.white,
  },
  {
    label: "H17",
    value: "I17",
    bgcolor: colors.white,
  },
  {
    label: "H18",
    value: "I18",
    bgcolor: colors.white,
  },
  {
    label: "H19",
    value: "I19",
    bgcolor: colors.white,
  },
  {
    label: "H20",
    value: "I20",
    bgcolor: colors.white,
  },
  {
    label: "H21",
    value: "I21",
    bgcolor: colors.white,
  },
  {
    label: "H22",
    value: "I22",
    bgcolor: colors.white,
  },
  {
    label: "H23",
    value: "I23",
    bgcolor: colors.white,
  },
];

export const personnelExpensesSummary: ExpensesSummaryRowDataType[] = [
  {
    label: "計",
    value: "I24",
    bgcolor: colors.lightGreen,
  },
  {
    label: "現状計",
    value: "I25",
    bgcolor: colors.lightGreen,
  },
];

// 事業費 - Business Expenses
export const businessExpensesRows: ExpensesRowDataType[] = [
  {
    label: "K5",
    value: "L5",
    bgcolor: colors.white,
  },
  {
    label: "K6",
    value: "L6",
    bgcolor: colors.white,
  },
  {
    label: "K7",
    value: "L7",
    bgcolor: colors.white,
  },
  {
    label: "K8",
    value: "L8",
    bgcolor: colors.white,
  },
  {
    label: "K9",
    value: "L9",
    bgcolor: colors.white,
  },
  {
    label: "K10",
    value: "L10",
    bgcolor: colors.white,
  },
  {
    label: "K11",
    value: "L11",
    bgcolor: colors.white,
  },
  {
    label: "K12",
    value: "L12",
    bgcolor: colors.white,
  },
  {
    label: "K13",
    value: "L13",
    bgcolor: colors.white,
  },
  {
    label: "K14",
    value: "L14",
    bgcolor: colors.white,
  },
  {
    label: "K15",
    value: "L15",
    bgcolor: colors.white,
  },
];

export const businessExpensesSummary: ExpensesSummaryRowDataType[] = [
  {
    label: "計",
    value: "L16",
    bgcolor: colors.lightPink,
  },
  {
    label: "現状計",
    value: "L17",
    bgcolor: colors.lightPink,
  },
];

// Grand Total
export const grandTotalRow: ExpensesSummaryRowDataType = {
  label: "合計",
  value: "I2",
  bgcolor: colors.yellow,
};
