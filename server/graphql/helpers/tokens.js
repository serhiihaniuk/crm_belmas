const jwt = require("jsonwebtoken");


const generateTokens = (payload) => {
    console.log('called', payload);
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "22d",
    });
    const refreshToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "7222d",
    });
    return { accessToken, refreshToken };
};

module.exports = {
    generateTokens,
};
