import { gql } from '@apollo/client';

export const ADD_NEW_EXPENSE = gql`
    mutation ADD_NEW_EXPENSE($ExpenseInput: ExpenseInput!) {
        addNewExpense(ExpenseInput: $ExpenseInput) {
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
    mutation DELETE_EXPENSE($ExpenseID: ID!) {
        deleteExpense(ExpenseID: $ExpenseID)
    }
`;

export const EDIT_EXPENSE = gql`
    mutation EDIT_EXPENSE($ExpenseID: ID!, $ExpenseInput: ExpenseInput!) {
        editExpense(ExpenseID: $ExpenseID, ExpenseInput: $ExpenseInput) {
            _id
            description
            cash
            cashless
            category
            date
        }
    }
`;
