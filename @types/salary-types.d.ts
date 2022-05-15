import {DayCode, MonthCode} from './date-types';
import {MonthRaw} from "./month-types";
import {IEmployee} from "./employee-types";

export interface IGetSalaryTablesQuery {
    getSalaryTablesByMonth: ISalaryTable[];
}

export interface ISalaryTable {
    salaryTableCode: ISalaryTableCode;
    _id: string;
    employee: {
        _id: string;
        name: string;
    };
    totalEarned: number;
    payedCash: number;
    payedCashless: number;
    month: MonthRaw;
    tips: number;
    payments: ISalaryPaymentRaw[];
}

export interface ISalaryPaymentRaw {
    _id: string;
    payedCash: number;
    payedCashless: number;
    date: Date;
    dayCode: DayCode;
    monthCode: MonthCode;
    salaryTableCode: ISalaryTableCode;
    employee: IEmployee;
    month: MonthRaw;
}

export interface IPayment extends ISalaryPaymentRaw {
    id: string;
}

export interface IAddSalaryPayment {
    addSalaryPayment: ISalaryPaymentRaw;
}

export type ISalaryPaymentInput = Omit<ISalaryPaymentRaw, "_id">


export type ISalaryTableCode = `${MonthCode}_${string}`