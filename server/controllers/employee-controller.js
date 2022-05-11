const Employee = require('../models/employee-model');
const AppointmentController = require('./appointment-controller');

class EmployeeController {
	async getEmployee(query, withPassword = false) {
		try {
			const employee = await Employee.findOne({ query });

			if (!withPassword) {
				employee._doc.password = null;
			}

			return {
				...employee._doc,
				_id: employee.id
			};
		} catch (err) {
			throw err;
		}
	}

	async getEmployeeByID(id, withPassword = false) {
		try {
			const employee = await Employee.findById(id);
			if (!withPassword) {
				employee._doc.password = null;
			}

			return {
				...employee._doc,
				_id: employee.id
			};
		} catch (err) {
			throw err;
		}
	}

	async getEmployees(args) {

		const searchQuery = args?.query?.role
			? {
					role: { $in: [args.query.role] }
			  }
			: {};

		try {

			const employees = await Employee.find(searchQuery);
			return employees.map((employee) => {
				return {
					...employee._doc,
					_id: employee.id
				};
			});
		} catch (err) {
			console.log(err);
			throw err;
		}
	}
}

module.exports = new EmployeeController();
