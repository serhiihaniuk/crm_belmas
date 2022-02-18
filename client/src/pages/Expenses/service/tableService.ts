import { timestampToDate } from '../../../helpers/utils';
import {IPayment} from "../../../gql/query/salary";

export const headers = [
    {
        key: 'date',
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

interface IExpense {
    _id: string;
    date: string;
    description: string;
    category: string;
    cash: number;
    cashless: number;
}

export interface IExpenseItem {
    id: string;
    date: string;
    description: string;
    category: string;
    cash: number;
    cashless: number;
    fullDate: string;
}

export function CreateExpensesRows(expenses: IExpense[]): IExpenseItem[] {
    return expenses.map((expense) => {
        return {
            id: expense._id,
            date: timestampToDate(+expense.date, 'MM-DD', '.'),
            description: expense.description,
            category: expense.category,
            cash: expense.cash,
            cashless: expense.cashless,
            fullDate: expense.date
        };
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
    id: string
    cash: number
    cashless: number
}
export function CreateSalaryPaymentsRows(payments: IPayment[]): ISalaryTableRow[] {
    return payments.map((payment) => {
        return {
            id: payment._id,
            date: timestampToDate(+payment.date, 'MM-DD', '.'),
            cash: payment.payedCash,
            cashless: payment.payedCashless,

        };
    });
}
