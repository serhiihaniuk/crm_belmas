const bcrypt = require('bcryptjs');
const Employee = require('../../models/employee-model');
const EmployeeController = require('../../controllers/employee-controller');
const { validateCredentials } = require('../helpers/validate');
const { generateTokens } = require('../helpers/tokens');
module.exports = {
	Query: {
		getEmployee: async (parent, args, context) => {
			try {
				return await EmployeeController.getEmployee({ _id: args.id });
			} catch (err) {
				throw err;
			}
		},
		getEmployees: async (parent, args, context) => {
			try {
				const query = args.query || {};
				return await EmployeeController.getEmployees({ query });
			} catch (err) {
				throw err;
			}
		}
	},
	Mutation: {
		createEmployee: async (parent, { EmployeeInput }) => {
			try {
				validateCredentials(EmployeeInput.login, EmployeeInput.password);

				const candidate = await Employee.findOne({
					login: EmployeeInput.login
				});

				if (candidate) {
					return new Error('User already exists');
				}
				const { accessToken } = generateTokens({
					login: EmployeeInput.login
				});

				const newEmployee = new Employee({
					name: EmployeeInput.name,
					position: EmployeeInput.position,
					password: EmployeeInput.password,
					qualification: EmployeeInput.qualification,
					login: EmployeeInput.login,
					role: EmployeeInput.role
				});

				const salt = await bcrypt.genSalt(10);
				newEmployee.password = await bcrypt.hash(newEmployee.password, salt);

				const result = await newEmployee.save();

				return { ...result._doc, _id: result.id, password: null, accessToken };
			} catch (err) {
				throw err;
			}
		}
	}
};
