const appointmentsResolver = require("./appointments-resolver");
const employeeResolver = require("./employee-resolver");
const authResolver = require("./auth-resolver");


const rootResolver = {
  Query: {
    ...appointmentsResolver.Query,
    ...employeeResolver.Query,
    ...authResolver
  },
  Mutation: {
    ...appointmentsResolver.Mutation,
    ...employeeResolver.Mutation,
  }
};
module.exports = rootResolver;
