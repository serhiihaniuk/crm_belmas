import Expenses from '../models/expenses-model';
import MonthController from './month-controller';
import { MonthCode } from 'date-types';
import { MongoResponse } from './controller-types';
import { IExpenseRaw } from 'expenses-types';
import log from '../helpers/info';
import MonthTotal from '../models/month-total-model';

const controllerName = 'ExpensesController.';
const logInfo = (method: string, message: string, a: any = ''): void => {
	log.info(`${controllerName}${method}`, message, a);
};

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
	static async addNewExpense({ ExpenseInput }: { ExpenseInput: IExpenseInput }): Promise<MongoResponse<IExpenseRaw>> {
		logInfo('addNewExpense', `Adding new expense: ${JSON.stringify(ExpenseInput)}`);
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

			logInfo('addNewExpense', `Saving new expense`);

			const savedExpense = await newExpense.save();
			await MonthTotal.findByIdAndUpdate(month.id, {
				$push: { expenses: savedExpense }
			});

			logInfo('addNewExpense', `Success! Saved new expense:`, newExpense);
			return savedExpense;
		} catch (error) {
			log.error(`${controllerName}addNewExpense`, `Error while adding new expense: ${error}`);
			throw error;
		}
	}

	static async editExpense({
		ExpenseID,
		ExpenseInput
	}: {
		ExpenseID: string;
		ExpenseInput: IExpenseInput;
	}): Promise<MongoResponse<IExpenseRaw>> {
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

	static async deleteExpense({ ExpenseID }: { ExpenseID: string }): Promise<'success'> {
		logInfo('deleteExpense', `Deleting expense with ID: ${ExpenseID}`);
		try {
			const expense = await Expenses.findOneAndDelete({
				_id: ExpenseID
			});

			logInfo('deleteExpense', `Deleted expense`, expense);

			if (!expense) {
				log.error('deleteExpense', `Expense with ID: ${ExpenseID} not found`);
				throw new Error('Expense not found');
			}

			const month = await MonthTotal.findOne({
				monthCode: expense.monthCode
			});

			if (!month) {
				log.error('deleteExpense', `month not found`);
				throw new Error('month not found');
			}

			logInfo('deleteExpense', `Month found, pulling expense`);

			//@ts-ignore
			month.expenses.pull(expense);
			await month.save();

			logInfo('deleteExpense', `Success! Deleted expense`);
			return 'success';
		} catch (error) {
			log.error('deleteExpense', `Error while deleting expense with ID: ${ExpenseID}`);
			throw error;
		}
	}

	static async getExpensesByMonth({ monthCode }: { monthCode: MonthCode }): Promise<MongoResponse<IExpenseRaw>[]> {
		logInfo('getExpensesByMonth', `Getting expenses for month: ${monthCode}`);
		try {
			const month = await MonthController.getMonthByCode(monthCode);
			const expensesByMonth = await Expenses.find({ month: month }).sort({ date: 1 });

			if (!expensesByMonth) {
				log.error('getExpensesByMonth', `No expenses found for month: ${monthCode}`);
				throw new Error('No expenses found');
			}

			logInfo('getExpensesByMonth', `Got expenses for month: ${monthCode}, length: ${expensesByMonth.length}`);
			return expensesByMonth;
		} catch (error) {
			log.error('getExpensesByMonth', `Error while getting expenses for month: ${monthCode}`);
			throw error;
		}
	}
}

export default ExpensesController;
