// @ts-nocheck
import jwt from "jsonwebtoken"


export const generateTokens = (payload) => {

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "22d",
    });
    const refreshToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "22d",
    });
    return { accessToken, refreshToken };
};
