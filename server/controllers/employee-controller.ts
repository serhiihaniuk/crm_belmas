import Employee from '../models/employee-model';
import { IEmployee } from 'employee-types';
import {MongoResponse} from "./controller-types";

class EmployeeController {
	async getEmployee(query: any, withPassword = false): Promise<MongoResponse<IEmployee>> {
		try {
			const employee = await Employee.findOne({ query });

			if (!employee) throw new Error('Employee not found');

			if (!withPassword) {
				employee.password = null;
			}

			return employee;
		} catch (err) {
			throw err;
		}
	}

	async getEmployeeByID(id: string, withPassword = false): Promise<MongoResponse<IEmployee>> {
		try {
			const employee = await Employee.findById(id);

			if (!employee) throw new Error('Employee not found');

			if (!withPassword) {
				employee.password = null;
			}

			return employee;
		} catch (err) {
			throw err;
		}
	}

	async getEmployees(args?: any): Promise<IEmployee[]> {
		const searchQuery = args?.query?.role
			? {
					role: { $in: [args.query.role] }
			  }
			: {};

		try {
			const employees = await Employee.find(searchQuery);
			return employees.map((employee) => {
				employee.password = null;
				return employee;
			});
		} catch (err) {
			console.log(err);
			throw err;
		}
	}
}

export default new EmployeeController();
