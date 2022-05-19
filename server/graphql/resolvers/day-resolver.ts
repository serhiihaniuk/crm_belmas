//@ts-nocheck
import checkAuthAndResolve from '../helpers/check-auth';
import DayController from '../../controllers/day-controller';
import log from '../../helpers/info';

export default {
    Query: {
        getDaysInRange: async (parent, args, context) => {
            log.info('Query', 'getDaysInRange', args);
            return checkAuthAndResolve(
                context.req.headers.authorization,
                ['admin'],
                DayController.getDaysInRange.bind(DayController, args)
            );
        }
    }
};


