const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { getEmployeeFromDB } = require("./merge-resolvers");
const { generateTokens } = require("../helpers/tokens");
const ApiError = require("../helpers/api-error");
const Employee = require("../../models/employee-model");

const login = async (parent, { login, password }) => {
  try {
    const employee = await Employee.findOne({ login: login })

    if (!employee) {
      return new Error("No such user");
    }
    console.log(123)
    console.log(login, password)
    console.log(345)
    const isPasswordValid = bcrypt.compareSync(password, employee.password);
    if (!isPasswordValid) {
      return new Error("Invalid password");
    }

    const { accessToken } = generateTokens({
      ...employee,
      password: null,
    });

    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: false,
    //   maxAge: 1000 * 60 * 60 * 24 * 7,
    // });
    //
    // setCookies.push({
    //   name: "refreshToken",
    //   value: refreshToken,
    //   options: {
    //     httpOnly: true,
    //     maxAge: 1000 * 60 * 60 * 24 * 7,
    //   },
    // });

    return {
      accessToken,
      employee,
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
  const token = req.headers.authorization.split(" ")[1];

  const verifyJWT = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const employee = await getEmployeeFromDB(verifyJWT.login);
  if (!employee) {
    return ApiError.UnauthorizedError();
  }

  const { accessToken } = generateTokens({
    ...employee,
    password: null,
  });

  return {
    accessToken,
    employee,
  };
};

module.exports = {
  login,
  logout,
  checkAuth,
};
