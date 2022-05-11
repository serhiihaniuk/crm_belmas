import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const salarySchema = new Schema({
	salaryTableCode: {
		type: String,
		required: true,
		unique: true
	},
	employee: {
		type: Schema.Types.ObjectId,
		ref: 'Employee',
		required: true
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
	payments: [
		{
			type: Schema.Types.ObjectId,
			ref: 'SalaryPayment',
		}
	]
});

export default mongoose.model('Salary', salarySchema);
