import jwt from 'jsonwebtoken';
import {JWTPayload} from '../resolvers/auth-resolver';
import log from '../../helpers/info';

export const generateTokens = (payload: JWTPayload) => {


    const accessTokenVar = process.env.ACCESS_TOKEN_SECRET;
    // const refreshTokenVar = process.env.REFRESH_TOKEN_SECRET;

    if (!accessTokenVar) {
        log.error('generateTokens', 'Missing tokens env variables');
        throw new Error('No access or refresh token secret');
    }

    const accessToken = jwt.sign(payload, accessTokenVar);
    // const refreshToken = jwt.sign(payload, refreshTokenVar, {
    //     expiresIn: '22d'
    // });

    log.info('generateTokens', `Generated tokens for user ${payload.name}`, accessToken);

    return {accessToken};
};
