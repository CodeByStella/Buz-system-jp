import { Schema } from "mongoose";

export const NumberInputSchema = new Schema({
  value: { type: Number },
  formula: {
    type: String,
    default: "",
  },
  sheet: {
    type: String,
    defalut: "",
  },
  absolutePath: {
    type: String,
    default: "",
  },
});
