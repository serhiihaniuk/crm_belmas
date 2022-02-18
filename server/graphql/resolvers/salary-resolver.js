const checkAuthAndResolve = require('../helpers/check-auth');
const SalaryController = require('../../controllers/salary-controller');

module.exports = {
	Query: {
		getSalaryTableByCode: async (parent, args, context) => {
			return checkAuthAndResolve(
				context.req.headers.authorization,
				'admin',
				SalaryController.getSalaryTableByCode.bind(this, args)
			);
		},
		getSalaryTablesByMonth: async (parent, args, context) => {
			return checkAuthAndResolve(
				context.req.headers.authorization,
				'admin',
				SalaryController.getSalaryTablesByMonth.bind(this, args)
			)
		}
	},
	Mutation: {
		addSalaryPayment: async (parent, args, context) => {
			console.log(args);
			return checkAuthAndResolve(
				context.req.headers.authorization,
				'admin',
				SalaryController.addSalaryPayment.bind(this, args)
			);
		},
		deleteSalaryPayment: async (parent, args, context) => {
			return checkAuthAndResolve(
				context.req.headers.authorization,
				'admin',
				SalaryController.deleteSalaryPayment.bind(this, args)
			);
		}
	}
};
