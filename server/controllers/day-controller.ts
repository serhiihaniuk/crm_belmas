import Day from '../models/day-model';
import { DayCode, Iday, Imonth, Iyear, MonthCode } from 'date-types';
import { IGetDaysInRange, MongoResponse } from './controller-types';
import { IDayRaw } from 'day-types';
import log from '../helpers/info';
import d from '../helpers/d';
import MonthController from './month-controller';

const controllerName = 'DayController.';
const logInfo = (method: string, message: string, a: any = ''): void => {
	log.info(controllerName + method, message, a);
};

class DayController {
	static async getDayByCode(dayCode: DayCode): Promise<MongoResponse<IDayRaw>> {
		logInfo('getDayByCode', `get day: ${dayCode}`);

		try {
			let day = await Day.findOne({ dayCode: dayCode });
			if (!day) {
				day = await DayController.createDay(dayCode);
			}
			logInfo('getDayByCode', `day: ${day._id}`);
			return day;
		} catch (e) {
			log.error(`${controllerName}getDayByCode`, 'error: ' + e);
			throw e;
		}
	}

	/**
	 * getDaysInRange - get days for particular employee
	 */
	static async getDaysInRange({ from, to, employeeID }: IGetDaysInRange) {
		logInfo('getDaysInRange', `Start!`, { from, to, employeeID });

		const monthsInRange = d.mapMonthCodesBetweenDates(from, to);

		for (let month of monthsInRange) {
			await MonthController.getMonthByCode(month);
		}

		const daysInRange = await Day.find({
			date: {
				$gte: d.prepareCustomTimestamp(from) - 1,
				$lte: d.prepareCustomTimestamp(to) + 1
			}
		})
			.populate('appointments', undefined, undefined, { employee: employeeID })
			.populate('dayOff', undefined, undefined, { employee: employeeID });

		daysInRange.forEach((day) => {
			if (day.dayOff[0]?.dayCode) day.isOff = true;
		});

		logInfo('getDaysInRange', `Success! days: ${daysInRange.length}`);
		return daysInRange;
	}

	static async createDay(dayCode: DayCode): Promise<MongoResponse<IDayRaw>> {
		logInfo('createDay', `create day: ${dayCode}`);
		try {
			const [year, month, day] = dayCode.split('-') as [Iyear, Imonth, Iday];
			const monthCode: MonthCode = `${year}-${month}`;

			const monthTable = await MonthController.getMonthByCode(monthCode);

			if (!monthTable) {
				log.error(`${controllerName}createDay`, `month ${monthCode} not found`);
				throw new Error(`Month ${monthCode} does not exist`);
			}

			const newDay = new Day({
				dayCode: dayCode,
				year: year,
				month: month,
				day: day,
				date: d.prepareCustomTimestamp(dayCode),
				appointments: [],
				dayOff: []
			});

			const savedNewDay = await newDay.save();
			monthTable.days.push(newDay);
			await monthTable.save();

			logInfo('createDay', `day: ${savedNewDay._id}`);

			return savedNewDay;
		} catch (e) {
			log.error(`${controllerName}createDay`, 'error: ' + e);
			throw e;
		}
	}
}

export default DayController;
