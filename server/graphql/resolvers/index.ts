import appointmentsResolver from './appointments-resolver';
import employeeResolver from './employee-resolver';
import authResolver from './auth-resolver';
import expensesResolver from './expenses-resolver';
import monthResolver from './month-resolver';
import salaryResolver from './salary-resolver';
import dayOffResolver from './day-off-resolver';
import dayResolver from './day-resolver';
import procedureResolver from './procedure-resolver';
const rootResolver = {
    Query: {
        ...appointmentsResolver.Query,
        ...employeeResolver.Query,
        ...monthResolver.Query,
        ...expensesResolver.Query,
        ...salaryResolver.Query,
        ...dayResolver.Query,
        ...procedureResolver.Query,
        ...authResolver
    },
    Mutation: {
        ...dayOffResolver.Mutation,
        ...appointmentsResolver.Mutation,
        ...employeeResolver.Mutation,
        ...expensesResolver.Mutation,
        ...procedureResolver.Mutation,
        ...salaryResolver.Mutation
    }
};
export default rootResolver;
