import MonthController from './month-controller.js'
import EmployeeController from './employee-controller.js'
import Salary from '../models/salary-model.js'
import SalaryPayment from '../models/salary-payment-model.js'
import MonthTotal from '../models/month-total-model.js'

class SalaryController {
	static async createSalaryTable(salaryTableCode) {
		try {
			const [monthCode, employeeID] = salaryTableCode.split('_');
			const month = await MonthController.getMonthByCode(monthCode);
			const employee = await EmployeeController.getEmployeeByID(employeeID);
			const newSalaryTable = new Salary({
				salaryTableCode: salaryTableCode,
				employee: employee,
				totalEarned: 0,
				payedCash: 0,
				payedCashless: 0,
				tips: 0,
				month: month
			});

			const newSalaryTableSaved = await newSalaryTable.save();
			await MonthTotal.findByIdAndUpdate(month.id, {
				$push: { salaryTables: newSalaryTable }
			});

			return newSalaryTableSaved;
		} catch (e) {
			throw e;
		}
	}

	static async getSalaryTableByCode({ salaryTableCode }) {
		const [, employeeID] = salaryTableCode.split('_');
		try {
			let salaryTable = await Salary.findOne({
				salaryTableCode: salaryTableCode
			}).populate('payments');
			if (!salaryTable) {
				salaryTable = await SalaryController.createSalaryTable(salaryTableCode);
			}
			const employee = await EmployeeController.getEmployeeByID(employeeID);

			return { ...salaryTable._doc, _id: salaryTable.id, employee: { ...employee } };
		} catch (e) {
			throw e;
		}
	}

	static async getSalaryTablesByMonth({ monthCode }) {
		try {
			const employees = await EmployeeController.getEmployees();
			let salaryTables = [];
			for (let employee of employees) {
				const salaryTableCode = `${monthCode}_${employee._id}`;
				const salaryTable = await SalaryController.getSalaryTableByCode({ salaryTableCode });
				salaryTables.push(salaryTable);
			}

			return salaryTables;
		} catch (e) {
			return e;
		}
	}

	static async addSalaryPayment({ SalaryPaymentInput }) {
		try {
			const [monthCode, employeeID] = SalaryPaymentInput.salaryTableCode.split('_');
			const month = await MonthController.getMonthByCode(monthCode);

			const employee = await EmployeeController.getEmployeeByID(employeeID);

			if (!employee) {
				return new Error('Employee not found');
			}
			const salaryTable = await SalaryController.getSalaryTableByCode({
				salaryTableCode: SalaryPaymentInput.salaryTableCode
			});
			const newSalaryPayment = new SalaryPayment({
				payedCash: SalaryPaymentInput.payedCash,
				payedCashless: SalaryPaymentInput.payedCashless,
				month: month,
				date: new Date(Number(SalaryPaymentInput.date)),
                dayCode: SalaryPaymentInput.dayCode,
                monthCode: SalaryPaymentInput.monthCode,
				employee: employee,
				salaryTableCode: SalaryPaymentInput.salaryTableCode
			});
			const payedCash = SalaryPaymentInput.payedCash + salaryTable.payedCash;
			const payedCashless = SalaryPaymentInput.payedCashless + salaryTable.payedCashless;

			const savedSalaryPayment = await newSalaryPayment.save();
			await Salary.findOneAndUpdate(
				{ salaryTableCode: SalaryPaymentInput.salaryTableCode },
				{
					$set: {
						payedCash: payedCash,
						payedCashless: payedCashless
					},
					$push: { payments: savedSalaryPayment }
				}
			);

			return { ...savedSalaryPayment._doc, employee: { ...employee } };
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	static async deleteSalaryPayment({ SalaryPaymentID }) {
		try {
			const salaryPayment = await SalaryPayment.findByIdAndDelete(SalaryPaymentID);
			const salaryTable = await SalaryController.getSalaryTableByCode({
				salaryTableCode: salaryPayment.salaryTableCode
			});

			const payedCash = salaryTable.payedCash - salaryPayment.payedCash;
			const payedCashless = salaryTable.payedCashless - salaryPayment.payedCashless;

			await Salary.findByIdAndUpdate(salaryTable._id, {
				$set: {
					payedCash: payedCash,
					payedCashless: payedCashless
				},
				$pull: { payments: salaryPayment._id }
			});

			return 'Successfully deleted';
		} catch (error) {
			throw error;
		}
	}
}

export default SalaryController;
