import Day from '../models/day-model';
import {DayCode, Iday, Imonth, Iyear, MonthCode} from 'date-types';
import {MongoResponse} from './controller-types';
import {IDayRaw} from 'day-types';
import MonthController from "./month-controller";
import log from "../helpers/info";

const controllerName = 'DayController.';
const logInfo = (method: string, message: string): void => {
    log.info(controllerName + method, message);
}

class DayController {
    static async getDayByCode(dayCode: DayCode): Promise<MongoResponse<IDayRaw>> {

        logInfo('getDayByCode', `get day: ${dayCode}`);

        try {
            let day = await Day.findOne({dayCode: dayCode});
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

    static async createDay(dayCode: DayCode): Promise<MongoResponse<IDayRaw>> {

        logInfo('createDay', `create day: ${dayCode}`);
        try {
            const [year, month, day] = dayCode.split('-') as [Iyear, Imonth, Iday]
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
                appointments: [],
                dayOff: []
            });

            const savedNewDay = await newDay.save();
             monthTable.days.push(newDay);
            await monthTable.save();

            logInfo('createDay', `day: ${savedNewDay._id}`);

            return savedNewDay
        } catch (e) {
            log.error(`${controllerName}createDay`, 'error: ' + e);
            throw e;
        }
    }
}

export default DayController;
