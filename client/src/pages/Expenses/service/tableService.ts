import { timestampToDate } from '../../../helpers/utils';
import { IPayment } from '../../../gql/query/salary';
import {IExpense, IExpenseRaw} from '../../../types/expenses-types';

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

export interface ISalaryTableRow {
    id: string;
    cash: number;
    cashless: number;
}

export function CreateSalaryPaymentsRows(payments: IPayment[]): ISalaryTableRow[] {
    return payments.map((payment) => {
        return {
            id: payment._id,
            date: timestampToDate(+payment.date, 'DayCode'),
            cash: payment.payedCash,
            cashless: payment.payedCashless
        };
    });
}
