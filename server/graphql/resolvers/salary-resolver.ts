// @ts-nocheck
import checkAuthAndResolve from '../helpers/check-auth'
import SalaryController from '../../controllers/salary-controller'

export default {
	Query: {
		getSalaryTableByCode: async (parent, args, context) => {
			return checkAuthAndResolve(
				context.req.headers.authorization,
				['root'],
				SalaryController.getSalaryTableByCode.bind(this, args)
			);
		},
		getSalaryTablesByMonth: async (parent, args, context) => {
			return checkAuthAndResolve(
				context.req.headers.authorization,
				['root'],
				SalaryController.getSalaryTablesByMonth.bind(this, args)
			);
		}
	},
	Mutation: {
		addSalaryPayment: async (parent, args, context) => {
			console.log(args);
			return checkAuthAndResolve(
				context.req.headers.authorization,
				['root'],
				SalaryController.addSalaryPayment.bind(this, args)
			);
		},
		deleteSalaryPayment: async (parent, args, context) => {
			return checkAuthAndResolve(
				context.req.headers.authorization,
				['root'],
				SalaryController.deleteSalaryPayment.bind(this, args)
			);
		}
	}
};
