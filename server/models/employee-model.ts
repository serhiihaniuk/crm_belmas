// @ts-nocheck
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	position: {
		type: String,
		required: true
	},
	qualification: {
		type: String,
		required: true
	},
	login: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	role: [
		{
			type: String,
			required: true
		}
	]
});

export default mongoose.model('Employee', EmployeeSchema);
