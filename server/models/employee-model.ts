import mongoose from 'mongoose';
import {IEmployee} from "employee-types";

const Schema = mongoose.Schema;

const EmployeeSchema = new Schema<IEmployee>({
	name: {
		type: String,
		required: true
	},
	position: {
		type: String,
		required: true
	},
    occupation: {
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
