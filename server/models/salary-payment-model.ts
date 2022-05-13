// @ts-nocheck
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const salaryPaymentSchema = new Schema({
	salaryTableCode: {
		type: String,
		required: true
	},
	employee: {
		type: Schema.Types.ObjectId,
		ref: 'Employee',
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
	month: {
		type: Schema.Types.ObjectId,
		ref: 'Month',
		required: true
	},
	date: {
		type: Date,
		required: true
	},
    dayCode: {
        type: String,
        required: true
    },
    monthCode: {
        type: String,
        required: true
    }
});

export default mongoose.model('SalaryPayment', salaryPaymentSchema);
