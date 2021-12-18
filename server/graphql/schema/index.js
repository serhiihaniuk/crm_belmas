const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    getAppointmentsTotalPrice(dateFrom: String, dateTo: String): TotalPrice!
    getAppointmentsByDate(
      AppointmentsByDatesInput: AppointmentsByDatesInput!
    ): [AppointmentsByDates!]!
    getEmployee(id: ID!): Employee!
    getEmployees(query: EmployeesQuery): [Employee!]!
    login(login: String, password: String): AuthData!
    logout: Boolean!
    checkAuth: AuthData!
  }
  type Mutation {
    createAppointment(AppointmentInput: AppointmentInput): Appointment
    updateAppointment(
      appointmentID: ID!
      AppointmentInput: AppointmentInput!
    ): Appointment
    calculateAppointment(
      id: ID!
      cash: Int!
      cashless: Int!
      paymentMethod: String!
    ): Appointment!
    deleteAppointment(id: ID!): String
    createEmployee(EmployeeInput: EmployeeInput): Employee
  }
  type Appointment {
    _id: ID!
    client: String!
    description: String
    cash: Int
    cashless: Int
    paymentMethod: String
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
    monthCode: String!
  }
  input AppointmentsByDatesInput {
    dateFrom: String!
    dateTo: String!
    employee: ID
  }
  input EmployeesQuery {
    position: String
    qualification: String
    role: String
  }
  type AppointmentsByDates {
    date: String!
    appointments: [Appointment]!
  }
  type TotalPrice {
    cash: Int!
    cashless: Int!
  }
`;
module.exports = { typeDefs };
