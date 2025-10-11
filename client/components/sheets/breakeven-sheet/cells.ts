export interface BreakevenRowDataType {
  label: string;
  value: string;
  type: 0 | 1 | 2; // 0: disabled, 1: editable, 2: readonly (calculated)
  bgcolor?: string;
  tip?: string;
}

// Current Status (現状) data
export const currentStatus_cells: BreakevenRowDataType[] = [
  {
    label: "売上高",
    value: "B2",
    type: 2,
    bgcolor: "bg-gray-100",
    tip: "自動計算: 製造収入",
  },
  {
    label: "変動費",
    value: "B3",
    type: 2,
    bgcolor: "bg-gray-100",
    tip: "自動計算: 製造経費",
  },
  {
    label: "固定費",
    value: "B4",
    type: 2,
    bgcolor: "bg-gray-100",
    tip: "自動計算: 経費",
  },
  {
    label: "変動率 (変動費÷売上高)",
    value: "B5",
    type: 2,
    bgcolor: "bg-gray-100",
    tip: "変動費 ÷ 売上高",
  },
  {
    label: "損益分岐点 固定費÷(1-変動率)",
    value: "B6",
    type: 2,
    bgcolor: "bg-gray-100",
    tip: "固定費 ÷ (1 - 変動率)",
  },
];

// Next Period (来期) data
export const nextPeriod_cells: BreakevenRowDataType[] = [
  {
    label: "売上高",
    value: "E2",
    type: 2,
    bgcolor: "bg-gray-100",
    tip: "自動計算: スタートシート",
  },
  {
    label: "変動費",
    value: "E3",
    type: 2,
    bgcolor: "bg-gray-100",
    tip: "自動計算: スタートシート",
  },
  {
    label: "固定費",
    value: "E4",
    type: 2,
    bgcolor: "bg-gray-100",
    tip: "自動計算: スタートシート",
  },
  {
    label: "変動率 (変動費÷売上高)",
    value: "E5",
    type: 2,
    bgcolor: "bg-gray-100",
    tip: "変動費 ÷ 売上高",
  },
  {
    label: "損益分岐点 固定費÷(1-変動率)",
    value: "E6",
    type: 2,
    bgcolor: "bg-gray-100",
    tip: "固定費 ÷ (1 - 変動率)",
  },
];
