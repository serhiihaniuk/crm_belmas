const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dayOffSchema = new Schema({
	dayCode: {
		type: String,
		required: true,
		unique: true
	},
	employee: {
		type: Schema.Types.ObjectId,
		ref: 'Employee',
		required: true
	},
    day: {
        type: Schema.Types.ObjectId,
        ref: 'Day',
        required: true
    }
});

module.exports = mongoose.model('DayOff', dayOffSchema);