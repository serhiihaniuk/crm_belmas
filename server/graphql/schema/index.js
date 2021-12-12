const {gql} = require("apollo-server-express");

const typeDefs = gql`
    type Query {
        getAppointments(employee: ID, dateFrom: String, dateTo: String, sortBy: String): [Appointment!]!
        getEmployee(id: ID!): Employee!
        getEmployees(query: EmployeesQuery): [Employee!]!
        login(login: String, password: String): AuthData!
        logout: Boolean!
        checkAuth: AuthData!
    }
    type Mutation {
        createAppointment(AppointmentInput: AppointmentInput): Appointment
        updateAppointment(id: ID!, AppointmentInput: AppointmentInput): Appointment
        calculateAppointment(id: ID!, price: Float!): Appointment
        deleteAppointment(id: ID!): String
        createEmployee(EmployeeInput: EmployeeInput): Employee
    }
    type Appointment {
        _id: ID!
        client: String!
        description: String
        price: Float
        date: String!
        instagram: String
        procedure: String!
        status: String!
        employee: Employee!
        creator: String!
        createdAt: String!
    }
    type Employee {
        _id: ID!
        name: String!
        position: String!
        qualification: String!
        role: String!
        login: String!
        password: String
        refreshToken: String
        appointments: [Appointment]!
    }
    type AuthData {
        accessToken: String!
        employee: Employee!
    }
    input EmployeeInput {
        name: String!
        position: String!
        qualification: String!
        role: String!
        login: String!
        password: String
    }
    input AppointmentInput {
        client: String!
        description: String
        date: String!
        instagram: String
        procedure: String!
        employee: String!
        creator: String!
    }
    input EmployeesQuery{
        position: String
        qualification: String
        role: String
    }
`;
module.exports = { typeDefs };
