import Appointment from '../models/appointment-model';
import MonthController from './month-controller';
import MonthTotal from '../models/month-total-model';
import DayController from './day-controller';
import mongoose, { ObjectId } from 'mongoose';
import { addOneDayToDate, mapDaysBetweenDates } from '../graphql/helpers/mapDays';
import { IAppointmentRaw } from 'appointment-typesd';
import { MonthRaw } from 'month-types';
import { DayCode, HourCode, MonthCode } from 'date-types';
import { MongoResponse } from './controller-types';

interface AppointmentGQLInput {
	client: string;
	description: string;
	date: string;
	time: HourCode;
	instagram: string;
	procedure: string;
	employee: string;
	creator: string;
	monthCode: MonthCode;
	dayCode: DayCode;
}

interface AppointmentByDatesGQLInput {
	dateFrom: string;
	dateTo: string;
	employee?: string;
}

type AppointmentMongoInput = Omit<AppointmentGQLInput, 'date'> & {
	status: 'booked' | 'finished';
	date: number;
	month: MonthRaw;
};

class AppointmentController {
	async createAppointment({
		AppointmentInput
	}: {
		AppointmentInput: AppointmentGQLInput;
	}): Promise<MongoResponse<IAppointmentRaw>> {
		try {
			const month = await MonthController.getMonthByCode(AppointmentInput.monthCode);
			const appointmentMongoInput: AppointmentMongoInput = {
				client: AppointmentInput.client,
				description: AppointmentInput.description,
				time: AppointmentInput.time,
				date: Number(AppointmentInput.date),
				instagram: AppointmentInput.instagram,
				procedure: AppointmentInput.procedure,
				employee: AppointmentInput.employee,
				creator: AppointmentInput.creator,
				status: 'booked',
				month: month,
				monthCode: AppointmentInput.monthCode,
				dayCode: AppointmentInput.dayCode
			};

			const appointment = new Appointment(appointmentMongoInput);

			const savedAppointment = await appointment.save();

			const day = await DayController.getDayByCode(AppointmentInput.dayCode);
			day.appointments.push(savedAppointment);
			await day.save();

			await MonthTotal.findByIdAndUpdate(month.id, {
				$push: { appointments: savedAppointment }
			});

			return savedAppointment;
		} catch (err) {
			throw err;
		}
	}

	async updateAppointment({
		appointmentID,
		AppointmentInput
	}: {
		appointmentID: string;
		AppointmentInput: AppointmentGQLInput;
	}): Promise<MongoResponse<IAppointmentRaw>> {
		const appointmentMongoInput: Partial<AppointmentMongoInput> = {
			client: AppointmentInput.client,
			description: AppointmentInput.description,
			time: AppointmentInput.time,
			date: +AppointmentInput.date,
			instagram: AppointmentInput.instagram,
			procedure: AppointmentInput.procedure,
			employee: AppointmentInput.employee,
			creator: AppointmentInput.creator,
			monthCode: AppointmentInput.monthCode,
			dayCode: AppointmentInput.dayCode
		};
		try {
			const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentID, appointmentMongoInput, {
				new: true
			});

			if (!updatedAppointment) {
				throw new Error('Appointment not found');
			}

			return updatedAppointment;
		} catch (err) {
			console.error(err);
			throw err;
		}
	}

	async calculateAppointment({
		id,
		cash,
		cashless,
		paymentMethod
	}: {
		id: string;
		cash: number;
		cashless: number;
		paymentMethod: string;
	}): Promise<MongoResponse<IAppointmentRaw>> {
		const appointment = {
			cash,
			cashless,
			paymentMethod: paymentMethod,
			status: 'finished'
		};
		try {
			const updatedAppointment = await Appointment.findByIdAndUpdate(id, appointment, { new: true });
			if (!updatedAppointment) {
				throw new Error('Appointment not found');
			}
			return updatedAppointment;
		} catch (err) {
			console.error(err);
			throw err;
		}
	}

	async deleteAppointment({ id }: { id: string }): Promise<string> {
		try {
			const deletedAppointment = await Appointment.findByIdAndDelete(id);

			if (!deletedAppointment) {
				throw new Error('Appointment not found');
			}
			const month = await MonthController.getMonthByCode(deletedAppointment.monthCode);

			const day = await DayController.getDayByCode(deletedAppointment.dayCode);

			//@ts-ignore
			day.appointments.pull(deletedAppointment);
			await day.save();

			await MonthTotal.findByIdAndUpdate(month.id, {
				$pull: { appointments: deletedAppointment._id }
			});

			return `Appointment with id ${id} has been deleted`;
		} catch (err: any) {
			console.log(err);
			return err;
		}
	}

	async getAppointmentsTotalPrice({ dateFrom, dateTo }: { dateFrom: number; dateTo: number }) {
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
			const result = await Appointment.aggregate(pipeline as any);
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

	async getAppointmentsByDate({
		AppointmentsByDatesInput
	}: {
		AppointmentsByDatesInput: AppointmentByDatesGQLInput;
	}) {
		interface IMatch {
			date: {
				$gte: Date;
				$lte: Date;
			};
			employee?: ObjectId;
		}

		const match: IMatch = {
			date: {
				$gte: new Date(AppointmentsByDatesInput.dateFrom),
				$lte: new Date(addOneDayToDate(AppointmentsByDatesInput.dateTo))
			}
		};
		if (AppointmentsByDatesInput.employee) {
			//@ts-ignore
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
			const res = await Appointment.aggregate(pipeline as any);

			const daysTotal = mapDaysBetweenDates(AppointmentsByDatesInput.dateFrom, AppointmentsByDatesInput.dateTo);
			res.forEach((day) => {
				daysTotal[day._id] = day.appointments;
			});
			const response: any[] = [];
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
