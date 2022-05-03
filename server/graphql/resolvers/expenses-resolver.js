const checkAuthAndResolve = require('../helpers/check-auth');
const ExpensesController = require('../../controllers/expenses-controller');
module.exports = {
	Query: {
		getExpensesByMonth: async (parent, args, context) => {
			return checkAuthAndResolve(
				context.req.headers.authorization,
				["root"],
				ExpensesController.getExpensesByMonth.bind(this, args)
			);
		}
	},
	Mutation: {
		addNewExpense: async (parent, args, context) => {
			return checkAuthAndResolve(
				context.req.headers.authorization,
                ["root"],
				ExpensesController.addNewExpense.bind(this, args)
			);
		},
		editExpense: async (parent, args, context) => {
			return checkAuthAndResolve(
				context.req.headers.authorization,
                ["root"],
				ExpensesController.editExpense.bind(this, args)
			);
		},
		deleteExpense: async (parent, args, context) => {
			return checkAuthAndResolve(
				context.req.headers.authorization,
                ["root"],
				ExpensesController.deleteExpense.bind(this, args)
			);
		}
	}
};
