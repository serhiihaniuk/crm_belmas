import { gql } from 'apollo-server-express';

const Types = gql`
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
        salaryCash: Int!
        salaryCashless: Int!
        appointments: [Appointment]!
        expenses: [Expense]!
    }
    type Appointment {
        _id: ID!
        client: String!
        description: String
        time: String!
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
        monthCode: String!
        dayCode: String!
    }
    type Expense {
        _id: ID!
        description: String!
        cash: Int!
        cashless: Int!
        invoice: Boolean!
        category: String!
        date: String!
    }
    type Employee {
        _id: ID!
        name: String!
        position: String!
        qualification: String!
        role: [String!]!
        login: String!
        password: String
    }
    type AuthData {
        accessToken: String!
        employee: Employee!
    }
    input EmployeeInput {
        name: String!
        position: String!
        qualification: String!
        role: [String!]!
        login: String!
        password: String
    }
    input AppointmentInput {
        client: String!
        description: String
        date: String!
        time: String!
        instagram: String
        procedure: String!
        employee: String!
        creator: String!
        monthCode: String!
        dayCode: String!
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

    input ExpenseInput {
        cash: Int!
        cashless: Int!
        monthCode: String!
        invoice: Boolean!
        category: String!
        description: String!
        date: String!
    }
    type AppointmentsByDates {
        date: String!
        appointments: [Appointment]!
    }
    type TotalPrice {
        cash: Int!
        cashless: Int!
    }
    type SalaryTable {
        _id: ID!
        salaryTableCode: String!
        employee: Employee!
        totalEarned: Int!
        payedCash: Int!
        payedCashless: Int!
        tips: Int!
        month: String!
        payments: [SalaryPayment]
    }
    type SalaryPayment {
        _id: ID!
        employee: Employee!
        salaryTableCode: String!
        payedCash: Int!
        payedCashless: Int!
        date: String!
    }
    input SalaryPaymentInput {
        employee: String!
        salaryTableCode: String!
        payedCash: Int!
        payedCashless: Int!
        date: String!
        monthCode: String!
    }
    input DayOffInput {
        employeeID: String!
        dayCode: String!
    }

    type DayOff {
        _id: ID!
        employee: Employee!
        day: Day!
    }

    type Day {
        _id: ID!
        dayCode: String!
        dayOff: [DayOff!]!
    }
`;

const Query = gql`
    type Query {
        getAppointmentsTotalPrice(dateFrom: String, dateTo: String): TotalPrice!
        getAppointmentsByDate(AppointmentsByDatesInput: AppointmentsByDatesInput!): [AppointmentsByDates!]!
        getEmployee(id: ID!): Employee!
        getEmployees(query: EmployeesQuery): [Employee!]!
        getMonthStats(monthCode: String!): MonthStats!
        login(login: String!, password: String!): AuthData!
        logout: Boolean!
        checkAuth: AuthData!
        getExpensesByMonth(monthCode: String!): [Expense!]!
        getSalaryTableByCode(salaryTableCode: String!): SalaryTable!
        getSalaryTablesByMonth(monthCode: String!): [SalaryTable!]!
    }
`;

const Mutation = gql`
    type Mutation {
        createAppointment(AppointmentInput: AppointmentInput): Appointment
        updateAppointment(appointmentID: ID!, AppointmentInput: AppointmentInput!): Appointment
        calculateAppointment(id: ID!, cash: Int!, cashless: Int!, paymentMethod: String!): Appointment!
        deleteAppointment(id: ID!): String!
        createEmployee(EmployeeInput: EmployeeInput): Employee!
        addNewExpense(ExpenseInput: ExpenseInput!): Expense!
        editExpense(ExpenseID: ID!, ExpenseInput: ExpenseInput!): Expense!
        deleteExpense(ExpenseID: ID!): String!
        addSalaryPayment(SalaryPaymentInput: SalaryPaymentInput!): SalaryPayment!
        deleteSalaryPayment(SalaryPaymentID: ID!): String!
        createDayOff(DayOffInput: DayOffInput!): DayOff!
        deleteDayOff(DayOffID: ID!): DayOff
    }
`;

export const typeDefs = [Types, Query, Mutation]

