const Appointment = require("../../models/appointment-model");
const Employee = require("../../models/employee-model");
const { getAppointmentsFromDB } = require("./merge-resolvers");
const checkAuthAndResolve = require("../helpers/check-auth");
const AppointmentController = require("../../controllers/appointment-controller");
module.exports = {
  Query: {
    getAppointmentsTotalPrice: async (parent, args, context) => {
      return checkAuthAndResolve(
          context.req.headers.authorization,
          ["root"],
          AppointmentController.getAppointmentsTotalPrice.bind(this, args)
      );
    },
    getAppointmentsByDate: async (parent, args, context) => {
      return checkAuthAndResolve(
          context.req.headers.authorization,
          ["master", "admin"],
          AppointmentController.getAppointmentsByDate.bind(this, args)
      );
    },
  },
  Mutation: {
    createAppointment: async (parent, args, context) => {
      return checkAuthAndResolve(
          context.req.headers.authorization,
          ["admin"],
          AppointmentController.createAppointment.bind(this, args)
      );
    },
    updateAppointment: async (parent, args, context) => {
      return checkAuthAndResolve(
          context.req.headers.authorization,
          ["admin"],
          AppointmentController.updateAppointment.bind(this, args)
      );
    },
    calculateAppointment: async (parent, args, context) => {
      return checkAuthAndResolve(
          context.req.headers.authorization,
          ["master"],
          AppointmentController.calculateAppointment.bind(this, args)
      );
    },
    deleteAppointment: async (parent, args, context) => {
      return checkAuthAndResolve(
			context.req.headers.authorization,
			['admin'],
			AppointmentController.deleteAppointment.bind(this, args)
		);
    },
  },
};
