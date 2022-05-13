import { timestampToDate } from '../../../helpers/utils';
import { IExpense, IExpenseRaw } from '../../../types/expenses-types';
import {DayCode, MonthCode} from '../../../types/date-types';
import {IPayment, ISalaryPaymentRaw, ISalaryTableCode} from "../../../types/salary-types";

export const headers = [
    {
        key: 'monthCode',
        header: 'Дата'
    },
    {
        key: 'description',
        header: 'Описание'
    },
    {
        key: 'category',
        header: 'Кат'
    },
    {
        key: 'cash',
        header: 'Нал'
    },
    {
        key: 'cashless',
        header: 'Безнал'
    }
];

export function CreateExpensesRows(expenses: IExpenseRaw[]): IExpense[] {
    return expenses.map((expense) => {
        return { ...expense, id: expense._id };
    });
}

export const salaryTableHeaders = [
    {
        key: 'date',
        header: 'Дата'
    },
    {
        key: 'cash',
        header: 'Нал'
    },
    {
        key: 'cashless',
        header: 'Безнал'
    }
];



export function CreateSalaryPaymentsRows(payments: ISalaryPaymentRaw[]): IPayment[] {
    return payments.map((payment) => {
        return {
            id: payment._id,
            ...payment
        };
    });
}

export function PrepareSalaryTableCode(monthCode: MonthCode, employeeID: string): ISalaryTableCode {
  return `${monthCode}_${employeeID}`;
}
