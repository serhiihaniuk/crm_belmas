// @ts-nocheck
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const daySchema = new Schema({
	dayCode: {
		type: String,
		required: true,
		unique: true
	},
	year: {
		type: String,
		required: true
	},
	month: {
		type: String,
		required: true
	},
	day: {
		type: String,
		required: true
	},
	appointments: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Appointment'
		}
	],
	dayOff: [
		{
			type: Schema.Types.ObjectId,
			ref: 'DayOff'
		}
	]
});

export default mongoose.model('Day', daySchema);
