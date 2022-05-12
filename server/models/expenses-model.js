import mongoose from 'mongoose';
import MonthTotal from './month-total-model.js';

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

expensesSchema.post('save', async function (doc) {
    //todo: executes twice. Find a way to avoid it
	await MonthTotal.findByIdAndUpdate(doc.month, {
		$push: { expenses: doc }
	});
    console.log('Expense saved and added to month', doc.description);
});
expensesSchema.post('remove', async function (doc) {
	try {
		const month = await MonthTotal.findById(doc.month);
		month.expenses.pull(doc);
        await month.save();
        console.log('deleted and removed from month', doc.description);
	} catch (e) {
		console.error(e);
        throw new Error(e)
	}
});
export default mongoose.model('Expenses', expensesSchema);
