import { gql } from 'apollo-server-express';

const Types = gql`
	type Expense {
		_id: ID!
		description: String!
		cash: Int!
		cashless: Int!
		invoice: Boolean!
		category: String!
		date: String!
		monthCode: String!
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

	type TotalPrice {
		cash: Int!
		cashless: Int!
	}

	type AuthData {
		accessToken: String!
		employee: Employee!
	}
`;

const DayTypes = gql`
	type DayOff {
		_id: ID!
		employee: Employee!
		day: Day!
	}

	type Day {
		_id: ID!
		dayCode: String!
		dayOff: [DayOff!]!
		appointments: [Appointment!]!
		isOff: Boolean
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
		checkAuth: AuthData
		getExpensesByMonth(monthCode: String!): [Expense!]!
		getSalaryTableByCode(salaryTableCode: String!): SalaryTable!
		getSalaryTablesByMonth(monthCode: String!): [SalaryTable!]!
		getDaysInRange(from: String!, to: String!, employeeID: String!): [Day!]!
		getProcedures(typeOf: String): [Procedure!]!
	}
`;

const Mutation = gql`
    type Mutation {
        createAppointment(AppointmentInput: AppointmentInput!): Appointment
        updateAppointment(appointmentID: ID!, AppointmentInput: AppointmentInput!): Appointment
        calculateAppointment(id: ID!, cash: Int!, cashless: Int!, paymentMethod: String!): Appointment!
        deleteAppointment(id: ID!): String!
        createEmployee(EmployeeInput: EmployeeInput): Employee!
        addNewExpense(ExpenseInput: ExpenseInput!): Expense!
        editExpense(ExpenseID: ID!, ExpenseInput: ExpenseInput!): Expense!
        deleteExpense(ExpenseID: ID!): String!
        addSalaryPayment(SalaryPaymentInput: SalaryPaymentInput!): SalaryPayment!
        deleteSalaryPayment(SalaryPaymentID: ID!): String!
        createDayOff(employeeID: String!, dayCode: String): DayOff
        deleteDayOff(dayOffID: String!): DayOff
        addProcedure(typeOf: String!, procedure: String!,  procedureCode: String!, duration: Int!): Procedure!
    }
`;

const MonthTypes = gql`
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
`;

const AppointmentTypes = gql`
	type AppointmentsByDates {
		date: String!
		appointments: [Appointment]!
	}

	input AppointmentInput {
		client: String!
		description: String
		date: String!
		time: String!
		instagram: String
		procedureCode: String!
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
		procedure: Procedure!
		status: String!
		employee: Employee!
		creator: String!
		createdAt: String!
		monthCode: String!
		dayCode: String!
	}
`;

const SalaryType = gql`
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
		monthCode: String!
		dayCode: String!
	}

	input SalaryPaymentInput {
		salaryTableCode: String!
		payedCash: Int!
		payedCashless: Int!
		date: String!
		monthCode: String!
		dayCode: String!
	}
`;

const EmployeeTypes = gql`
	input EmployeesQuery {
		position: String
		qualification: String
		role: String
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

	input EmployeeInput {
		name: String!
		position: String!
		qualification: String!
		role: [String!]!
		login: String!
		password: String
	}
`;

const ProcedureTypes = gql`
	type Procedure {
        typeOf: String!
		procedure: String!
		procedureCode: String!
		duration: Int!
	}
`;

export const typeDefs = [
	Types,
	Query,
	Mutation,
	SalaryType,
	AppointmentTypes,
	EmployeeTypes,
	MonthTypes,
	DayTypes,
	ProcedureTypes
];
