import { Document } from 'mongoose';
import { DayCode } from 'date-types';

export type MongoResponse<T> = Document<any, any, T> & T & { _id: string };

export interface IGetDaysInRange {
	from: DayCode;
	to: DayCode;
    employeeID: string;
}