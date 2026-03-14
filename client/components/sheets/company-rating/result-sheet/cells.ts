/**
 * Result sheet: evaluation rows and rating table definitions.
 * Excel layout: 項目 (B) | 結果 (C) | 位 (D) | 配点 (E) | (F empty) | 評価 (G).
 * Column G in Excel = 評価 (editable text). Field names are in column B.
 */

export interface ResultRowType {
  /** Field name (項目) - shown on the left */
  label: string;
  /** Cell for 結果 (calculated value) */
  resultCell: string;
  /** Cell for 配点 (points); formula or editable */
  pointsCell: string;
  /** Cell for 評価 (editable text input, column G in Excel) */
  evaluationCell: string;
  /** If true, 配点 is user-editable (主観項目) */
  pointsEditable: boolean;
  /** Optional suffix for 結果 display e.g. "%", "年", "倍" */
  resultSuffix?: string;
}

export interface ResultSectionType {
  title: string;
  rows: ResultRowType[];
}

/** 定量: safety, profitability, growth, repayment + 定量要因小計 */
export const resultSectionsQuantitative: ResultSectionType[] = [
  {
    title: "1 安全性項目",
    rows: [
      { label: "自己資本比率", resultCell: "C6", pointsCell: "E6", evaluationCell: "G6", pointsEditable: false, resultSuffix: "%" },
      { label: "ギアリング比率", resultCell: "C7", pointsCell: "E7", evaluationCell: "G7", pointsEditable: false, resultSuffix: "%" },
      { label: "固定長期適合率", resultCell: "C8", pointsCell: "E8", evaluationCell: "G8", pointsEditable: false, resultSuffix: "%" },
      { label: "流動比率", resultCell: "C9", pointsCell: "E9", evaluationCell: "G9", pointsEditable: false, resultSuffix: "%" },
    ],
  },
  {
    title: "2 収益性項目",
    rows: [
      { label: "売上高経常利益率", resultCell: "C12", pointsCell: "E12", evaluationCell: "G12", pointsEditable: false, resultSuffix: "%" },
      { label: "総資本経常利益率", resultCell: "C13", pointsCell: "E13", evaluationCell: "G13", pointsEditable: false, resultSuffix: "%" },
      { label: "収益フロー", resultCell: "C14", pointsCell: "E14", evaluationCell: "G14", pointsEditable: false },
    ],
  },
  {
    title: "3 成長性項目",
    rows: [
      { label: "経常利益増加率", resultCell: "C17", pointsCell: "E17", evaluationCell: "G17", pointsEditable: false, resultSuffix: "%" },
      { label: "自己資本額", resultCell: "C18", pointsCell: "E18", evaluationCell: "G18", pointsEditable: false },
      { label: "売上高", resultCell: "C19", pointsCell: "E19", evaluationCell: "G19", pointsEditable: false },
    ],
  },
  {
    title: "4 返済能力",
    rows: [
      { label: "債務償還年数", resultCell: "C22", pointsCell: "E22", evaluationCell: "G22", pointsEditable: false, resultSuffix: " 年" },
      { label: "インタレスト・カバレッジ・レシオ", resultCell: "C23", pointsCell: "E23", evaluationCell: "G23", pointsEditable: false, resultSuffix: " 倍" },
      { label: "キャッシュフロー額", resultCell: "C24", pointsCell: "E24", evaluationCell: "G24", pointsEditable: false },
      { label: "事業者に有利な債務償還年数", resultCell: "C25", pointsCell: "E25", evaluationCell: "G25", pointsEditable: false, resultSuffix: " 年" },
    ],
  },
];

/** 定量要因小計 / 格付け判定 cell */
export const quantitativeSubtotalCell = "E26";
export const quantitativeRatingCell = "J26";

/** 主観項目 (editable 配点 in column E) */
export const resultSectionSubjective: ResultSectionType = {
  title: "主観項目",
  rows: [
    { label: "市場動向", resultCell: "", pointsCell: "E28", evaluationCell: "G28", pointsEditable: true },
    { label: "景気感応度", resultCell: "", pointsCell: "E29", evaluationCell: "G29", pointsEditable: true },
    { label: "市場規模", resultCell: "", pointsCell: "E30", evaluationCell: "G30", pointsEditable: true },
    { label: "競合状態", resultCell: "", pointsCell: "E31", evaluationCell: "G31", pointsEditable: true },
    { label: "業歴", resultCell: "", pointsCell: "E32", evaluationCell: "G32", pointsEditable: true },
    { label: "経営者・経営方針", resultCell: "", pointsCell: "E33", evaluationCell: "G33", pointsEditable: true },
    { label: "株主", resultCell: "", pointsCell: "E34", evaluationCell: "G34", pointsEditable: true },
    { label: "従業員モラル", resultCell: "", pointsCell: "E35", evaluationCell: "G35", pointsEditable: true },
    { label: "営業基盤", resultCell: "", pointsCell: "E36", evaluationCell: "G36", pointsEditable: true },
    { label: "競争力", resultCell: "", pointsCell: "E37", evaluationCell: "G37", pointsEditable: true },
    { label: "シェア", resultCell: "", pointsCell: "E38", evaluationCell: "G38", pointsEditable: true },
  ],
};

/** 定性要因小計 / スコア合計 (E column = 配点 values) */
export const qualitativeSubtotalCell = "E40";
export const totalScoreCell = "E42";
export const combinedRatingCell = "J42";

/** Rating row: display number in cell, description as tooltip */
export interface RatingRowType {
  score: string;
  display: string;
  tooltip: string;
}

/** Rating table 1: 定量要因 スコア -> 格付け (display number only, description as tooltip) */
export const ratingTableQuantitative: RatingRowType[] = [
  { score: "90以上", display: "1", tooltip: "倒産指数〇" },
  { score: "80以上", display: "2", tooltip: "超優良企業" },
  { score: "65以上", display: "3", tooltip: "優良企業" },
  { score: "50以上", display: "4", tooltip: "良好" },
  { score: "40以上", display: "5", tooltip: "普通" },
  { score: "25以上", display: "6", tooltip: "やや普通" },
  { score: "25未満", display: "7", tooltip: "やや警戒" },
  { score: "警戒先", display: "8", tooltip: "" },
  { score: "延滞先", display: "9", tooltip: "" },
  { score: "事故先", display: "10", tooltip: "" },
];

/** Rating table 2: 定量・定性要因 スコア -> 格付け (display number only, description as tooltip) */
export const ratingTableCombined: RatingRowType[] = [
  { score: "180以上", display: "1", tooltip: "リスクなし" },
  { score: "160以上", display: "2", tooltip: "殆どリスクなし" },
  { score: "130以上", display: "3", tooltip: "リスク些少" },
  { score: "100以上", display: "4", tooltip: "リスクあるが良好水準" },
  { score: "80以上", display: "5", tooltip: "リスクあるが平均的水平" },
  { score: "50以上", display: "6", tooltip: "リスクやや高いが許容範囲" },
  { score: "50未満", display: "7", tooltip: "リスク高く管理徹底" },
  { score: "警戒先", display: "8", tooltip: "行き詰まる可能性あり" },
  { score: "延滞先", display: "9", tooltip: "回復難しく不良債権解消目処なし" },
  { score: "事故先", display: "10", tooltip: "償却を要する" },
];
