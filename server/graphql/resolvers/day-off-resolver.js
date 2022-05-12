import checkAuthAndResolve from '../helpers/check-auth.js';
import DayOffController from '../../controllers/day-controller.js';

export default {
    Mutation: {
        createDayOff: async (parent, args, context) => {
            return checkAuthAndResolve(
                context.req.headers.authorization,
                ['admin'],
                DayOffController.createDayOff.bind(DayOffController, args)
            );
        },
        deleteDayOff: async (parent, args, context) => {
            return checkAuthAndResolve(
                context.req.headers.authorization,
                ['admin'],
                DayOffController.deleteDayOff.bind(DayOffController, args)
            );
        }
    }
};