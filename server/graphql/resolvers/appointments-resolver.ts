// @ts-nocheck
import checkAuthAndResolve from "../helpers/check-auth"
import AppointmentController from "../../controllers/appointment-controller"
export default {
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
