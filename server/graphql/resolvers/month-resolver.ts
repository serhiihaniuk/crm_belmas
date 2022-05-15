// @ts-nocheck
import checkAuthAndResolve from "../helpers/check-auth"
import MonthController from "../../controllers/month-controller"
export default {
    Query: {
        getMonthStats: async (parent, args, context) => {
            return checkAuthAndResolve(
                context.req.headers.authorization,
                ["root"],
                MonthController.getMonthStats.bind(this, args.monthCode)
            );
        },
    },
};


