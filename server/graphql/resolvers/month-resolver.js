import checkAuthAndResolve from "../helpers/check-auth.js"
import MonthController from "../../controllers/month-controller.js"
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


