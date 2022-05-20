// @ts-nocheck
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { generateTokens } from '../helpers/tokens'
import ApiError from '../helpers/api-error'
import Employee from '../../models/employee-model'

export interface JWTPayload {
    id: string;
    name: string;
    position: string;
    role: string[]
}

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
			position: employee.position,
            role: employee.role
		});
		const { res } = context;
		res.cookie('access', accessToken, { httpOnly: true });
		return {
			accessToken,
			employee
		};
	} catch (error) {
        console.error(error);
		throw new Error(error);
	}
};

const logout = async (parent, args, { res }) => {
	try {
		return true;
	} catch (error) {
        console.error(error);
		throw new Error(error);
	}
};

const checkAuth = async (parent, args, { req, res }) => {
	try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return false
        const verifyJWT = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const employee = await Employee.findOne({ _id: verifyJWT.id });

        if (!employee) {
            return ApiError.UnauthorizedError();
        }

        const { accessToken } = generateTokens({
            id: employee._id,
            name: employee.name,
            position: employee.position,
            role: employee.role
        });
        res.cookie('access', accessToken, { httpOnly: true });
        return {
            accessToken,
            employee
        };
    } catch (e) {
        return null
    }
};

export default {
    login,
    logout,
    checkAuth
};
