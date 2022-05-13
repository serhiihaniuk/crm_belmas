// @ts-nocheck

import DayOff from '../models/day-off-model';
import Employee from '../models/employee-model';
import DayController from './day-controller';

class DayOffController {
	static async createDayOff(dayCode, employeeID) {
		try {
			let day = await DayController.getDayByCode(dayCode);
			const employee = await Employee.findById(employeeID);

			if (!employee) {
				console.error('No employee found while creating day off');
				return new Error('No employee found while creating day off');
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
		} catch (e) {
			console.error(e);
			return new Error(e);
		}
	}

	static async deleteDayOff(dayOffID) {
		try {
			const dayOff = await DayOff.findById(dayOffID);

			if (!dayOff) {
				console.error('No day off found while deleting day off');
				return new Error('No day off found while deleting day off');
			}

			const day = await DayController.getDayByCode(dayOff.dayCode);
			day.dayOff.pull(dayOff);
			await day.save();

			await dayOff.remove();
			return dayOff;
		} catch (e) {
			console.error(e);
			return new Error(e);
		}
	}
}
