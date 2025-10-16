export interface MQFutureResultCell {
  label: string;
  amount: string;
  percentage: string;
  type: 0 | 1 | 2; // 0 disabled, 1 editable, 2 readonly
  tip?: string;
  description?: string;
}

export interface MQFutureUnitPriceCell {
  x: string;
  op: string;
  y: string;
  editable: boolean;
  xDesc?: string;
  yDesc?: string;
}

// Main MQ Results Section (Left side) - Following the exact image layout
export const mqFutureResults_cells: MQFutureResultCell[] = [
  // Row 1: PQ Results section (B4-D12)
  {
    label: "PQ 結果",
    amount: "B3",
    percentage: "",
    type: 2,
  },
  {
    label: "VQ 結果",
    amount: "F3",
    percentage: "I10",
    type: 2,
  },
  // Row 13: M Results section (D14-E14, E16)
  {
    label: "M 結果",
    amount: "F13",
    percentage: "G16",
    type: 2,
  },
  {
    label: "F 結果",
    amount: "H13",
    percentage: "I16",
    type: 2,
  },
  {
    label: "差額",
    amount: "F17",
    percentage: "",
    type: 2,
    description: "0になるまで⑦を修正",
  },
  {
    label: "G 結果",
    amount: "H18",
    percentage: "I21",
    type: 2,
  },
  {
    label: "目標値",
    amount: "I22",
    percentage: "",
    type: 2,
  },
];

// Unit Price per Customer Section (Right side) - Top section (L1-T11)
export const mqFutureUnitPrice_cells: MQFutureUnitPriceCell[] = [
  {
    x: "P",
    op: "",
    y: "Q",
    editable: false,
    xDesc: "(プライス）①",
    yDesc: "(クォンティティー）②",
  },
  {
    x: "L3",
    op: "×",
    y: "Q3",
    editable: true,
  },
  // {
  //   x: "V",
  //   op: "",
  //   y: "Q",
  //   editable: false,
  //   xDesc: "(ヴァリアブル）",
  //   yDesc: "(クォンティティー）②",
  // },
  // {
  //   x: "L13",
  //   op: "×",
  //   y: "Q13",
  //   editable: true,
  // },
];
