import { MonthCode, Timestamp } from './date-types';

export interface IExpenseRaw {
    _id: string;
    date: Timestamp;
    description: string;
    category: string;
    cash: number;
    cashless: number;
    monthCode: MonthCode;
}


export interface IExpense extends IExpenseRaw {
    id: string;
}
export interface IGetExpensesByMonth {
    getExpensesByMonth: IExpenseRaw[];
}

export interface IExpenseInput {
    description: string;
    cash: number;
    cashless: number;
    date: string;
    monthCode: MonthCode;
    category: string;
    invoice: boolean;
}