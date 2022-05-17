import MonthController from './month-controller';
import EmployeeController from './employee-controller';
import Salary from '../models/salary-model';
import SalaryPayment from '../models/salary-payment-model';
import MonthTotal from '../models/month-total-model';
import { ISalaryTable, ISalaryTableCode } from 'salary-types';
import { DayCode, MonthCode } from 'date-types';
import log from '../helpers/info';
import { MongoResponse } from './controller-types';

const controllerName = 'MonthController.';
const logInfo = (method: string, message: string): void => {
	log.info(`${controllerName}${method}`, message);
};

interface ISalaryPaymentInput {
	salaryTableCode: ISalaryTableCode;
	payedCash: number;
	payedCashless: number;
	date: Date;
	monthCode: MonthCode;
	dayCode: DayCode;
}

class SalaryController {
	static async createSalaryTable(salaryTableCode: ISalaryTableCode): Promise<MongoResponse<ISalaryTable>> {
		logInfo('createSalaryTable', `Creating salary table ${salaryTableCode}`);

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

			logInfo('createSalaryTable', `Created salary table ${salaryTableCode}`);

			return newSalaryTableSaved;
		} catch (e) {
			throw e;
		}
	}

	static async getSalaryTableByCode({
		salaryTableCode
	}: {
		salaryTableCode: ISalaryTableCode;
	}): Promise<MongoResponse<ISalaryTable>> {
		
		logInfo('getSalaryTableByCode', `Getting salary table ${salaryTableCode}`);
		
		const [, employeeID] = salaryTableCode.split('_') as [MonthCode, string];
		try {
			let salaryTable = await Salary.findOne({
				salaryTableCode: salaryTableCode
			}).populate('payments');

			if (!salaryTable) {
				salaryTable = await SalaryController.createSalaryTable(salaryTableCode);
			}
			salaryTable.employee = await EmployeeController.getEmployeeByID(employeeID);

			logInfo('getSalaryTableByCode', `Got salary table ${salaryTableCode}`);
			
			return salaryTable;
		} catch (e) {
			logInfo('getSalaryTableByCode', `Error getting salary table ${salaryTableCode}`);
			throw e;
		}
	}

	static async getSalaryTablesByMonth({ monthCode }: { monthCode: MonthCode }): Promise<MongoResponse<ISalaryTable>[]> {
		try {
			
			logInfo('getSalaryTablesByMonth', `Getting salary tables for month ${monthCode}`);
			
			const employees = await EmployeeController.getEmployees();
			let salaryTables = [];
			for (let employee of employees) {
				const salaryTableCode = `${monthCode}_${employee._id}` as ISalaryTableCode;
				const salaryTable = await SalaryController.getSalaryTableByCode({ salaryTableCode });
				salaryTables.push(salaryTable);
			}

			logInfo('getSalaryTablesByMonth', `Got salary tables for month ${monthCode}, length: ${salaryTables.length}`);
			
			return salaryTables;
		} catch (e) {
			logInfo('getSalaryTablesByMonth', `Error getting salary tables for month ${monthCode}`);
			throw e;
		}
	}

	static async addSalaryPayment({ SalaryPaymentInput }: { SalaryPaymentInput: ISalaryPaymentInput }) {
		logInfo('addSalaryPayment', `Adding salary payment for ${JSON.stringify(SalaryPaymentInput)}`);
		
		try {
			const [monthCode, employeeID] = SalaryPaymentInput.salaryTableCode.split('_') as [MonthCode, string];
			const month = await MonthController.getMonthByCode(monthCode);

			const employee = await EmployeeController.getEmployeeByID(employeeID);

			if (!employee) {
				throw new Error(`Employee with id ${employeeID} not found`);
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

			savedSalaryPayment.employee = employee;
			
			logInfo('addSalaryPayment', `Added salary payment ${SalaryPaymentInput.salaryTableCode}`);
			return savedSalaryPayment;
		} catch (error) {
			log.error('addSalaryPayment', `Error adding salary payment: ${error}`);
			throw error;
		}
	}

	static async deleteSalaryPayment({
		SalaryPaymentID
	}: {
		SalaryPaymentID: string;
	}): Promise<'Successfully deleted'> {
		logInfo('deleteSalaryPayment', `Deleting salary payment ${SalaryPaymentID}`);
		try {
			const salaryPayment = await SalaryPayment.findByIdAndDelete(SalaryPaymentID);

			if (!salaryPayment) {
				throw new Error('Salary payment not found');
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

			logInfo('deleteSalaryPayment', `Deleted salary payment ${SalaryPaymentID}`);
			return 'Successfully deleted';
		} catch (error) {
			log.error('deleteSalaryPayment', `Error deleting salary payment ${SalaryPaymentID}`);
			throw error;
		}
	}
}

export default SalaryController;
