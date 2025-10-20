export interface ResultTableCell {
  label: string;
  value: string;
  tip?: string;
}

export interface InputTableCell {
  x: string;
  op: string;
  y: string;
  editable: boolean;
  xDesc?: string;
  yDesc?: string;
}

export const resultTable_cells: ResultTableCell[] = [
  {
    label: "PQ(売上）",
    value: "B3",
  },
  {
    label: "③",
    value: "B13",
    tip: "P×Qを入れるとここに売り上げが反映。上と同じ数字になるように①と②で調整しましょう。",
  },
  {
    label: "VQ(変動費）",
    value: "F3",
  },
  {
    label: "M(粗利）",
    value: "F13",
  },
  {
    label: "F(固定費）",
    value: "H13",
  },
  {
    label: "G(利益）",
    value: "H18",
  },
];

export const inputTable_cells: InputTableCell[] = [
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
];
