import Expenses from '../models/expenses-model.js';
import MonthController from './month-controller.js';

class ExpensesController {
    static async addNewExpense({ExpenseInput}) {
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

    static async editExpense({ExpenseID, ExpenseInput}) {
        const expense = {
            cash: ExpenseInput.cash,
            cashless: ExpenseInput.cashless,
            category: ExpenseInput.category,
            invoice: ExpenseInput.invoice,
            description: ExpenseInput.description
        };

        try {
            return await Expenses.findByIdAndUpdate(ExpenseID, expense, {
                new: true
            });
        } catch (error) {
            throw error;
        }
    }

    static async deleteExpense({ExpenseID}) {
        try {
            const expense = await Expenses.findById(ExpenseID);
            await expense.delete();

            return 'success';
        } catch (error) {
            throw error;
        }
    }

    static async getExpensesByMonth({monthCode}) {
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
