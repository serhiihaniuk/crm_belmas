const checkAuthAndResolve = require("../helpers/check-auth");
const ExpensesController = require("../../controllers/expenses-controller");
module.exports = {
  Query: {
    getExpensesByMonth: async (parent, args, context) => {
      return checkAuthAndResolve(
          context.req.headers.authorization,
          "admin",
          ExpensesController.getExpensesByMonth.bind(this, args)
      );
    },
  },
  Mutation: {
    addNewExpense: async (parent, args, context) => {
      console.log(args, 'asfdasdasdfsdfa')

      return checkAuthAndResolve(
        context.req.headers.authorization,
        "admin",
        ExpensesController.addNewExpense.bind(this, args)
      );
    },
    editExpense: async (parent, args, context) => {
      return checkAuthAndResolve(
          context.req.headers.authorization,
          "admin",
          ExpensesController.editExpense.bind(this, args)
      );
    },
    deleteExpense: async (parent, args, context) => {
      return checkAuthAndResolve(
          context.req.headers.authorization,
          "admin",
          ExpensesController.deleteExpense.bind(this, args)
      );
    },
  },
};


