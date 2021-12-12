const jwt = require("jsonwebtoken");
const ApiError = require("./api-error");

const checkAuthAndResolve = (authorization, expectedRole, controller) => {
  const token = authorization.split(" ")[1];
  try {
    const jwtPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (jwtPayload.role === expectedRole) {
      return controller.apply(this, arguments);
    }
  } catch (err) {
    return ApiError.UnauthorizedError()
  }
};

module.exports = checkAuthAndResolve;
