import MonthController from './month-controller';
import EmployeeController from './employee-controller';
import Salary from '../models/salary-model';
import SalaryPayment from '../models/salary-payment-model';
import MonthTotal from '../models/month-total-model';
import { ISalaryTableCode } from 'salary-types';
import { DayCode, MonthCode } from 'date-types';

interface ISalaryPaymentInput {
	salaryTableCode: ISalaryTableCode;
	payedCash: number;
	payedCashless: number;
	date: Date;
	monthCode: MonthCode;
	dayCode: DayCode;
}

class SalaryController {
	static async createSalaryTable(salaryTableCode: ISalaryTableCode) {
		try {
			const [monthCode, employeeID] = salaryTableCode.split('_') as [MonthCode, string];
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

	static async getSalaryTableByCode({ salaryTableCode }: { salaryTableCode: ISalaryTableCode }) {
		const [, employeeID] = salaryTableCode.split('_') as [MonthCode, string];
		try {
			let salaryTable = await Salary.findOne({
				salaryTableCode: salaryTableCode
			}).populate('payments');
			if (!salaryTable) {
				salaryTable = await SalaryController.createSalaryTable(salaryTableCode);
			}
            salaryTable.employee = await EmployeeController.getEmployeeByID(employeeID);

			return salaryTable
		} catch (e) {
			throw e;
		}
	}

	static async getSalaryTablesByMonth({ monthCode }: { monthCode: MonthCode }) {
		try {
			const employees = await EmployeeController.getEmployees();
			let salaryTables = [];
			for (let employee of employees) {
				const salaryTableCode = `${monthCode}_${employee._id}` as ISalaryTableCode;
				const salaryTable = await SalaryController.getSalaryTableByCode({ salaryTableCode });
				salaryTables.push(salaryTable);
			}

			return salaryTables;
		} catch (e) {
			return e;
		}
	}

	static async addSalaryPayment({ SalaryPaymentInput }: { SalaryPaymentInput: ISalaryPaymentInput }) {
		try {
			const [monthCode, employeeID] = SalaryPaymentInput.salaryTableCode.split('_') as [MonthCode, string];
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


            savedSalaryPayment.employee = employee
			return savedSalaryPayment
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	static async deleteSalaryPayment({
		SalaryPaymentID
	}: {
		SalaryPaymentID: string;
	}): Promise<'Successfully deleted'> {
		try {
			const salaryPayment = await SalaryPayment.findByIdAndDelete(SalaryPaymentID);

            if(!salaryPayment) {
                throw new Error('Salary payment not found')
            }

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
			} as any);

			return 'Successfully deleted';
		} catch (error) {
			throw error;
		}
	}
}

export default SalaryController;
