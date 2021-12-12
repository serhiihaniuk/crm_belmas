const Appointment = require("../models/appointment-model");
const Employee = require("../models/employee-model");
const { getEmployeeFromDB } = require("../graphql/resolvers/merge-resolvers");

class AppointmentController {
  async createAppointment({ AppointmentInput }) {
    try {
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
      });
      const savedAppointment = await appointment.save();

      await Employee.findByIdAndUpdate(AppointmentInput.employee, {
        $push: { appointments: savedAppointment },
      });

      return { ...savedAppointment._doc, _id: savedAppointment._id };
    } catch (err) {
      throw err;
    }
  }

  async updateAppointment({ id, AppointmentInput }) {
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
        id,
        appointment,
        { new: true }
      );
      return { ...updatedAppointment._doc, _id: updatedAppointment._id };
    } catch (err) {
      throw err;
    }
  }

  async calculateAppointment({ id, price }) {
    const appointment = {
      price: price,
      status: "finished",
    };
    try {
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        id,
        appointment,
        { new: true }
      );
      return { ...updatedAppointment._doc, _id: updatedAppointment._id };
    } catch (err) {
      throw err;
    }
  }

  async deleteAppointment({ id }) {
    try {
      await Appointment.findByIdAndDelete(id);
      return "success";
    } catch (err) {
      throw err;
    }
  }

  async getAppointments({ employee, dateFrom, dateTo, sortBy }) {
    try {
      const query = {};
      if (employee) {
        query.employee = employee;
      }
      if (dateFrom) {
        query.date = {
          $gte: Number(dateFrom),
        };
      }
      if (dateTo) {
        query.date = {
          $lte: Number(dateTo),
        };
      }

      const appointments = await Appointment.find(query).sort({date: sortBy});

      return appointments.map((appointment) => {
        return {
          ...appointment._doc,
          _id: appointment._id,
          employee: getEmployeeFromDB.bind(this, { _id: employee }),
        };
      });
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new AppointmentController();
