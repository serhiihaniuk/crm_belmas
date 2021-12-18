const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const monthTotalSchema = new Schema({
  monthCode: {
    type: String,
    required: true,
    unique: true
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  cashlessAtTheBeginning: {
    type: Number,
    required: true,
  },
  cash: {
    type: Number,
    required: true,
  },
  cashless: {
    type: Number,
    required: true,
  },
  appointments: [{
    type: Schema.Types.ObjectId,
    ref: "Appointment",
  }],
  status: {
    type: String,
    default: "active",
  },

});

module.exports = mongoose.model("MonthTotal", monthTotalSchema);

