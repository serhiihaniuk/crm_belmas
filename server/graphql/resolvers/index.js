import appointmentsResolver from './appointments-resolver.js';
import employeeResolver from './employee-resolver.js';
import authResolver from './auth-resolver.js';
import expensesResolver from './expenses-resolver.js';
import monthResolver from './month-resolver.js';
import salaryResolver from './salary-resolver.js';
import dayOffResolver from './day-off-resolver.js';
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
        ...dayOffResolver.Mutation,
        ...appointmentsResolver.Mutation,
        ...employeeResolver.Mutation,
        ...expensesResolver.Mutation,
        ...salaryResolver.Mutation
    }
};
export default rootResolver;
