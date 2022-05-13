import {DayCode, MonthCode, Timestamp} from './date-types';

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
    month: string;
    tips: number;
    payments: ISalaryPaymentRaw[];
}

export interface ISalaryPaymentRaw {
    _id: string;
    payedCash: number;
    payedCashless: number;
    date: Timestamp;
    dayCode: DayCode;
    monthCode: MonthCode;
    salaryTableCode: ISalaryTableCode;
}

export interface IPayment extends ISalaryPaymentRaw {
    id: string;
}

export interface IAddSalaryPayment {
    addSalaryPayment: ISalaryPaymentRaw;
}

export type ISalaryPaymentInput = Omit<ISalaryPaymentRaw, "_id">


export type ISalaryTableCode = `${MonthCode}_${string}`