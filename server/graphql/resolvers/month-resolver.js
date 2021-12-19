const checkAuthAndResolve = require("../helpers/check-auth");
const MonthController = require("../../controllers/month-controller");
module.exports = {
    Query: {
        getMonthStats: async (parent, args, context) => {
            return checkAuthAndResolve(
                context.req.headers.authorization,
                "admin",
                MonthController.getMonthStats.bind(this, args.monthCode)
            );
        },
    },
};


