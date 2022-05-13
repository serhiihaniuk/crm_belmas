import { gql } from '@apollo/client';

export const ADD_NEW_SALARY_PAYMENT = gql`
    mutation ADD_NEW_SALARY_PAYMENT($SalaryPaymentInput: SalaryPaymentInput!) {
        addSalaryPayment(SalaryPaymentInput: $SalaryPaymentInput) {
            _id
            employee {
                name
                _id
            }
            payedCash
            payedCashless
            date
        }
    }
`;

export const DELETE_SALARY_PAYMENT = gql`
    mutation DELETE_SALARY_PAYMENT($SalaryPaymentID: ID!) {
        deleteSalaryPayment(SalaryPaymentID: $SalaryPaymentID)
    }
`;
