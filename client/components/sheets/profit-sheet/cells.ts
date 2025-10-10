export interface ProfitRowDataType {
  label: string;
  value: string;
  type: 0 | 1 | 2; // 0 disabled, 1 editable, 2 readonly/calculated
  bgcolor: string;
  suffix?: string;
  tip?: string;
}

export interface ComparisonRowDataType {
  label: string;
  value: string;
  type: 0 | 1 | 2; // 0 disabled, 1 editable, 2 readonly/calculated
  bgcolor: string;
}

const colors = {
  yellow: "bg-yellow-400",
  red: "bg-red-500",
  white: "bg-white",
  lightYellow: "bg-yellow-200",
  lightRed: "bg-red-200",
  lightGreen: "bg-green-200",
};

// Left calculation block - Ordinary Profit (経常利益)
export const ordinaryProfit_cells: ProfitRowDataType[] = [
  {
    label: "営業利益",
    value: "B3",
    type: 1, // editable
    bgcolor: colors.yellow,
    suffix: "百万円",
  },
  {
    label: "営業外収益",
    value: "B4",
    type: 1, // editable
    bgcolor: colors.yellow,
    suffix: "百万円",
  },
  {
    label: "営業外費用",
    value: "B5",
    type: 1, // editable
    bgcolor: colors.red,
    suffix: "百万円",
  },
  {
    label: "経常利益",
    value: "B6",
    type: 2, // calculated (readonly)
    bgcolor: colors.yellow,
    suffix: "百万円",
  },
];

// Right calculation block - Profit Before Tax (税引前利益)
export const profitBeforeTax_cells: ProfitRowDataType[] = [
  {
    label: "特別利益",
    value: "I3",
    type: 1, // editable
    bgcolor: colors.yellow,
    suffix: "百万円",
  },
  {
    label: "特別損失",
    value: "I4",
    type: 1, // editable
    bgcolor: colors.red,
    suffix: "百万円",
  },
  {
    label: "税引前利益",
    value: "I5",
    type: 2, // calculated (readonly)
    bgcolor: colors.yellow,
    suffix: "百万円",
  },
];

// Year-on-year comparison
export const comparison_cells: ComparisonRowDataType[] = [
  {
    label: "前年対比",
    value: "I7",
    type: 2, // calculated (readonly)
    bgcolor: colors.yellow,
  },
];

