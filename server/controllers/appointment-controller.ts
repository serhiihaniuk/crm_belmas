// @ts-nocheck
import Appointment from '../models/appointment-model';
import MonthController from './month-controller';
import MonthTotal from '../models/month-total-model';
import DayController from './day-controller';
import mongoose from 'mongoose';
import { addOneDayToDate, mapDaysBetweenDates } from '../graphql/helpers/mapDays';

class AppointmentController {
	async createAppointment({ AppointmentInput }) {
		try {
			const month = await MonthController.getMonthByCode(AppointmentInput.monthCode);
			const appointment = new Appointment({
				client: AppointmentInput.client,
				description: AppointmentInput.description,
				time: AppointmentInput.time,
				date: Number(AppointmentInput.date),
				instagram: AppointmentInput.instagram,
				procedure: AppointmentInput.procedure,
				employee: AppointmentInput.employee,
				creator: AppointmentInput.creator,
				createdAt: Date.now(),
				status: 'booked',
				month: month,
				monthCode: AppointmentInput.monthCode,
				dayCode: AppointmentInput.dayCode
			});

			const savedAppointment = await appointment.save();


            const day = await DayController.getDayByCode(AppointmentInput.dayCode);
            day.appointments.push(savedAppointment);
            await day.save();

			await MonthTotal.findByIdAndUpdate(month.id, {
				$push: { appointments: savedAppointment }
			});

			return { ...savedAppointment._doc, _id: savedAppointment._id };
		} catch (err) {
			throw err;
		}
	}

	async updateAppointment({ appointmentID, AppointmentInput }) {
		const appointment = {
			client: AppointmentInput.client,
			description: AppointmentInput.description,
			time: AppointmentInput.time,
			date: AppointmentInput.date,
			instagram: AppointmentInput.instagram,
			procedure: AppointmentInput.procedure,
			employee: AppointmentInput.employee,
			creator: AppointmentInput.creator,
			createdAt: AppointmentInput.date,
			monthCode: AppointmentInput.monthCode,
			dayCode: AppointmentInput.dayCode
		};
		try {
			const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentID, appointment, { new: true });
			return { ...updatedAppointment._doc, _id: updatedAppointment._id };
		} catch (err) {
            console.error(err)
			throw err;
		}
	}

	async calculateAppointment({ id, cash, cashless, paymentMethod }) {
		const appointment = {
			cash,
			cashless,
			paymentMethod: paymentMethod,
			status: 'finished'
		};
		try {
			const updatedAppointment = await Appointment.findByIdAndUpdate(id, appointment, { new: true });
			return { ...updatedAppointment._doc, _id: updatedAppointment._id };
		} catch (err) {
            console.error(err)
            throw err;
		}
	}

	async deleteAppointment({ id }) {
		try {
			const deletedAppointment = await Appointment.findByIdAndDelete(id);
			const month = await MonthController.getMonthByCode(deletedAppointment.monthCode);

            const day = await DayController.getDayByCode(deletedAppointment.dayCode);
            day.appointments.pull(deletedAppointment);
            await day.save();

			await MonthTotal.findByIdAndUpdate(month.id, {
				$pull: { appointments: deletedAppointment._id }
			});
			return `Appointment with id ${id} has been deleted`;
		} catch (err) {
			console.log(err);
			return err;
		}
	}

	async getAppointmentsTotalPrice({ dateFrom, dateTo }) {
		try {
			const match = {
				$match: {
					status: 'finished',
					date: {
						$gte: new Date(dateFrom),
						$lte: new Date(addOneDayToDate(dateTo))
					}
				}
			};

			//aggregate sum of cash and sum of cashless
			const group = {
				$group: {
					_id: dateFrom + dateTo,
					cash: { $sum: '$cash' },
					cashless: { $sum: '$cashless' }
				}
			};
			const pipeline = [match, group];
			const result = await Appointment.aggregate(pipeline);
			if (!result.length) {
				return {
					cash: 0,
					cashless: 0
				};
			}
			return result[0];
		} catch (err) {
			throw err;
		}
	}

	async getAppointmentsByDate({ AppointmentsByDatesInput }) {
		const match = {
			date: {
				$gte: new Date(AppointmentsByDatesInput.dateFrom),
				$lte: new Date(addOneDayToDate(AppointmentsByDatesInput.dateTo))
			}
		};
		if (AppointmentsByDatesInput.employee) {
			match.employee = new mongoose.Types.ObjectId(AppointmentsByDatesInput.employee);
		}
		try {
			const pipeline = [
				{
					$match: match
				},
				{
					$group: {
						_id: {
							$dateToString: {
								format: '%Y-%m-%d',
								date: '$date'
							}
						},
						appointments: { $push: '$$ROOT' }
					}
				},
				{
					$unwind: '$appointments'
				},
				{
					$sort: {
						'appointments.date': 1
					}
				},
				{
					$group: {
						_id: '$_id',
						appointments: { $push: '$appointments' }
					}
				}
			];
			const res = await Appointment.aggregate(pipeline);

			const daysTotal = mapDaysBetweenDates(AppointmentsByDatesInput.dateFrom, AppointmentsByDatesInput.dateTo);
			res.forEach((day) => {
				daysTotal[day._id] = day.appointments;
			});
			const response = [];
			Object.entries(daysTotal).map(([date, appointments]) => {
				response.push({
					date: date,
					appointments: appointments
				});
			});
			return response;
		} catch (e) {
			console.error(e);
			return e;
		}
	}
}

export default new AppointmentController();
