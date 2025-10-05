import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const ManufacturingCostPersonSheetSchema = new Schema(
  {
    // 人件費明細 (Personnel Cost Details)
    personnelCostDetails: {
      // 社員ごとの明細 (Details for each employee)
      employees: [
        {
          name: { type: String, required: true }, // 社員名 (e.g., 社員1, 社員2)
          unitPrice: { type: Number, default: 0 }, // 単価 (Unit price per employee in millions of yen)
          numberOfPeople: { type: Number, default: 0 }, // 人数 (Number of people)
          total: { type: Number, default: 0 }, // 合計 (Total cost for this employee entry)
        },
      ],
      summary: {
        // 社員給料合計 (Total for employee salaries)
        employeeSalaries: {
          numberOfPeople: { type: Number, default: 0 }, // 社員人数合計 (Total number of employees)
          total: { type: Number, default: 0 }, // 社員給料合計金額 (Total salary for employees)
        },
        // 現状給料合計 (Current total salaries)
        currentSalaries: {
          numberOfPeople: { type: Number, default: 0 }, // 現状社員人数 (Current number of employees)
          total: { type: Number, default: 0 }, // 現状給料合計金額 (Current total salary)
        },
      },
    },

    // 雑給料 (Miscellaneous Salaries)
    miscellaneousSalaries: {
      // パート従業員 (Part-time employees)
      partTimeEmployees: [
        {
          name: { type: String, required: true }, // パート名 (e.g., パート1, パート2)
          unitPrice: { type: Number, default: 0 }, // 単価 (Unit price per part-timer in millions of yen)
          numberOfPeople: { type: Number, default: 0 }, // 人数 (Number of part-timers)
          total: { type: Number, default: 0 }, // 合計 (Total cost for this part-timer entry)
        },
      ],
      // アルバイト従業員 (Arbeit/Temporary employees)
      arbeitEmployees: [
        {
          name: { type: String, required: true }, // アルバイト名 (e.g., アルバイト1, アルバイト2)
          unitPrice: { type: Number, default: 0 }, // 単価 (Unit price per arbeit in millions of yen)
          numberOfPeople: { type: Number, default: 0 }, // 人数 (Number of arbeit)
          total: { type: Number, default: 0 }, // 合計 (Total cost for this arbeit entry)
        },
      ],
      summary: {
        // 雑給料合計 (Total for miscellaneous salaries)
        miscellaneousSalaries: {
          numberOfPeople: { type: Number, default: 0 }, // 雑給料人数合計 (Total number of miscellaneous salary recipients)
          total: { type: Number, default: 0 }, // 雑給料合計金額 (Total miscellaneous salaries)
        },
        // 現状雑給料合計 (Current total miscellaneous salaries)
        currentMiscellaneousSalaries: {
          numberOfPeople: { type: Number, default: 0 }, // 現状雑給料人数 (Current number of miscellaneous salary recipients)
          total: { type: Number, default: 0 }, // 現状雑給料合計金額 (Current total miscellaneous salaries)
        },
      },
    },

    // 派遣社員 (Dispatched Employees)
    dispatchedEmployees: {
      // 派遣社員明細 (Dispatched employee details)
      dispatched: [
        {
          name: { type: String, required: true }, // 派遣社員名 (e.g., 派遣社員1, 派遣社員2)
          unitPrice: { type: Number, default: 0 }, // 単価 (Unit price per dispatched employee in millions of yen)
          numberOfPeople: { type: Number, default: 0 }, // 人数 (Number of dispatched employees)
          total: { type: Number, default: 0 }, // 合計 (Total cost for this dispatched employee entry)
        },
      ],
      // 契約社員明細 (Contract employee details)
      contract: [
        {
          name: { type: String, required: true }, // 契約社員名 (e.g., 契約社員1, 契約社員2)
          unitPrice: { type: Number, default: 0 }, // 単価 (Unit price per contract employee in millions of yen)
          numberOfPeople: { type: Number, default: 0 }, // 人数 (Number of contract employees)
          total: { type: Number, default: 0 }, // 合計 (Total cost for this contract employee entry)
        },
      ],
      summary: {
        // 派遣社員費用合計 (Total for dispatched employee costs)
        dispatchedEmployeeCosts: {
          numberOfPeople: { type: Number, default: 0 }, // 派遣社員人数合計 (Total number of dispatched employees)
          total: { type: Number, default: 0 }, // 派遣社員費用合計金額 (Total dispatched employee costs)
        },
        // 現状派遣社員費用合計 (Current total dispatched employee costs)
        currentDispatchedEmployeeCosts: {
          numberOfPeople: { type: Number, default: 0 }, // 現状派遣社員人数 (Current number of dispatched employees)
          total: { type: Number, default: 0 }, // 現状派遣社員費用合計金額 (Current total dispatched employee costs)
        },
      },
    },

    // 平均年収 (Average Annual Income)
    averageAnnualIncome: {
      future: { type: Number, default: 0 }, // 未来の平均年収 (Future average annual income, in millions of yen)
      currentStatus: { type: Number, default: 0 }, // 現状の平均年収 (Current average annual income, in millions of yen)
      increaseRate: { type: Number, default: 0 }, // 上昇率 (Increase rate, percentage)
    },
  },
  {
    timestamps: true, // 作成日時・更新日時 (Created/Updated timestamps)
  }
);

export type ManufacturingCostPersonSheetDocument = InferSchemaType<
  typeof ManufacturingCostPersonSheetSchema
> & { _id: mongoose.Types.ObjectId };

export const ManufacturingCostPersonSheet: Model<ManufacturingCostPersonSheetDocument> =
  mongoose.models.ManufacturingCostPersonSheet ||
  mongoose.model<ManufacturingCostPersonSheetDocument>(
    "ManufacturingCostPersonSheet",
    ManufacturingCostPersonSheetSchema,
    "manufacturing_cost_person_sheets"
  );
