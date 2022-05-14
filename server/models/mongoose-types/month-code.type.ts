import { MonthCode } from 'date-types';
import mongoose from "mongoose";

export class monthCodeConstructor extends mongoose.SchemaType {
  constructor(key: string, options?: any) {
    super(key, options, 'monthCode');
  }
  cast(val: MonthCode): MonthCode {
    return val;
  }
}