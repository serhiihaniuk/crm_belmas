import mongoose from 'mongoose';
import { MonthRaw } from 'month-types';

const Schema = mongoose.Schema;

const monthTotalSchema = new Schema<MonthRaw>({
	month: {
		type: String,
		required: true
	},
	year: {
		type: String,
		required: true
	},
	cashlessAtTheBeginning: {
		type: Number,
		required: true
	},
	cash: {
		type: Number,
		required: true
	},
	cashless: {
		type: Number,
		required: true
	},
	currentCash: {
		type: Number,
		required: true
	},
	currentCashless: {
		type: Number,
		required: true
	},
	expensesCash: {
		type: Number,
		required: true
	},
	expensesCashless: {
		type: Number,
		required: true
	},
	salaryCash: {
		type: Number,
		required: true
	},
	salaryCashless: {
		type: Number,
		required: true
	},
	appointments: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Appointment'
		}
	],
	expenses: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Expenses'
		}
	],
	salaryTables: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Salary'
		}
	],
	status: {
		type: String,
		default: 'active'
	},
    //@ts-ignore
	monthCode: {
		type: String,
		required: true,
		unique: true
	}
});

export default mongoose.model('MonthTotal', monthTotalSchema);
