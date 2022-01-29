import {timestampToDate} from "../../../helpers/utils";

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
  _id: number;
  date: string;
  description: string;
  category: string;
  cash: number;
  cashless: number;
}

export function CreateExpensesRows(expenses: IExpense[]) {
  return expenses.map((expense) => {
    return {
      id: expense._id,
      date: timestampToDate(+expense.date, 'MM-DD', '.'),
      description: expense.description,
      category: expense.category,
      cash: expense.cash,
      cashless: expense.cashless
    };
  });
}
