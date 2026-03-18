// Company-rating workbook: 4 sheets (input_data, result, score_table, safety_indicators)
// Extracted from template-company-rating.xlsx

export const sheetsDataCompanyRating: Record<string, { [cell: string]: string | number }> = {
  input_data: {
    B1: "",
    C1: "",
  },
  result: {
    B2: "=input_data!C1",

    C6: "=input_data!C4/input_data!E4*100",
    C7: "=input_data!C6/input_data!E6*100",
    C8: "=input_data!C8/input_data!E8*100",
    C9: "=input_data!C10/input_data!E10*100",
    C12: "=input_data!C12/input_data!E12*100",
    C13: "=input_data!C14/input_data!E14*100",
    C17: "=input_data!C16/input_data!E16*100",
    C22: "=input_data!C18/input_data!E18",
    C23: "=input_data!C20/input_data!E20",
    C24: "=input_data!C22",
    C25: "=MAX(0,input_data!C24/input_data!E24)",

    // 配点 (E6–E25, E28–E38): manual entry only. Only sums are calculated:
    E26: "=SUM(E5:E25)",
    E40: "=SUM(E28:E38)",
    E42: "=E26+E40",

    // 格付け判定 (J26, J42): manual entry only
  },
  score_table: {

  },
  safety_indicators: {
  },
};