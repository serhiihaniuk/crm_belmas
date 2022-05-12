import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const expensesSchema = new Schema({
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



