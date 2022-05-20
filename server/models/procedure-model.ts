import mongoose from 'mongoose';
import { IProcedureRaw } from 'procedure-types';

const Schema = mongoose.Schema;

const procedureSchema = new Schema<IProcedureRaw>({
    typeOf: {
		type: String,
		required: true
	},
	procedure: {
		type: String,
		required: true,
		unique: true
	},
	procedureCode: {
		type: String,
		required: true,
		unique: true
	},
	duration: {
		type: Number,
		required: true
	}
});

export default mongoose.model('Procedure', procedureSchema);
