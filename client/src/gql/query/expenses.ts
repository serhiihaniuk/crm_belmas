import { gql } from '@apollo/client';

export const GET_EXPENSES_BY_MONTH = gql`
    query GET_EXPENSES_BY_MONTH($monthCode: String!) {
        getExpensesByMonth(monthCode: $monthCode) {
            _id
            description
            cash
            cashless
            invoice
            category
            date
            monthCode
        }
    }
`;
