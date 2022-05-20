import mongoose from 'mongoose';
import { IAppointmentRaw } from 'appointment-types';

const Schema = mongoose.Schema;

const appointmentSchema = new Schema<IAppointmentRaw>({
	client: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
    typeOf: {
      type: String,
      required: true
    },
	time: {
		type: String,
		required: true
	},
	cash: {
		type: Number,
		default: 0
	},
	cashless: {
		type: Number,
		default: 0
	},
	paymentMethod: {
		type: String
	},
	date: {
		type: Date,
		required: true
	},
	instagram: {
		type: String
	},
	procedure: {
        type: Schema.Types.ObjectId,
        ref: 'Procedure',
		required: true
	},
	status: {
		type: String,
		required: true
	},
	employee: {
		type: Schema.Types.ObjectId,
		ref: 'Employee',
		required: true
	},
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'Employee',
		required: true
	},
	month: {
		type: Schema.Types.ObjectId,
		ref: 'MonthTotal'
	},
	monthCode: {
		type: String,
		required: true
	},
	dayCode: {
		type: String,
		required: true
	}
});

export default mongoose.model<IAppointmentRaw>('Appointment', appointmentSchema);
