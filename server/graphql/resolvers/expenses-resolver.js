const checkAuthAndResolve = require("../helpers/check-auth");
const ExpensesController = require("../../controllers/expenses-controller");
module.exports = {
  Mutation: {
    addNewExpense: async (parent, args, context) => {
      return checkAuthAndResolve(
        context.req.headers.authorization,
        "admin",
        ExpensesController.addNewExpense.bind(this, args)
      );
    },
  },
};


