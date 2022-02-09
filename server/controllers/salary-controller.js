const MonthController = require('./month-controller');
const EmployeeController = require('./employee-controller');
const Salary = require('../models/salary-model');
const SalaryPayment = require('../models/salary-payment-model');
const MonthTotal = require('../models/month-total-model');
// salaryTableCode: "2021-12_61b2467ea827d113c5e46ac7"
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
				month: month,
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
			});
			if (!salaryTable) {
				salaryTable = await SalaryController.createSalaryTable(salaryTableCode);
			}
			const employee = await EmployeeController.getEmployeeByID(employeeID);

			return { ...salaryTable._doc, _id: salaryTable.id, employee: { ...employee } };
		} catch (e) {
			throw e;
		}
	}

	static async addSalaryPayment({ SalaryPaymentInput }) {
		try {
			const [monthCode, employeeID] = SalaryPaymentInput.salaryTableCode.split('_');
			const month = await MonthController.getMonthByCode(monthCode);

			const employee = await EmployeeController.getEmployeeByID(employeeID);

            if(!employee) {
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
						payedCashless: payedCashless,
					},
					$push: { payments: savedSalaryPayment }
				}
			);

			return savedSalaryPayment;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
}

module.exports = SalaryController;
