import Day from '../models/day-model.js';

class DayController {
	static async getDayByCode(dayCode) {
		try {
			let day = await Day.findOne({ dayCode: dayCode });
			if (!day) {
				day = await DayController.createDay(dayCode);
			}
			return day;
		} catch (e) {
			throw e;
		}
	}

	static createDay(dayCode) {
		const newDay = new Day({
            dayCode: dayCode,
            appointments: [],
            dayOff: []
        })
        try {
            return newDay.save();
        }
        catch (e) {
            console.error(e);
            throw e;
        }
	}
}

export default DayController;
