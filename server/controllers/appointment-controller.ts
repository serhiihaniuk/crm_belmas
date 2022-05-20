import Appointment from '../models/appointment-model';
import MonthController from './month-controller';
import MonthTotal from '../models/month-total-model';
import DayController from './day-controller';
import mongoose, { ObjectId } from 'mongoose';
import { addOneDayToDate, mapDaysBetweenDates } from '../graphql/helpers/mapDays';
import { IAppointmentRaw } from 'appointment-types';
import { MonthRaw } from 'month-types';
import { DayCode, HourCode, MonthCode } from 'date-types';
import { MongoResponse } from './controller-types';
import log from '../helpers/info';
import { IProcedureCodes, IProcedureRaw, OccupationType } from 'procedure-types';
import Procedure from '../models/procedure-model';

const controllerName = 'AppointmentController.';
const logInfo = (method: string, message: string, a: any = ''): void => {
	log.info(controllerName + method, message, a);
};

interface AppointmentGQLInput {
	client: string;
	description: string;
	date: string;
	time: HourCode;
	instagram: string;
	procedureCode: IProcedureCodes;
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

type AppointmentMongoInput = Omit<AppointmentGQLInput, 'date' | 'procedureCode'> & {
	status: 'booked' | 'finished';
	date: number;
	month: MonthRaw;
	procedure: IProcedureRaw;
	typeOf: OccupationType;
};

class AppointmentController {
	async createAppointment({
		AppointmentInput
	}: {
		AppointmentInput: AppointmentGQLInput;
	}): Promise<MongoResponse<IAppointmentRaw>> {
		logInfo('createAppointment', `Creating appointment for ${JSON.stringify(AppointmentInput)}`);

		try {
			const month = await MonthController.getMonthByCode(AppointmentInput.monthCode);
			const procedure = await Procedure.findOne({
				procedureCode: AppointmentInput.procedureCode
			});

			if (!procedure) {
				throw new Error('Procedure not found');
			}

			const appointmentMongoInput: AppointmentMongoInput = {
				client: AppointmentInput.client,
				typeOf: procedure.typeOf,
				description: AppointmentInput.description,
				time: AppointmentInput.time,
				date: Number(AppointmentInput.date),
				instagram: AppointmentInput.instagram,
				procedure: procedure._id,
				employee: AppointmentInput.employee,
				creator: AppointmentInput.creator,
				status: 'booked',
				month: month,
				monthCode: AppointmentInput.monthCode,
				dayCode: AppointmentInput.dayCode
			};

			log.warn('123123123123123', AppointmentInput.procedureCode, appointmentMongoInput);
			const appointment = new Appointment(appointmentMongoInput);

			const savedAppointment = await appointment.save();

			const day = await DayController.getDayByCode(AppointmentInput.dayCode);
			day.appointments.push(savedAppointment);
			await day.save();

			await MonthTotal.findByIdAndUpdate(month.id, {
				$push: { appointments: savedAppointment }
			});

			logInfo('createAppointment', `Saved appointment ${appointment.client}`, savedAppointment);
			return savedAppointment;
		} catch (err: any) {
			log.error(controllerName, err);
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
		logInfo('updateAppointment', `Updating appointment ${appointmentID} for ${JSON.stringify(AppointmentInput)}`);

		try {
			let procedure;

			if (AppointmentInput.procedureCode) {
				procedure = await Procedure.findOne({
					procedureCode: AppointmentInput.procedureCode
				});

				if (!procedure) {
					throw new Error('Procedure not found');
				}
			}

			const appointmentMongoInput: Partial<AppointmentMongoInput> = {
				client: AppointmentInput.client,
				description: AppointmentInput.description,
				time: AppointmentInput.time,
				date: +AppointmentInput.date,
				instagram: AppointmentInput.instagram,
				employee: AppointmentInput.employee,
				creator: AppointmentInput.creator,
				monthCode: AppointmentInput.monthCode,
				dayCode: AppointmentInput.dayCode
			};

			if (procedure) {
				appointmentMongoInput.procedure = procedure;
			}

			const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentID, appointmentMongoInput, {
				new: true
			}).populate('procedure');

			logInfo('a', 'a', updatedAppointment);

			if (!updatedAppointment) {
				log.error(controllerName + 'updateAppointment', 'Error while updating appointment');
				throw new Error('Appointment not found');
			}

			return updatedAppointment;
		} catch (err: any) {
			log.error(controllerName + 'updateAppointment', err);
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
		logInfo('calculateAppointment', `Calculating appointment ${id}`);

		const appointment: Partial<IAppointmentRaw> = {
			cash,
			cashless,
			paymentMethod: paymentMethod,
			status: 'finished'
		};
		try {
			const updatedAppointment = await Appointment.findByIdAndUpdate(id, appointment, { new: true });
			if (!updatedAppointment) {
				log.error(controllerName + 'calculateAppointment', 'Error while updating appointment');
				throw new Error('Appointment not found');
			}
			return updatedAppointment;
		} catch (err: any) {
			log.error(controllerName + 'calculateAppointment', err);
			throw err;
		}
	}

	async deleteAppointment({ id }: { id: string }): Promise<string> {
		logInfo('deleteAppointment', `Deleting appointment ${id}`);

		try {
			const deletedAppointment = await Appointment.findByIdAndDelete(id);

			if (!deletedAppointment) {
				log.error(controllerName + 'deleteAppointment', 'Error while deleting appointment');
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

			log.info(controllerName + 'deleteAppointment', `Appointment with id ${id} was deleted`);
			return `Appointment with id ${id} has been deleted`;
		} catch (err: any) {
			log.error(controllerName + 'deleteAppointment', err);
			return err;
		}
	}

	async getAppointmentsTotalPrice({ dateFrom, dateTo }: { dateFrom: number; dateTo: number }) {
		logInfo('getAppointmentsTotalPrice', `Getting appointments total price from ${dateFrom} to ${dateTo}`);

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
				log.info('appointment-controller-getAppointmentsTotalPrice', 'length is 0');
				return {
					cash: 0,
					cashless: 0
				};
			}

			log.info(
				controllerName + 'getAppointmentsTotalPrice',
				`Total price is ${result[0].cash + result[0].cashless}`
			);

			return result[0];
		} catch (err: any) {
			log.error(controllerName + 'getAppointmentsTotalPrice', err);
			throw err;
		}
	}

	async getAppointments(dateFrom: DayCode, dateTo: DayCode) {
		logInfo('getAppointments', `Getting appointments from ${dateFrom} to ${dateTo}`);
	}

	async getAppointmentsByDate({
		AppointmentsByDatesInput
	}: {
		AppointmentsByDatesInput: AppointmentByDatesGQLInput;
	}) {
		logInfo(
			'getAppointmentsByDate',
			`Getting appointments by date from ${AppointmentsByDatesInput.dateFrom} to ${AppointmentsByDatesInput.dateTo}`
		);

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

			log.info(
				controllerName + 'getAppointmentsByDate',
				`Appointments by date from ${AppointmentsByDatesInput.dateFrom} to ${AppointmentsByDatesInput.dateTo}`
			);

			return response;
		} catch (e: any) {
			log.error(controllerName + 'getAppointmentsByDate', e);
			throw e;
		}
	}
}

export default new AppointmentController();
