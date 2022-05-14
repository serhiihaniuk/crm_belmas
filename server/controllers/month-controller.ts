import MonthTotal from '../models/month-total-model';
import { MonthCode } from 'date-types';
import { MonthRaw } from 'month-types';
import { Document } from 'mongoose';

type MonthMongooseResponse = Document<any, any, MonthRaw> & MonthRaw & { _id: string };

class MonthController {
	static async getMonthByCode(monthCode: MonthCode): Promise<MonthMongooseResponse> {
		try {
			let month = await MonthTotal.findOne({ monthCode: monthCode });
			if (!month) {
				month = await MonthController.createMonth(monthCode);
			}
			return month;
		} catch (e) {
			throw e;
		}
	}

	static async createMonth(monthCode: MonthCode): Promise<MonthMongooseResponse> {
		const newMonth = new MonthTotal({
			monthCode: monthCode,
			month: monthCode.slice(-2),
			year: monthCode.substring(0, 4),
			cashlessAtTheBeginning: 0,
			cash: 0,
			cashless: 0,
			currentCashless: 0,
			currentCash: 0,
			expensesCashless: 0,
			expensesCash: 0,
			salaryCashless: 0,
			salaryCash: 0
		});
		try {
			return await newMonth.save();
		} catch (e) {
			throw e;
		}
	}

	static async getMonthStats(monthCode: MonthCode): Promise<MonthMongooseResponse> {
		try {
			let month = await MonthTotal.findOne({ monthCode: monthCode })
				.populate('appointments')
				.populate('expenses')
				.populate('salaryTables');
			if (!month) {
				month = await MonthController.createMonth(monthCode);
			}
			const totalEarnings = month.appointments.reduce(
				(acc, curr) => {
					acc.cash += curr.cash;
					acc.cashless += curr.cashless;
					return acc;
				},
				{
					cash: 0,
					cashless: 0
				}
			);
			const totalExpenses = month.expenses.reduce(
				(acc, curr) => {
					acc.cash += curr.cash;
					acc.cashless += curr.cashless;
					return acc;
				},
				{
					cash: 0,
					cashless: 0
				}
			);
			const totalSalary = month.salaryTables.reduce(
				(acc, curr) => {
					acc.cash += curr.payedCash;
					acc.cashless += curr.payedCashless;
					return acc;
				},
				{
					cash: 0,
					cashless: 0
				}
			);
            const updatedMonth = await MonthTotal.findOneAndUpdate(
                { monthCode: monthCode },
                {
                    $set: {
                        cash: totalEarnings.cash,
                        cashless: totalEarnings.cashless,
                        expensesCash: totalExpenses.cash,
                        expensesCashless: totalExpenses.cashless,
                        salaryCash: totalSalary.cash,
                        salaryCashless: totalSalary.cashless,
                        currentCash: totalEarnings.cash - totalSalary.cash - totalExpenses.cash,
                        currentCashless:
                            month.cashlessAtTheBeginning +
                            totalEarnings.cashless -
                            totalExpenses.cashless -
                            totalSalary.cashless
                    }
                },
                { new: true }
            );
            if(!updatedMonth) throw new Error('Month not found');
			return updatedMonth
		} catch (e) {
			console.error(e);
			throw e;
		}
	}
}

export default MonthController;
