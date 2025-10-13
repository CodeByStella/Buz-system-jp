export interface ManufacturingLaborRowDataType {
  label: string;
  unitPrice: string;
  count: string;
  total: string;
  bgcolor: string;
}

export interface ManufacturingLaborSummaryRowDataType {
  label: string;
  count: string;
  total: string;
  bgcolor: string;
}

export interface AverageIncomeRowDataType {
  label: string;
  value: string;
  percentage: string;
  bgcolor: string;
}

const colors = {
  yellow: "bg-yellow-400",
  lightYellow: "bg-yellow-200",
  white: "bg-white",
  gray: "bg-gray-100",
};

// Employee Salary Details Table (人件費明細)
export const manufacturingLaborEmployeeRows: ManufacturingLaborRowDataType[] = [
  {
    label: "B6",
    unitPrice: "C6",
    count: "D6",
    total: "E6",
    bgcolor: colors.yellow,
  },
  {
    label: "B7",
    unitPrice: "C7",
    count: "D7",
    total: "E7",
    bgcolor: colors.yellow,
  },
  {
    label: "B8",
    unitPrice: "C8",
    count: "D8",
    total: "E8",
    bgcolor: colors.yellow,
  },
  {
    label: "B9",
    unitPrice: "C9",
    count: "D9",
    total: "E9",
    bgcolor: colors.yellow,
  },
  {
    label: "B10",
    unitPrice: "C10",
    count: "D10",
    total: "E10",
    bgcolor: colors.yellow,
  },
  {
    label: "B11",
    unitPrice: "C11",
    count: "D11",
    total: "E11",
    bgcolor: colors.yellow,
  },
  {
    label: "B12",
    unitPrice: "C12",
    count: "D12",
    total: "E12",
    bgcolor: colors.yellow,
  },
  {
    label: "B13",
    unitPrice: "C13",
    count: "D13",
    total: "E13",
    bgcolor: colors.yellow,
  },
];

export const manufacturingLaborEmployeeSummary: ManufacturingLaborSummaryRowDataType[] =
  [
    {
      label: "社員給料",
      count: "D14",
      total: "E14",
      bgcolor: colors.lightYellow,
    },
    {
      label: "給料(現状)",
      count: "D15",
      total: "E15",
      bgcolor: colors.lightYellow,
    },
  ];

// Miscellaneous Salary Table (雑給料)
export const manufacturingLaborMiscRows: ManufacturingLaborRowDataType[] = [
  {
    label: "G6",
    unitPrice: "H6",
    count: "I6",
    total: "J6",
    bgcolor: colors.yellow,
  },
  {
    label: "G7",
    unitPrice: "H7",
    count: "I7",
    total: "J7",
    bgcolor: colors.yellow,
  },
  {
    label: "G8",
    unitPrice: "H8",
    count: "I8",
    total: "J8",
    bgcolor: colors.yellow,
  },
  {
    label: "G9",
    unitPrice: "H9",
    count: "I9",
    total: "J9",
    bgcolor: colors.yellow,
  },
  {
    label: "G10",
    unitPrice: "H10",
    count: "I10",
    total: "J10",
    bgcolor: colors.yellow,
  },
  {
    label: "G11",
    unitPrice: "H11",
    count: "I11",
    total: "J11",
    bgcolor: colors.yellow,
  },
  {
    label: "G12",
    unitPrice: "H12",
    count: "I12",
    total: "J12",
    bgcolor: colors.yellow,
  },
  {
    label: "G13",
    unitPrice: "H13",
    count: "I13",
    total: "J13",
    bgcolor: colors.yellow,
  },
];

export const manufacturingLaborMiscSummary: ManufacturingLaborSummaryRowDataType[] =
  [
    {
      label: "雑給料",
      count: "I14",
      total: "J14",
      bgcolor: colors.lightYellow,
    },
    {
      label: "雑給料(現状)",
      count: "I15",
      total: "J15",
      bgcolor: colors.lightYellow,
    },
  ];

// Dispatched Employees Table (派遣社員)
export const manufacturingLaborDispatchedRows: ManufacturingLaborRowDataType[] =
  [
    {
      label: "L6",
      unitPrice: "M6",
      count: "N6",
      total: "O6",
      bgcolor: colors.yellow,
    },
    {
      label: "L7",
      unitPrice: "M7",
      count: "N7",
      total: "O7",
      bgcolor: colors.yellow,
    },
    {
      label: "L8",
      unitPrice: "M8",
      count: "N8",
      total: "O8",
      bgcolor: colors.yellow,
    },
    {
      label: "L9",
      unitPrice: "M9",
      count: "N9",
      total: "O9",
      bgcolor: colors.yellow,
    },
    {
      label: "L10",
      unitPrice: "M10",
      count: "N10",
      total: "O10",
      bgcolor: colors.yellow,
    },
    {
      label: "L11",
      unitPrice: "M11",
      count: "N11",
      total: "O11",
      bgcolor: colors.yellow,
    },
    {
      label: "L12",
      unitPrice: "M12",
      count: "N12",
      total: "O12",
      bgcolor: colors.yellow,
    },
    {
      label: "L13",
      unitPrice: "M13",
      count: "N13",
      total: "O13",
      bgcolor: colors.yellow,
    },
  ];

export const manufacturingLaborDispatchedSummary: ManufacturingLaborSummaryRowDataType[] =
  [
    {
      label: "派遣社員費",
      count: "N14",
      total: "O14",
      bgcolor: colors.lightYellow,
    },
    {
      label: "派遣社員費(現状)",
      count: "N15",
      total: "O15",
      bgcolor: colors.lightYellow,
    },
  ];

// Average Annual Income Table (平均年収)
export const manufacturingLaborAverageIncomeRows: AverageIncomeRowDataType[] = [
  {
    label: "未来",
    value: "C18",
    percentage: "E18",
    bgcolor: colors.white,
  },
  {
    label: "現状",
    value: "C19",
    percentage: "E19",
    bgcolor: colors.white,
  },
];
