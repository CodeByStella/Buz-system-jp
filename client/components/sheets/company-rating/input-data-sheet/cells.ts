/**
 * Row definitions for the company-rating input-data sheet.
 * Matches the layout: [Ratio name (yellow)] [Num label] [Num value (input)] [÷] [Denom label] [Denom value (input)] [×100].
 * Value-only rows use […] [×100] in the last column when times100 is true.
 */

export interface InputDataRowType {
  /** Ratio/metric name (yellow column) */
  ratioName: string;
  /** Numerator formula label (light blue) */
  numLabel: string;
  /** Cell ref for numerator value (light green input) */
  numCell: string | null;
  /** Denominator formula label (light blue), null for value-only rows */
  denomLabel: string | null;
  /** Cell ref for denominator value (light green input), null for value-only rows */
  denomCell: string | null;
  /** Show ×100 (percentage) for this row */
  times100: boolean;
}

const colors = {
  yellow: "bg-yellow-400",
  lightCyan: "bg-cyan-100",
  lightGreen: "bg-green-100",
  white: "bg-white",
};

export const inputDataRowColors = colors;

export const inputDataRows: InputDataRowType[] = [
  {
    ratioName: "自己資本比率",
    numLabel: "資本の部合計(純資産)",
    numCell: "C4",
    denomLabel: "負債及び純資産合計",
    denomCell: "E4",
    times100: true,
  },
  {
    ratioName: "ギアリング比率",
    numLabel: "短期借入金＋長期借入金＋社債",
    numCell: "C6",
    denomLabel: "資本の部合計(純資産)",
    denomCell: "E6",
    times100: true,
  },
  {
    ratioName: "固定長期適合率",
    numLabel: "固定資産合計",
    numCell: "C8",
    denomLabel: "固定負債＋自己資本",
    denomCell: "E8",
    times100: true,
  },
  {
    ratioName: "流動比率",
    numLabel: "流動資産合計",
    numCell: "C10",
    denomLabel: "流動負債合計",
    denomCell: "E10",
    times100: true,
  },
  {
    ratioName: "売上高経常利益率",
    numLabel: "経常利益",
    numCell: "C12",
    denomLabel: "当期売上高",
    denomCell: "E12",
    times100: true,
  },
  {
    ratioName: "総資本経常利益率(ROA)",
    numLabel: "経常利益",
    numCell: "C14",
    denomLabel: "負債及び純資産合計",
    denomCell: "E14",
    times100: true,
  },
  {
    ratioName: "経常利益増加率",
    numLabel: "経常利益-前期経常利益",
    numCell: "C16",
    denomLabel: "前期経常利益",
    denomCell: "E16",
    times100: true,
  },
  {
    ratioName: "債務償還年数",
    numLabel: "短期借入金＋長期借入金＋社債",
    numCell: "C18",
    denomLabel: "経常利益＋減価償却費－法人税等",
    denomCell: "E18",
    times100: true,
  },
  {
    ratioName: "インタレスト・カバレッジ・レシオ",
    numLabel: "営業利益＋受取利息・配当金",
    numCell: "C20",
    denomLabel: "支払利息・割引き料",
    denomCell: "E20",
    times100: true,
  },
  {
    ratioName: "キャッシュフロー額",
    numLabel: "営業利益＋当期減価償却実施額",
    numCell: "C22",
    denomLabel: null,
    denomCell: null,
    times100: true,
  },
  {
    ratioName: "事業者に有利な年数",
    numLabel: "",
    numCell: null, // Label-only row: no value in the reference table
    denomLabel: null,
    denomCell: null,
    times100: false,
  },
  {
    ratioName: "債務償還年数②",
    numLabel: "有利子負債-現預金-売掛金",
    numCell: "C24",
    denomLabel: "経常利益＋減価償却費－法人税等",
    denomCell: "E24",
    times100: true,
  },
];
