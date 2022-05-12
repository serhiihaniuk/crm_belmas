import jwt from 'jsonwebtoken'
import ApiError from './api-error.js'
import Employee from '../../models/employee-model.js'
const checkAuthAndResolve = async (authorization, expectedRoles, controller) => {
	const token = authorization.split(' ')[1];

	try {
		const jwtPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		const employee = await Employee.findById(jwtPayload.id);

		const hasAccess = expectedRoles.some((role) => employee.role.includes(role));

		if (hasAccess || employee.role.includes('root')) {
			return controller.apply(this);
		}

		return new ApiError.ForbiddenError();
	} catch (err) {
		console.log({ err });
        return new ApiError.ForbiddenError();
	}
};

export default checkAuthAndResolve;
