// @ts-nocheck
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
	client: {
		type: String,
		required: true
	},
	description: {
		type: String
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
		type: String,
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

export default mongoose.model('Appointment', appointmentSchema);
