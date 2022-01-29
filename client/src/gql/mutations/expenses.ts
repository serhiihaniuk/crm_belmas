import { gql } from '@apollo/client';

export const ADD_NEW_EXPENSE = gql`
    query ADD_NEW_EXPENSE($expenseInput: ExpenseInput!) {
        addNewExpense(ExpenseInput: $expenseInput) {
            _id
            description
            cash
            cashless
            category
            date
        }
    }
`;

export const DELETE_EXPENSE = gql`
    query DELETE_EXPENSE($ExpenseID: ExpenseID!) {
        deleteExpense(ExpenseID: $ExpenseID)
    }
`;

export const EDIT_EXPENSE = gql`
    query EDIT_EXPENSE($expenseID: ExpenseID!, $expenseInput: ExpenseInput!) {
        addNewExpense(ExpenseID: $expenseID, ExpenseInput: $expenseInput) {
            _id
            description
            cash
            cashless
            category
            date
        }
    }
`;
