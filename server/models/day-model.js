const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const daySchema = new Schema({
	dayCode: {
		type: String,
		required: true,
		unique: true
	},
    appointments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Appointment'
        }
    ],
    dayOff: [
        {
            type: Schema.Types.ObjectId,
            ref: 'DayOff'
        }
    ]
});

module.exports = mongoose.model('Day', daySchema);