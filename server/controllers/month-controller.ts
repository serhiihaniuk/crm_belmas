import MonthTotal from '../models/month-total-model';
import { DayCode, MonthCode } from 'date-types';
import { MonthRaw } from 'month-types';
import { Document } from 'mongoose';
import DayController from './day-controller';
import d from '../helpers/d';
import log from '../helpers/info';

const controllerName = 'MonthController.';
const logInfo = (method: string, message: string): void => {
	log.info(`${controllerName}${method}`, message);
};
type MonthMongooseResponse = Document<any, any, MonthRaw> & MonthRaw & { _id: string };

class MonthController {
	static async getMonthByCode(monthCode: MonthCode, populate: string[] = []): Promise<MonthMongooseResponse> {
		logInfo('getMonthByCode', `Start monthCode: ${monthCode}`);
		try {
			let month = await MonthTotal.findOne({ monthCode: monthCode });
			if (!month) {
				log.info(`${controllerName}getMonthByCode`, `Month not found, creating new`);
				month = await MonthController.createMonth(monthCode);
			}

			logInfo('getMonthByCode', `Success! month: ${JSON.stringify(month.month)}`);
			return month;
		} catch (e) {
			log.error(`${controllerName}getMonthByCode`, `Error: ${e}`);
			throw e;
		}
	}

	static async createMonth(monthCode: MonthCode): Promise<MonthMongooseResponse> {
		logInfo('createMonth', `monthCode: ${monthCode}`);

		try {
			const newMonth = await new MonthTotal({
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

			await newMonth.save();

			const dayCodesInMonth: DayCode[] = d.prepareDaysCodesInMonth(monthCode);

			for (let dayCode of dayCodesInMonth) {
				await DayController.getDayByCode(dayCode);
			}

			const newMonthLatest = await MonthController.getMonthByCode(monthCode);
			logInfo('createMonth', `newMonth: ${JSON.stringify(newMonthLatest)}`);

			return newMonthLatest;
		} catch (e) {
			log.error(`${controllerName}createMonth`, `Error: ${e}`);
			throw e;
		}
	}

	static async getMonthStats(monthCode: MonthCode): Promise<MonthMongooseResponse> {
		logInfo('getMonthStats', `monthCode: ${monthCode}`);

		try {
			await MonthController.getMonthByCode(monthCode)
			let month = await MonthTotal.findOne({ monthCode: monthCode })
				.populate('appointments')
				.populate('expenses')
				.populate('salaryTables');

			if (!month) {
				log.error(`${controllerName}getMonthStats`, `Month not found`);
				month = await MonthController.createMonth(monthCode);
			}
			const totalEarnings = month.appointments.reduce(
				//@ts-ignore
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
			logInfo('getMonthStats', `totalEarnings: ${JSON.stringify(totalEarnings)}`);

			const totalExpenses = month.expenses.reduce(
				//@ts-ignore
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
			logInfo('getMonthStats', `totalExpenses: ${JSON.stringify(totalExpenses)}`);

			const totalSalary = month.salaryTables.reduce(
				//@ts-ignore
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
			logInfo('getMonthStats', `totalSalary: ${JSON.stringify(totalSalary)}`);

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
			if (!updatedMonth) throw new Error('Month not found');

			logInfo('getMonthStats', `updatedMonth: ${JSON.stringify(updatedMonth.month)}`);
			return updatedMonth;
		} catch (e) {
			log.error(`${controllerName}getMonthStats`, `Error: ${e}`);
			throw e;
		}
	}
}

export default MonthController;
