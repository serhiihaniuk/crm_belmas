import Employee from '../models/employee-model';
import { IEmployee } from 'employee-types';
import {MongoResponse} from "./controller-types";
import log from "../helpers/info";

const controllerName = 'EmployeeController.';
const logInfo = (method: string, message: string, a:any = ''): void => {
    log.info(`${controllerName}${method}`, message, a);
};

class EmployeeController {
	async getEmployee(query: any, withPassword = false): Promise<MongoResponse<IEmployee>> {

        logInfo('getEmployee', `query: ${JSON.stringify(query)}`);
		try {
			const employee = await Employee.findOne({ query });

			if (!employee) {
                log.error(`${controllerName}getEmployee`, `Employee not found`);
                throw new Error('Employee not found');
            }

			if (!withPassword) {
				employee.password = null;
			}

            logInfo('getEmployee', `employee: ${JSON.stringify(employee)}`);
			return employee;
		} catch (err) {
            log.error(`${controllerName}getEmployee`, `Error: ${err}`);
			throw err;
		}
	}

	async getEmployeeByID(id: string, withPassword = false): Promise<MongoResponse<IEmployee>> {
        logInfo('getEmployeeByID', `id: ${id}`);
		try {
			const employee = await Employee.findById(id);

			if (!employee) {
                log.error(`${controllerName}getEmployeeByID`, `Employee not found`);
                throw new Error('Employee not found');
			}

			if (!withPassword) {
				employee.password = null;
			}


            logInfo('getEmployeeByID', `Success! employee: `, employee);

			return employee;
		} catch (err) {
            log.error(`${controllerName}getEmployeeByID`, `Error: ${err}`);
			throw err;
		}
	}

	async getEmployees(args?: any): Promise<IEmployee[]> {
        logInfo('getEmployees', `args: ${JSON.stringify(args)}`);
		const searchQuery = args?.query?.role
			? {
					role: { $in: [args.query.role] }
			  }
			: {};

		try {
			const employees = await Employee.find(searchQuery);

            logInfo('getEmployees', `employees: ${JSON.stringify(employees.map(e=>e.name))}`);
			return employees.map((employee) => {
				employee.password = null;
				return employee;
			});
		} catch (err) {
            log.error(`${controllerName}getEmployees`, `Error: ${err}`);
			throw err;
		}
	}
}

export default new EmployeeController();
