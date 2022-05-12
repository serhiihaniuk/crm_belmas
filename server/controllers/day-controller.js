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
            console.error(e);
			throw e;
		}
	}

	static async createDay(dayCode) {
        const [year, month, day] = dayCode.split('-');
		const newDay = new Day({
            dayCode: dayCode,
            year: year,
            month: month,
            day: day,
            appointments: [],
            dayOff: []
        })
        try {
            return await newDay.save();
        }
        catch (e) {
            console.error(e);
            throw e;
        }
	}
}

export default DayController;
