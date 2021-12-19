const appointmentsResolver = require("./appointments-resolver");
const employeeResolver = require("./employee-resolver");
const authResolver = require("./auth-resolver");
const expensesResolver = require("./expenses-resolver");
const monthResolver = require("./month-resolver");



const rootResolver = {
  Query: {
    ...appointmentsResolver.Query,
    ...employeeResolver.Query,
    ...monthResolver.Query,
    ...authResolver
  },
  Mutation: {
    ...appointmentsResolver.Mutation,
    ...employeeResolver.Mutation,
    ...expensesResolver.Mutation
  }
};
module.exports = rootResolver;
