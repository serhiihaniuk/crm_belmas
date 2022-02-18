const jwt = require("jsonwebtoken");
const ApiError = require("./api-error");
const Employee = require("../../models/employee-model")
const checkAuthAndResolve = async (authorization, expectedRole, controller) => {
  const token = authorization.split(" ")[1];

  try {
    const jwtPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const employee = await Employee.findOne({
      where: {
        id: jwtPayload.id,
      }
    });

    if (employee.role === expectedRole) {
      return controller.apply(this, arguments);
    }
  } catch (err) {
    return ApiError.UnauthorizedError()
  }
};

module.exports = checkAuthAndResolve;
