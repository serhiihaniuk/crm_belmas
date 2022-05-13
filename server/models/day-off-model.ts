// @ts-nocheck
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const dayOffSchema = new Schema({
	dayCode: {
		type: String,
		required: true,
		unique: true
	},
	employee: {
		type: Schema.Types.ObjectId,
		ref: 'Employee',
		required: true
	},
	day: {
		type: Schema.Types.ObjectId,
		ref: 'Day',
		required: true
	}
});

export default mongoose.model('DayOff', dayOffSchema);