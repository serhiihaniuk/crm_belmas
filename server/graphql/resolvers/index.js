const appointmentsResolver = require("./appointments-resolver");
const employeeResolver = require("./employee-resolver");
const authResolver = require("./auth-resolver");
const expensesResolver = require("./expenses-resolver");
const monthResolver = require("./month-resolver");
const salaryResolver = require("./salary-resolver");


const rootResolver = {
  Query: {
    ...appointmentsResolver.Query,
    ...employeeResolver.Query,
    ...monthResolver.Query,
    ...expensesResolver.Query,
    ...salaryResolver.Query,
    ...authResolver
  },
  Mutation: {
    ...appointmentsResolver.Mutation,
    ...employeeResolver.Mutation,
    ...expensesResolver.Mutation,
    ...salaryResolver.Mutation
  }
};
module.exports = rootResolver;
