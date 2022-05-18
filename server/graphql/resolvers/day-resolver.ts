// @ts-nocheck

import checkAuthAndResolve from '../helpers/check-auth';
import DayController from '../../controllers/day-controller';

export default {
    Query: {
        getDaysInRange: DayController.getDaysInRange
      }
};
