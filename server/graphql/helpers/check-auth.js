const jwt = require('jsonwebtoken');
const ApiError = require('./api-error');
const Employee = require('../../models/employee-model');
const checkAuthAndResolve = async (authorization, expectedRoles, controller) => {
	const token = authorization.split(' ')[1];

	try {
		const jwtPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		const employee = await Employee.findById(jwtPayload.id);

		const hasAccess = expectedRoles.some((role) => employee.role.includes(role));

		if (hasAccess || employee.role.includes('root')) {
			return controller.apply(this, arguments);
		}

		return new ApiError('No access', 403);
	} catch (err) {
		console.log({ err });
		return ApiError.UnauthorizedError(err);
	}
};

module.exports = checkAuthAndResolve;
