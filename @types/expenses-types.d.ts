import {MonthCode} from "./date-types";
import {MonthRaw} from "./month-types";

export interface IExpenseRaw {
    _id: string;
    date: Date;
    description: string;
    category: string;
    cash: number;
    cashless: number;
    monthCode: MonthCode;
    month: MonthRaw;
    invoice: boolean;
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