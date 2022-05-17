import {MonthCode} from "./date-types";
import {IAppointmentRaw} from "./appointment-types";
import {IExpenseRaw} from "./expenses-types";
import {ISalaryTable} from "./salary-types";
import {IDayRaw} from "./day-types";

export interface MonthRaw {
    _id: string;
    month: MonthCode;
    year: string;
    cashlessAtTheBeginning: number;
    cashAtTheBeginning: number;
    currentCash: number;
    currentCashless: number;
    cash: number;
    cashless: number;
    expensesCash: number;
    expensesCashless: number;
    salaryCash: number;
    salaryCashless: number;
    appointments: IAppointmentRaw[];
    expenses: IExpenseRaw[];
    salaryTables: ISalaryTable[];
    days: IDayRaw[];
    status: 'closed' | 'active';
}