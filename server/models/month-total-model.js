const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const monthTotalSchema = new Schema({
	monthCode: {
		type: String,
		required: true,
		unique: true
	},
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
	}
});

module.exports = mongoose.model('MonthTotal', monthTotalSchema);
