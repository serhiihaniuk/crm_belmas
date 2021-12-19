const Appointment = require("../models/appointment-model");
const Employee = require("../models/employee-model");
const MonthController = require("./month-controller");
const MonthTotal = require("../models/month-total-model");
const mongoose = require("mongoose");
const {
    mapDaysBetweenDates,
    addOneDayToDate,
} = require("../graphql/helpers/mapDays");

class AppointmentController {
    async createAppointment({AppointmentInput}) {
        try {
            const month = await MonthController.getMonthByCode(AppointmentInput.monthCode)
            const appointment = new Appointment({
                client: AppointmentInput.client,
                description: AppointmentInput.description,
                date: Number(AppointmentInput.date),
                instagram: AppointmentInput.instagram,
                procedure: AppointmentInput.procedure,
                employee: AppointmentInput.employee,
                creator: AppointmentInput.creator,
                createdAt: Date.now(),
                status: "booked",
                month: month
            });

            const savedAppointment = await appointment.save();

            await Employee.findByIdAndUpdate(AppointmentInput.employee, {
                $push: {appointments: savedAppointment},
            });
            await MonthTotal.findByIdAndUpdate(month.id, {
                $push: {appointments: savedAppointment},
            });

            return {...savedAppointment._doc, _id: savedAppointment._id};
        } catch (err) {
            throw err;
        }
    }

    async updateAppointment({appointmentID, AppointmentInput}) {
        const appointment = {
            client: AppointmentInput.client,
            description: AppointmentInput.description,
            date: AppointmentInput.date,
            instagram: AppointmentInput.instagram,
            procedure: AppointmentInput.procedure,
            employee: AppointmentInput.employee,
            creator: AppointmentInput.creator,
            createdAt: AppointmentInput.date,
            status: "booked",
        };
        try {
            const updatedAppointment = await Appointment.findByIdAndUpdate(
                appointmentID,
                appointment,
                {new: true}
            );
            return {...updatedAppointment._doc, _id: updatedAppointment._id};
        } catch (err) {
            throw err;
        }
    }

    async calculateAppointment({id, cash, cashless, paymentMethod}) {
        const appointment = {
            cash,
            cashless,
            paymentMethod: paymentMethod,
            status: "finished",
        };
        try {
            const updatedAppointment = await Appointment.findByIdAndUpdate(
                id,
                appointment,
                {new: true}
            );
            return {...updatedAppointment._doc, _id: updatedAppointment._id};
        } catch (err) {
            throw err;
        }
    }

    async deleteAppointment({id}) {
        try {
            const deletedAppointment = await Appointment.findByIdAndDelete(id);
            const month = await MonthController.getMonthByCode(deletedAppointment.month.code);
            await Employee.findByIdAndUpdate(deletedAppointment.employee, {
                $pull: {appointments: deletedAppointment},
            });
            await MonthTotal.findByIdAndUpdate(month.id, {
                $pull: {appointments: deletedAppointment},
            });
            return "success";
        } catch (err) {
            throw err;
        }
    }

    async getAppointmentsTotalPrice({dateFrom, dateTo}) {
        try {
            const match = {
                $match: {
                    status: "finished",
                    date: {
                        $gte: new Date(dateFrom),
                        $lte: new Date(addOneDayToDate(dateTo)),
                    },
                }
            };

            //aggregate sum of cash and sum of cashless
            const group = {
                $group: {
                    _id: dateFrom + dateTo,
                    cash: {$sum: "$cash"},
                    cashless: {$sum: "$cashless"},
                },
            };
            const pipeline = [match, group];
            const result = await Appointment.aggregate(pipeline);
            console.log(result);
            return result[0];
        } catch (err) {
            throw err;
        }
    }

    async getAppointmentsByDate({AppointmentsByDatesInput}) {
        const match = {
            date: {
                $gte: new Date(AppointmentsByDatesInput.dateFrom),
                $lte: new Date(addOneDayToDate(AppointmentsByDatesInput.dateTo)),
            },
        };
        if (AppointmentsByDatesInput.employee) {
            match.employee = new mongoose.Types.ObjectId(
                AppointmentsByDatesInput.employee
            );
        }
        try {
            const pipeline = [
                {
                    $match: match,
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$date",
                            },
                        },
                        appointments: {$push: "$$ROOT"},
                    },
                },
                {
                    $unwind: "$appointments",
                },
                {
                    $sort: {
                        "appointments.date": 1,
                    },
                },
                {
                    $group: {
                        _id: "$_id",
                        appointments: {$push: "$appointments"},
                    },
                },
            ];
            const res = await Appointment.aggregate(pipeline);
            const daysTotal = mapDaysBetweenDates(
                AppointmentsByDatesInput.dateFrom,
                AppointmentsByDatesInput.dateTo
            );
            res.forEach((day) => {
                daysTotal[day._id] = day.appointments;
            });
            const response = [];
            Object.entries(daysTotal).map(([date, appointments]) => {
                response.push({
                    date: date,
                    appointments: appointments,
                });
            });
            return response;
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new AppointmentController()



