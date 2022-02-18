const MonthTotal = require('../models/month-total-model');

class MonthController {
	static async getMonthByCode(monthCode) {
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

	static async createMonth(monthCode) {
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
			expensesCash: 0
		});
		try {
			return await newMonth.save();
		} catch (e) {
			throw e;
		}
	}

	static async getMonthStats(monthCode) {
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

			const totalEarningsCash = totalEarnings.cash;
			const totalEarningsCashless = totalEarnings.cashless;
			const totalExpensesCash = totalExpenses.cash + totalSalary.cashless;
			const totalExpensesCashless = totalExpenses.cashless + totalSalary.cash;
			return await MonthTotal.findOneAndUpdate(
				{ monthCode: monthCode },
				{
					$set: {
						cash: totalEarnings.cash,
						cashless: totalEarnings.cashless,
						expensesCash: totalExpenses.cash,
						expensesCashless: totalExpenses.cashless,
						salaryCash: totalSalary.cash,
						salaryCashless: totalSalary.cashless,
						currentCash: totalEarningsCash - totalExpensesCash,
						currentCashless:
							month.cashlessAtTheBeginning +
							totalEarnings.cashless -
							totalExpenses.cashless -
							totalSalary.cashless
					}
				},
				{ new: true }
			);
		} catch (e) {
			throw e;
		}
	}
}

module.exports = MonthController;
