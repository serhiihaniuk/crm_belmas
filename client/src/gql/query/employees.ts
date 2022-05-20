import { gql } from '@apollo/client';

export const GET_EMPLOYEES = gql`
    query GET_EMPLOYEES($query: EmployeesQuery) {
        getEmployees(query: $query) {
            name
            _id
            position
            occupation
            qualification
            role
            login
        }
    }
`;