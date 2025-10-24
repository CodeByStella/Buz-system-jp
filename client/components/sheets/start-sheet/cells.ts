export interface InfoRowDataType {
  label: string;
  from: string;
  to: string;
  number: string;
}

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

export const startSheet_info: InfoRowDataType[] = [
  {
    label: "C1",
    from: "B2",
    to: "B3",
    number: "G1",
  },
];

export const startSheet_main: MainRowDataType[] = [
  {
    no: "売上",
    label: "直近売上",
    incomeStatement: {
      value: "C6",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D6",
      type: 0,
    },
    bgcolor1: colors.lightCyan,
    bgcolor2: colors.lightCyan,
  },
  {
    no: "総益",
    label: "売上総利益",
    incomeStatement: {
      value: "C7",
      type: 2,
    },
    manufacturingCostReport: {
      value: "D7",
      type: 0,
    },
    bgcolor1: colors.lightCyan,
    bgcolor2: colors.lightCyan,
  },
  {
    no: "益率",
    label: "利益率(%)",
    incomeStatement: {
      value: "C8",
      type: 2,
      suffix: "%",
    },
    manufacturingCostReport: {
      value: "D8",
      type: 0,
    },
    bgcolor1: colors.lightCyan,
    bgcolor2: colors.lightCyan,
  },
  {
    no: "人件1",
    label: "社員給料",
    incomeStatement: {
      value: "C12",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D12",
      type: 0,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件2",
    label: "通勤手当",
    incomeStatement: {
      value: "C13",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D13",
      type: 1,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件3",
    label: "賞与",
    incomeStatement: {
      value: "C14",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D14",
      type: 1,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件4",
    label: "退職金",
    incomeStatement: {
      value: "C15",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D15",
      type: 0,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件5",
    label: "雑給料",
    incomeStatement: {
      value: "C16",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D16",
      type: 0,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件6",
    label: "派遣社員費",
    incomeStatement: {
      value: "C17",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D17",
      type: 0,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件7",
    label: "契約社員費",
    incomeStatement: {
      value: "C18",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D18",
      type: 0,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件8",
    label: "諸費用",
    incomeStatement: {
      value: "C19",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D19",
      type: 0,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件9",
    label: "役員報酬",
    incomeStatement: {
      value: "C20",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D20",
      type: 0,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件10",
    label: "募集費",
    incomeStatement: {
      value: "C21",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D21",
      type: 0,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件11",
    label: "教育研修",
    incomeStatement: {
      value: "C22",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D22",
      type: 0,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件12",
    label: "研修費",
    incomeStatement: {
      value: "C23",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D23",
      type: 0,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件13",
    label: "会議費",
    incomeStatement: {
      value: "C24",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D24",
      type: 0,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件14",
    label: "予備",
    incomeStatement: {
      value: "C25",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D25",
      type: 0,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件15",
    label: "予備",
    incomeStatement: {
      value: "C26",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D26",
      type: 0,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件16",
    label: "福利厚生費",
    incomeStatement: {
      value: "C27",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D27",
      type: 1,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "人件17",
    label: "法定福利費",
    incomeStatement: {
      value: "C28",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D28",
      type: 1,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "事業費1",
    label: "事業戦略費",
    incomeStatement: {
      value: "C29",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D29",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "事業費2",
    label: "社長戦略費Ａ",
    incomeStatement: {
      value: "C30",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D30",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "事業費3",
    label: "社長戦略費Ｂ",
    incomeStatement: {
      value: "C31",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D31",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "事業費4",
    label: "開拓手数料(外交員)",
    incomeStatement: {
      value: "C32",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D32",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "事業費5",
    label: "消耗資材費",
    incomeStatement: {
      value: "C33",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D33",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "事業費6",
    label: "ロイヤリティー",
    incomeStatement: {
      value: "C34",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D34",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "事業費7",
    label: "外注加工費",
    incomeStatement: {
      value: "C35",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D35",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "事業費8",
    label: "運賃荷造費",
    incomeStatement: {
      value: "C36",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D36",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "販促費1",
    label: "テナント料",
    incomeStatement: {
      value: "C37",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D37",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "販促費2",
    label: "包装費",
    incomeStatement: {
      value: "C38",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D38",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "販促費3",
    label: "販売企画費",
    incomeStatement: {
      value: "C39",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D39",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "販促費4",
    label: "試供品ＤＭ費",
    incomeStatement: {
      value: "C40",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D40",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "販促費5",
    label: "販売促進費",
    incomeStatement: {
      value: "C41",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D41",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "販促費6",
    label: "広告宣伝費",
    incomeStatement: {
      value: "C42",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D42",
      type: 0,
    },
    bgcolor1: colors.blue,
    bgcolor2: colors.blue,
  },
  {
    no: "原価１",
    label: "期首商品棚卸高",
    incomeStatement: {
      value: "C43",
      type: 0,
    },
    manufacturingCostReport: {
      value: "D43",
      type: 1,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.yellow,
  },
  {
    no: "原価２",
    label: "期首製品棚卸高",
    incomeStatement: {
      value: "C44",
      type: 0,
    },
    manufacturingCostReport: {
      value: "D44",
      type: 1,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.yellow,
  },
  {
    no: "原価３",
    label: "商品仕入高",
    incomeStatement: {
      value: "C45",
      type: 0,
    },
    manufacturingCostReport: {
      value: "D45",
      type: 1,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.yellow,
  },
  {
    no: "原価4",
    label: "製品仕入高",
    incomeStatement: {
      value: "C46",
      type: 0,
    },
    manufacturingCostReport: {
      value: "D46",
      type: 1,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.yellow,
  },
  {
    no: "原価5",
    label: "期末商品棚卸高",
    incomeStatement: {
      value: "C47",
      type: 0,
    },
    manufacturingCostReport: {
      value: "D47",
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
      value: "C48",
      type: 0,
    },
    manufacturingCostReport: {
      value: "D48",
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
      value: "C49",
      type: 0,
    },
    manufacturingCostReport: {
      value: "D49",
      type: 1,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.orange,
  },
  {
    no: "原価8",
    label: "原材料仕入高１",
    incomeStatement: {
      value: "C50",
      type: 0,
    },
    manufacturingCostReport: {
      value: "D50",
      type: 1,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.orange,
  },
  {
    no: "原価9",
    label: "原材料仕入高２",
    incomeStatement: {
      value: "C51",
      type: 0,
    },
    manufacturingCostReport: {
      value: "D51",
      type: 1,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.orange,
  },
  {
    no: "原仕10",
    label: "原材料仕入高３",
    incomeStatement: {
      value: "C52",
      type: 0,
    },
    manufacturingCostReport: {
      value: "D52",
      type: 1,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.orange,
  },
  {
    no: "原価１1",
    label: "仕掛品",
    incomeStatement: {
      value: "C53",
      type: 0,
    },
    manufacturingCostReport: {
      value: "D53",
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
      value: "C54",
      type: 0,
    },
    manufacturingCostReport: {
      value: "D54",
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
      value: "C55",
      type: 0,
    },
    manufacturingCostReport: {
      value: "D55",
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
      value: "C56",
      type: 0,
    },
    manufacturingCostReport: {
      value: "D56",
      type: 1,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.orange,
  },
  {
    no: "原価１５",
    label: "労務費",
    incomeStatement: {
      value: "C57",
      type: 0,
    },
    manufacturingCostReport: {
      value: "D57",
      type: 2,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.orange,
  },
  {
    no: "原価１６",
    label: "外注加工費",
    incomeStatement: {
      value: "C58",
      type: 0,
    },
    manufacturingCostReport: {
      value: "D58",
      type: 1,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.orange,
  },
  {
    no: "労務費内訳",
    label: "(労務費内訳）",
    incomeStatement: {
      value: "C59",
      type: 0,
    },
    manufacturingCostReport: {
      value: "D59",
      type: 0,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.teal,
  },
  {
    no: "労務費内訳",
    label: "社員給料",
    incomeStatement: {
      value: "C60",
      type: 0,
    },
    manufacturingCostReport: {
      value: "D60",
      type: 1,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.teal,
  },
  {
    no: "労務費内訳",
    label: "雑給料",
    incomeStatement: {
      value: "C61",
      type: 0,
    },
    manufacturingCostReport: {
      value: "D61",
      type: 1,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.teal,
  },
  {
    no: "労務費内訳",
    label: "契約社員費",
    incomeStatement: {
      value: "C62",
      type: 0,
    },
    manufacturingCostReport: {
      value: "D62",
      type: 1,
    },
    bgcolor1: colors.yellow,
    bgcolor2: colors.teal,
  },
  {
    no: "経費１",
    label: "電力費",
    incomeStatement: {
      value: "C63",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D63",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費２",
    label: "動力費",
    incomeStatement: {
      value: "C64",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D64",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費３",
    label: "ガス光熱費",
    incomeStatement: {
      value: "C65",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D65",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費4",
    label: "燃料費",
    incomeStatement: {
      value: "C66",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D66",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費5",
    label: "上水道費",
    incomeStatement: {
      value: "C67",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D67",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費6",
    label: "下水道費",
    incomeStatement: {
      value: "C68",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D68",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費7",
    label: "車輌費",
    incomeStatement: {
      value: "C69",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D69",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費8",
    label: "家賃地代",
    incomeStatement: {
      value: "C70",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D70",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費9",
    label: "賃貸料",
    incomeStatement: {
      value: "C71",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D71",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費１0",
    label: "研究開発費",
    incomeStatement: {
      value: "C72",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D72",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費１1",
    label: "調査研究費",
    incomeStatement: {
      value: "C73",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D73",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費１2",
    label: "租税公課",
    incomeStatement: {
      value: "C74",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D74",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費１3",
    label: "接待交際費",
    incomeStatement: {
      value: "C75",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D75",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費１4",
    label: "支払手数料",
    incomeStatement: {
      value: "C76",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D76",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費１5",
    label: "顧問料",
    incomeStatement: {
      value: "C77",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D77",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費１6",
    label: "リース料",
    incomeStatement: {
      value: "C78",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D78",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費１7",
    label: "通信交通費",
    incomeStatement: {
      value: "C79",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D79",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費１8",
    label: "出張費",
    incomeStatement: {
      value: "C80",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D80",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費１9",
    label: "消耗品費",
    incomeStatement: {
      value: "C81",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D81",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費20",
    label: "事務用品費",
    incomeStatement: {
      value: "C82",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D82",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費21",
    label: "その他経費",
    incomeStatement: {
      value: "C83",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D83",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費22",
    label: "雑費",
    incomeStatement: {
      value: "C84",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D84",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費23",
    label: "装飾費",
    incomeStatement: {
      value: "C85",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D85",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費24",
    label: "衛生費",
    incomeStatement: {
      value: "C86",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D86",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費25",
    label: "運賃",
    incomeStatement: {
      value: "C87",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D87",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費26",
    label: "荷造包装費",
    incomeStatement: {
      value: "C88",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D88",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費27",
    label: "水道光熱費",
    incomeStatement: {
      value: "C89",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D89",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費28",
    label: "旅費交通費",
    incomeStatement: {
      value: "C90",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D90",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費29",
    label: "諸会費",
    incomeStatement: {
      value: "C91",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D91",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費30",
    label: "管理諸費",
    incomeStatement: {
      value: "C92",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D92",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費3１",
    label: "保守管理費",
    incomeStatement: {
      value: "C93",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D93",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費32",
    label: "図書費",
    incomeStatement: {
      value: "C94",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D94",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費33",
    label: "修繕費",
    incomeStatement: {
      value: "C95",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D95",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費34",
    label: "修繕維持費",
    incomeStatement: {
      value: "C96",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D96",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費35",
    label: "保険料",
    incomeStatement: {
      value: "C97",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D97",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費36",
    label: "備品費",
    incomeStatement: {
      value: "C98",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D98",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "経費37",
    label: "寄付金",
    incomeStatement: {
      value: "C99",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D99",
      type: 1,
    },
    bgcolor1: colors.peach,
    bgcolor2: colors.peach,
  },
  {
    no: "減償",
    label: "減価償却費",
    incomeStatement: {
      value: "C100",
      type: 1,
    },
    manufacturingCostReport: {
      value: "D100",
      type: 1,
    },
    bgcolor1: colors.beige,
    bgcolor2: colors.beige,
  },
  {
    no: "営00",
    label: "本社費",
    incomeStatement: {
      value: "C101",
      type: 0,
    },
    manufacturingCostReport: {
      value: "D101",
      type: 0,
    },
    bgcolor1: colors.orange,
    bgcolor2: colors.orange,
  },
  {
    no: "営01",
    label: "営業外収益",
    incomeStatement: {
      value: "C102",
      type: 2,
    },
    manufacturingCostReport: {
      value: "D102",
      type: 0,
    },
    bgcolor1: colors.purple,
    bgcolor2: colors.purple,
  },
  {
    no: "営02",
    label: "営業外費用",
    incomeStatement: {
      value: "C103",
      type: 2,
    },
    manufacturingCostReport: {
      value: "D103",
      type: 0,
    },
    bgcolor1: colors.purple,
    bgcolor2: colors.purple,
  },
  {
    no: "",
    label: "経常利益",
    incomeStatement: {
      value: "C104",
      type: 2,
    },
    manufacturingCostReport: {
      value: "D104",
      type: 0,
    },
    bgcolor1: colors.purple,
    bgcolor2: colors.purple,
  },
  {
    no: "営03",
    label: "特別利益・除却益",
    incomeStatement: {
      value: "C105",
      type: 2,
    },
    manufacturingCostReport: {
      value: "D105",
      type: 0,
    },
    bgcolor1: colors.purple,
    bgcolor2: colors.purple,
  },
  {
    no: "営04",
    label: "特別損失・除却損",
    incomeStatement: {
      value: "C106",
      type: 2,
    },
    manufacturingCostReport: {
      value: "D106",
      type: 0,
    },
    bgcolor1: colors.purple,
    bgcolor2: colors.purple,
  },
];
export const startSheet_others: OthersRowDataType[] = [
  {
    no: "",
    label: "営業外収益名称",
    value: "金額",
    editable: false,
  },
  {
    no: "営01",
    label: "F64",
    value: "G64",
    editable: true,
  },
  {
    no: "営01",
    label: "F65",
    value: "G65",
    editable: true,
  },
  {
    no: "営01",
    label: "F66",
    value: "G66",
    editable: true,
  },
  {
    no: "営01",
    label: "F67",
    value: "G67",
    editable: true,
  },

  {
    no: "",
    label: "営業外費用名称",
    value: "金額",
    editable: false,
  },
  {
    no: "営02",
    label: "F69",
    value: "G69",
    editable: true,
  },
  {
    no: "営02",
    label: "F70",
    value: "G70",
    editable: true,
  },
  {
    no: "営02",
    label: "F71",
    value: "G71",
    editable: true,
  },
  {
    no: "営02",
    label: "F72",
    value: "G72",
    editable: true,
  },

  {
    no: "",
    label: "特別利益・除却益名称",
    value: "金額",
    editable: false,
  },
  {
    no: "営03",
    label: "F74",
    value: "G74",
    editable: true,
  },
  {
    no: "営03",
    label: "F75",
    value: "G75",
    editable: true,
  },
  {
    no: "営03",
    label: "F76",
    value: "G76",
    editable: true,
  },
  {
    no: "営03",
    label: "F77",
    value: "G77",
    editable: true,
  },

  {
    no: "",
    label: "特別損失・除却損名称",
    value: "金額",
    editable: false,
  },
  {
    no: "営04",
    label: "F79",
    value: "G79",
    editable: true,
  },
  {
    no: "営04",
    label: "F80",
    value: "G80",
    editable: true,
  },
  {
    no: "営04",
    label: "F81",
    value: "G81",
    editable: true,
  },
  {
    no: "営04",
    label: "F82",
    value: "G82",
    editable: true,
  },
];
export const startSheet_summary: SummaryRowDataType[] = [
  {
    label: "売上原価 合計",
    value: "G102",
  },
  {
    label: "一般管理費",
    value: "G103",
  },
  {
    label: "営業利益",
    value: "G105",
  },
  {
    label: "税引前利益",
    value: "G106",
  },
];
