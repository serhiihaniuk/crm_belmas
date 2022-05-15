import DayOff from '../models/day-off-model';
import Employee from '../models/employee-model';
import DayController from './day-controller';
import { DayCode } from 'date-types';
import { MongoResponse } from './controller-types';
import {IDayOffRaw} from 'day-types';

class DayOffController {
	static async createDayOff(dayCode: DayCode, employeeID: string): Promise<MongoResponse<IDayOffRaw>> {
		try {
			let day = await DayController.getDayByCode(dayCode);
			const employee = await Employee.findById(employeeID);

			if (!employee) {
				console.error('No employee found while creating day off');
				throw new Error('No employee found while creating day off');
			}

			const dayOff = {
				dayCode: dayCode,
				employee: employee,
				day: day
			};

			const dayOffCreated = await new DayOff(dayOff);
			const dayOffSaved = await dayOffCreated.save();

			day.dayOff.push(dayOffSaved);
			await day.save();

			return dayOffSaved;
		} catch (e: any) {
			console.error(e);
			throw new Error(e);
		}
	}

	static async deleteDayOff(dayOffID: string):Promise<MongoResponse<IDayOffRaw>> {
		try {
			const dayOff = await DayOff.findById(dayOffID);

			if (!dayOff) {
				console.error('No day off found while deleting day off');
				throw new Error('No day off found while deleting day off');
			}

			const day = await DayController.getDayByCode(dayOff.dayCode);

			if (!day) {
				console.error('No day found while deleting day');
				throw new Error('No day found while deleting day off');
			}


            //@ts-ignore
			day.dayOff.pull(dayOff);
			await day.save();

			await dayOff.remove();
			return dayOff;
		} catch (e: any) {
			console.error(e);
			throw new Error(e);
		}
	}
}
