const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    client: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
    },
    paymentMethod: {
        type: String,
    },
    date: {
        type: Date,
        required: true,
    },
    instagram: {
        type: String,
    },
    procedure: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
