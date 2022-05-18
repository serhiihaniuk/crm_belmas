import DayOff from '../models/day-off-model';
import Employee from '../models/employee-model';
import DayController from './day-controller';
import { DayCode } from 'date-types';
import { MongoResponse } from './controller-types';
import {IDayOffRaw} from 'day-types';
import log from "../helpers/info";

const controllerName = 'DayOffController.';
const logInfo = (method: string, message: string) => {
    log.info(`${controllerName}${method}`,  message);
}

class DayOffController {
	static async createDayOff(dayCode: DayCode, employeeID: string): Promise<MongoResponse<IDayOffRaw>> {
        logInfo('createDayOff', `Creating day off for employee ${employeeID} on ${dayCode}`);
		try {
			let day = await DayController.getDayByCode(dayCode);
			const employee = await Employee.findById(employeeID);

			if (!employee) {
				log.error(`${controllerName}createDayOff`, `Employee ${employeeID} not found`);
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


            logInfo('createDayOff', `Day off created for employee ${employee.name} on ${dayCode}`);
			return dayOffSaved;
		} catch (e: any) {
            log.error(`${controllerName}createDayOff`, `Error creating day off for employee ${employeeID} on ${dayCode}`);
			throw new Error(e);
		}
	}

	static async deleteDayOff(dayOffID: string):Promise<MongoResponse<IDayOffRaw>> {

        logInfo('deleteDayOff', `Deleting day off ${dayOffID}`);

		try {
			const dayOff = await DayOff.findById(dayOffID);

			if (!dayOff) {
                log.error(`${controllerName}deleteDayOff`, `Day off ${dayOffID} not found`);
				throw new Error('No day off found while deleting day off');
			}

			const day = await DayController.getDayByCode(dayOff.dayCode);

			if (!day) {
                log.error(`${controllerName}deleteDayOff`, `Day ${dayOff.dayCode} not found`);
				throw new Error('No day found while deleting day off');
			}


            //@ts-ignore
			day.dayOff.pull(dayOff);
			await day.save();
			await dayOff.remove();

            logInfo('deleteDayOff', `Day off ${dayOffID} deleted`);

			return dayOff;
		} catch (e: any) {
            log.error(`${controllerName}deleteDayOff`, `Error deleting day off ${dayOffID}`);
			throw new Error(e);
		}
	}
}


export default DayOffController;
