import { gql } from '@apollo/client';

export interface IGetEmployees {
    getEmployees: IEmployee[];
}

export interface IEmployee {
    name: string;
    _id: string;
    position: string;
    qualification: string;
    role: string;
    login: string;
}

export const GET_EMPLOYEES = gql`
    query GET_EMPLOYEES($query: EmployeesQuery) {
        getEmployees(query: $query) {
            name
            _id
            position
            qualification
            role
            login
        }
    }
`;
