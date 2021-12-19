const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type Query {
        getAppointmentsTotalPrice(dateFrom: String, dateTo: String): TotalPrice!
        getAppointmentsByDate(
            AppointmentsByDatesInput: AppointmentsByDatesInput!
        ): [AppointmentsByDates!]!
        getEmployee(id: ID!): Employee!
        getEmployees(query: EmployeesQuery): [Employee!]!
        getMonthStats(monthCode: String!): MonthStats!
        login(login: String, password: String): AuthData!
        logout: Boolean!
        checkAuth: AuthData!
        getExpensesByMonth(monthCode: String!): [Expense!]!
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
        addNewExpense(newExpenseInput: ExpenseInput!): Expense!
        editExpense(expenseID: ID!, expenseInput: ExpenseInput!): Expense!
        deleteExpense(expenseID: ID!): String!
    }
    type MonthStats {
        _id: ID!
        monthCode: String!
        month: String!
        year: String!
        cashlessAtTheBeginning: Int!
        cash: Int!
        cashless: Int!
        currentCashless: Int!
        currentCash: Int!
        expensesCash: Int!
        expensesCashless: Int!
        appointments: [Appointment]!
        expenses: [Expense]!
        
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
    type Expense{
        _id: ID!
        description: String!
        cash: Int!
        cashless: Int!
        monthCode: String!
        invoice: Boolean!
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
    input ExpenseInput{
        cash: Int!
        cashless: Int!
        monthCode: String!
        invoice: Boolean!
        category: String!
        description: String!
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
