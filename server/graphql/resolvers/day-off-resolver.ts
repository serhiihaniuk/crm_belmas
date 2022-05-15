// @ts-nocheck
import checkAuthAndResolve from '../helpers/check-auth';
import DayOffController from '../../controllers/day-controller';

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