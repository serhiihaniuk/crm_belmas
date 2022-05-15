import mongoose from 'mongoose';
import {ISalaryTable} from "salary-types";

const Schema = mongoose.Schema;

const salarySchema = new Schema<ISalaryTable>({
	salaryTableCode: {
		type: String,
		required: true,
		unique: true
	},
	totalEarned: {
		type: Number,
		required: true
	},
	payedCash: {
		type: Number,
		required: true
	},
	payedCashless: {
		type: Number,
		required: true
	},
	tips: {
		type: Number,
		required: true
	},
	month: {
		type: Schema.Types.ObjectId,
		ref: 'Month',
		required: true
	},
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
	payments: [
		{
			type: Schema.Types.ObjectId,
			ref: 'SalaryPayment'
		}
	]
});

export default mongoose.model('Salary', salarySchema);
