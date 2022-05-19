import mongoose from 'mongoose';
import { IDayRaw } from 'day-types';

const Schema = mongoose.Schema;

const daySchema = new Schema<IDayRaw>({
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
    date: {
        type: Number,
        required: true
    },
    isOff: {
        type: Boolean,
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
