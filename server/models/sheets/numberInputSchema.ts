import { Schema } from "mongoose";

export const NumberInputSchema = new Schema({
  value: { type: Number, default: 0 },
  formula: {
    type: String,
    default: "",
  },
  sheet: {
    type: String,
    default: "",
  },
  absolutePath: {
    type: String,
    default: "",
  },
});
