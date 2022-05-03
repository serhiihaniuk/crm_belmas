const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { generateTokens } = require('../helpers/tokens');
const ApiError = require('../helpers/api-error');
const Employee = require('../../models/employee-model');

const login = async (parent, { login, password }, context) => {
	try {
		const employee = await Employee.findOne({ login: login });

		if (!employee) {
			return new Error('No such user');
		}

		const isPasswordValid = bcrypt.compareSync(password, employee.password);
		if (!isPasswordValid) {
			return new Error('Invalid password');
		}

		const { accessToken } = generateTokens({
			id: employee._id,
			name: employee.name,
			position: employee.position
		});
		const { res } = context;
		res.cookie('access', accessToken, { httpOnly: true });
		return {
			accessToken,
			employee
		};
	} catch (error) {
		throw new Error(error);
	}
};

const logout = async (parent, args, { res }) => {
	try {
		return true;
	} catch (error) {
		throw new Error(error);
	}
};

const checkAuth = async (parent, args, { req, res }) => {
	const token = req.headers.authorization.split(' ')[1];

	const verifyJWT = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

	const employee = await Employee.findOne({ _id: verifyJWT.id });

	if (!employee) {
		return ApiError.UnauthorizedError();
	}

	const { accessToken } = generateTokens({
		id: employee._id,
		name: employee.name,
		position: employee.position
	});
	res.cookie('access', accessToken, { httpOnly: true });
	return {
		accessToken,
		employee
	};
};

module.exports = {
    login,
    logout,
    checkAuth
};
