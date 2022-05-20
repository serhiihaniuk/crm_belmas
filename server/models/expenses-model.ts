import mongoose from 'mongoose';
import MonthTotal from './month-total-model';
import { IExpenseRaw } from 'expenses-types';

const Schema = mongoose.Schema;

const expensesSchema = new Schema<IExpenseRaw>({
	description: {
		type: String,
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
	monthCode: {
		type: String,
		required: true
	},
	month: {
		type: Schema.Types.ObjectId,
		ref: 'MonthTotal'
	},
	date: {
		type: Date,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	invoice: {
		type: Boolean,
		required: true
	}
});

export default mongoose.model('Expenses', expensesSchema);
