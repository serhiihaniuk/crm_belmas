import appointmentsResolver from './appointments-resolver';
import employeeResolver from './employee-resolver';
import authResolver from './auth-resolver';
import expensesResolver from './expenses-resolver';
import monthResolver from './month-resolver';
import salaryResolver from './salary-resolver';
import dayOffResolver from './day-off-resolver';
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
