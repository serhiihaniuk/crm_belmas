import Expenses from '../models/expenses-model';
import MonthController from './month-controller';
import {MonthCode} from 'date-types';
import {MongoResponse} from './controller-types';
import {IExpenseRaw} from 'expenses-types';

interface IExpenseInput {
    cash: number;
    cashless: number;
    monthCode: MonthCode;
    invoice: boolean;
    category: string;
    description: string;
    date: string;
}

class ExpensesController {

    static async addNewExpense({ExpenseInput}: { ExpenseInput: IExpenseInput }): Promise<MongoResponse<IExpenseRaw>> {
        try {
            const month = await MonthController.getMonthByCode(ExpenseInput.monthCode);

            const newExpense = new Expenses({
                cash: ExpenseInput.cash,
                cashless: ExpenseInput.cashless,
                month: month,
                monthCode: ExpenseInput.monthCode,
                date: new Date(ExpenseInput.date),
                category: ExpenseInput.category,
                invoice: ExpenseInput.invoice,
                description: ExpenseInput.description
            });

            await newExpense.save();

            return await newExpense.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    static async editExpense({
                                 ExpenseID,
                                 ExpenseInput
                             }: { ExpenseID: string, ExpenseInput: IExpenseInput }): Promise<MongoResponse<IExpenseRaw>> {
        const expense = {
            cash: ExpenseInput.cash,
            cashless: ExpenseInput.cashless,
            category: ExpenseInput.category,
            invoice: ExpenseInput.invoice,
            description: ExpenseInput.description
        };

        try {
            const updatedExpense = await Expenses.findByIdAndUpdate(ExpenseID, expense, {
                new: true
            });
            if (!updatedExpense) {
                throw new Error('Expense not found');
            }
            return updatedExpense;
        } catch (error) {
            throw error;
        }
    }

    static async deleteExpense({ExpenseID}: { ExpenseID: string }): Promise<'success'> {
        try {
            const expense = await Expenses.findById(ExpenseID);
            if (!expense) throw new Error('Expense not found');
            await expense.delete();

            return 'success';
        } catch (error) {
            throw error;
        }
    }

    static async getExpensesByMonth({monthCode}: { monthCode: MonthCode }) {
        try {
            const month = await MonthController.getMonthByCode(monthCode);
            return await Expenses.find({month: month}).sort({date: 1});
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default ExpensesController;
