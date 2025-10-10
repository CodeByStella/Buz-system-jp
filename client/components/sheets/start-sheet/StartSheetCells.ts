export interface MainRowDataType {
  no: string;
  label: string;
  incomeStatement: {
    value: string;
    type: 0 | 1 | 2; //0 disabled, 1 editable, 2 readonly
    tip?: string;
    suffix?: string;
  };
  manufacturingCostReport: {
    value: string;
    type: 0 | 1 | 2; //0 disabled, 1 editable, 2 readonly
    tip?: string;
    suffix?: string;
  };
  bgcolor1: string;
  bgcolor2: string;
}

export interface OthersRowDataType {
  no: string;
  label: string;
  value: string;
  parent_key: string;
  editable: boolean;
}

export interface SummaryRowDataType {
  label: string;
  value: string;
}
const colors = {
  yellow: "bg-yellow-400",
  red: "bg-red-700",
  gray: "bg-gray-400",
  lightCyan: "bg-cyan-100",
  lightBlue: "bg-blue-200",
  orange: "bg-orange-500",
  teal: "bg-teal-400",
  purple: "bg-purple-300",
  beige: "bg-yellow-100",
  gold: "bg-yellow-300",
  orangeAccent: "bg-orange-400",
  brightRed: "bg-red-500",
  lightGray: "bg-gray-200",
  peach: "bg-orange-200",
  silver: "bg-slate-200",
  blue: "bg-blue-400",
};

export const startSheet_main: MainRowDataType[] = [
  {
    no: "売上",
    label: "直近売上",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.lightCyan,
    bgcolor2: colors.lightCyan,
  },
  {
    no: "総益",
    label: "売上総利益",
    incomeStatement: {
      value: "A1",
      type: 2,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.lightCyan,
    bgcolor2: colors.lightCyan,
  },
  {
    no: "益率",
    label: "利益率(%)",
    incomeStatement: {
      value: "A1",
      type: 2,
      suffix: "%",
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.lightCyan,
    bgcolor2: colors.lightCyan,
  },
  {
    no: "人件1",
    label: "社員給料",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件2",
    label: "通勤手当",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件3",
    label: "賞与",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件4",
    label: "退職金",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件5",
    label: "雑給料",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件6",
    label: "派遣社員費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件7",
    label: "契約社員費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件8",
    label: "諸費用",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件9",
    label: "役員報酬",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件10",
    label: "募集費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件11",
    label: "教育研修",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件12",
    label: "研修費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件13",
    label: "会議費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件14",
    label: "予備",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件15",
    label: "予備",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件16",
    label: "福利厚生費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件17",
    label: "法定福利費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "事業費1",
    label: "事業戦略費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "事業費2",
    label: "社長戦略費Ａ",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "事業費3",
    label: "社長戦略費Ｂ",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "事業費4",
    label: "開拓手数料(外交員)",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "事業費5",
    label: "消耗資材費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "事業費6",
    label: "ロイヤリティー",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "事業費7",
    label: "外注加工費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "事業費8",
    label: "運賃荷造費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "販促費1",
    label: "テナント料",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "販促費2",
    label: "包装費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "販促費3",
    label: "販売企画費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "販促費4",
    label: "試供品ＤＭ費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "販促費5",
    label: "販売促進費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "販促費6",
    label: "広告宣伝費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "原価１",
    label: "期首商品棚卸高",
    incomeStatement: {
      value: "A1",
      type: 0,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.yellow,
  },
  {
    no: "原価２",
    label: "期首製品棚卸高",
    incomeStatement: {
      value: "A1",
      type: 0,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.yellow,
  },
  {
    no: "原価３",
    label: "商品仕入高",
    incomeStatement: {
      value: "A1",
      type: 0,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.yellow,
  },
  {
    no: "原価4",
    label: "製品仕入高",
    incomeStatement: {
      value: "A1",
      type: 0,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.yellow,
  },
  {
    no: "原価5",
    label: "期末商品棚卸高",
    incomeStatement: {
      value: "A1",
      type: 0,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
      tip: "＊期末の棚卸額は、\n - (マイナス）を付けて\n 入力してください。",
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.yellow,
  },
  {
    no: "原価6",
    label: "期末製品棚卸高",
    incomeStatement: {
      value: "A1",
      type: 0,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
      tip: "＊期末の棚卸額は、\n - (マイナス）を付けて\n 入力してください。",
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.yellow,
  },
  {
    no: "原価7",
    label: "期首原材料棚卸高",
    incomeStatement: {
      value: "A1",
      type: 0,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.orange,
  },
  {
    no: "原価8",
    label: "原材料仕入高１",
    incomeStatement: {
      value: "A1",
      type: 0,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.orange,
  },
  {
    no: "原価9",
    label: "原材料仕入高２",
    incomeStatement: {
      value: "A1",
      type: 0,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.orange,
  },
  {
    no: "原仕10",
    label: "原材料仕入高３",
    incomeStatement: {
      value: "A1",
      type: 0,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.orange,
  },
  {
    no: "原価１1",
    label: "仕掛品",
    incomeStatement: {
      value: "A1",
      type: 0,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
      tip: "＊期末の棚卸額は、\n - (マイナス）を付けて\n 入力してください。",
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.orange,
  },
  {
    no: "原価１2",
    label: "期末原材料棚卸高",
    incomeStatement: {
      value: "A1",
      type: 0,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
      tip: "＊期末の棚卸額は、\n - (マイナス）を付けて\n 入力してください。",
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.orange,
  },
  {
    no: "原価１3",
    label: "在庫",
    incomeStatement: {
      value: "A1",
      type: 0,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
      tip: "＊期末の棚卸額は、\n - (マイナス）を付けて\n 入力してください。",
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.orange,
  },
  {
    no: "原価１４",
    label: "外注費",
    incomeStatement: {
      value: "A1",
      type: 0,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.orange,
  },
  {
    no: "原価１５",
    label: "労務費",
    incomeStatement: {
      value: "A1",
      type: 0,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 2,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.orange,
  },
  {
    no: "原価１６",
    label: "外注加工費",
    incomeStatement: {
      value: "A1",
      type: 0,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.orange,
  },
  {
    no: "労務費内訳",
    label: "(労務費内訳）",
    incomeStatement: {
      value: "A1",
      type: 0,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.teal,
  },
  {
    no: "労務費内訳",
    label: "社員給料",
    incomeStatement: {
      value: "A1",
      type: 0,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.teal,
  },
  {
    no: "労務費内訳",
    label: "雑給料",
    incomeStatement: {
      value: "A1",
      type: 0,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.teal,
  },
  {
    no: "労務費内訳",
    label: "契約社員費",
    incomeStatement: {
      value: "A1",
      type: 0,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.teal,
  },
  {
    no: "経費１",
    label: "電力費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費２",
    label: "動力費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費３",
    label: "ガス光熱費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費4",
    label: "燃料費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費5",
    label: "上水道費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費6",
    label: "下水道費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費7",
    label: "車輌費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費8",
    label: "家賃地代",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費9",
    label: "賃貸料",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費１0",
    label: "研究開発費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費１1",
    label: "調査研究費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費１2",
    label: "租税公課",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費１3",
    label: "接待交際費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費１4",
    label: "支払手数料",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費１5",
    label: "顧問料",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費１6",
    label: "リース料",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費１7",
    label: "通信交通費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費１8",
    label: "出張費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費１9",
    label: "消耗品費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費20",
    label: "事務用品費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費21",
    label: "その他経費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費22",
    label: "雑費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費23",
    label: "装飾費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費24",
    label: "衛生費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費25",
    label: "運賃",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費26",
    label: "荷造包装費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費27",
    label: "水道光熱費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費28",
    label: "旅費交通費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費29",
    label: "諸会費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費30",
    label: "管理諸費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費3１",
    label: "保守管理費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費32",
    label: "図書費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費33",
    label: "修繕費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費34",
    label: "修繕維持費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費35",
    label: "保険料",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費36",
    label: "備品費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費37",
    label: "寄付金",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "減償",
    label: "減価償却費",
    incomeStatement: {
      value: "A1",
      type: 1,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 1,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "営00",
    label: "本社費",
    incomeStatement: {
      value: "A1",
      type: 0,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.orange,
    bgcolor2: colors.orange,
  },
  {
    no: "営01",
    label: "営業外収益",
    incomeStatement: {
      value: "A1",
      type: 2,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.purple,
    bgcolor2: colors.purple,
  },
  {
    no: "営02",
    label: "営業外費用",
    incomeStatement: {
      value: "A1",
      type: 2,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.purple,
    bgcolor2: colors.purple,
  },
  {
    no: "営03",
    label: "経常利益",
    incomeStatement: {
      value: "A1",
      type: 2,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.purple,
    bgcolor2: colors.purple,
  },
  {
    no: "営04",
    label: "特別利益・除却益",
    incomeStatement: {
      value: "A1",
      type: 2,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.purple,
    bgcolor2: colors.purple,
  },
  {
    no: "営05",
    label: "特別損失・除却損",
    incomeStatement: {
      value: "A1",
      type: 2,
    },
    manufacturingCostReport: {
      value: "A1",
      type: 0,
    },
    bgcolor1: colors.purple,
    bgcolor2: colors.purple,
  },
];
export const startSheet_others: OthersRowDataType[] = [
  {
    no: "",
    parent_key: "",
    label: "営業外収益名称",
    value: "金額",
    editable: false,
  },
  {
    no: "営01",
    parent_key: "non_operating_income_name",
    label: "土地売却益",
    value: "A1",
    editable: true,
  },
  {
    no: "営02",
    parent_key: "non_operating_income_name",
    label: "不動産賃貸",
    value: "A1",
    editable: true,
  },

  {
    no: "",
    parent_key: "",
    label: "営業外費用名称",
    value: "金額",
    editable: false,
  },
  {
    no: "営01",
    parent_key: "non_operating_expenses_name",
    label: "有価証券評価損",
    value: "A1",
    editable: true,
  },

  {
    no: "",
    parent_key: "",
    label: "特別利益・除却益名称",
    value: "金額",
    editable: false,
  },
  {
    no: "営01",
    parent_key: "extraordinary_gain_name",
    label: "土地売却益",
    value: "A1",
    editable: true,
  },
  {
    no: "営02",
    parent_key: "extraordinary_gain_name",
    label: "事業再構築補助",
    value: "A1",
    editable: true,
  },

  {
    no: "",
    parent_key: "",
    label: "特別損失・除却損名称",
    value: "金額",
    editable: false,
  },
  {
    no: "営01",
    parent_key: "extraordinary_loss_name",
    label: "土地売却損",
    value: "A1",
    editable: true,
  },
];
export const startSheet_summary: SummaryRowDataType[] = [
  {
    label: "売上原価 合計",
    value: "A1",
  },
  {
    label: "一般管理費",
    value: "A1",
  },
  {
    label: "営業利益",
    value: "A1",
  },
  {
    label: "税引前利益",
    value: "A1",
  },
];
