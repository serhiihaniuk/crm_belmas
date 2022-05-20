import jwt from 'jsonwebtoken'
import ApiError from './api-error'
import Employee from '../../models/employee-model'
import {IRoles} from "employee-types";
import {JWTPayload} from "../resolvers/auth-resolver";
import log from '../../helpers/info'

const checkAuthAndResolve = async (authorization: string, expectedRoles: IRoles[], controller: ()=>unknown) => {
	const token = authorization.split(' ')[1];
    return controller.apply(this);
	// try {
    //     const secretToken = process.env.ACCESS_TOKEN_SECRET;
    //     if(!secretToken) throw new Error('ACCESS_TOKEN_SECRET is not defined');
    //
	// 	const jwtPayload = jwt.verify(token, secretToken) as JWTPayload;
    //
    //     log.info('checkAuthAndResolve', 'Payload:', jwtPayload)
    //
	// 	const employee = await Employee.findById(jwtPayload.id);
    //
    //     if(!employee) throw new Error('Employee not found');
    //
	// 	const hasAccess = expectedRoles.some((role) => employee.role.includes(role));
    //
	// 	if (hasAccess || employee.role.includes('root')) {
	// 		return controller.apply(this);
	// 	}
    //
    //     //@ts-ignore
	// 	throw new ApiError.ForbiddenError();
	// } catch (err) {
	// 	console.log({ err });
    //
    //     //@ts-ignore
    //     throw new ApiError.ForbiddenError();
	// }
};

export default checkAuthAndResolve;
