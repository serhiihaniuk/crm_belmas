import { gql } from '@apollo/client';
export interface IAddSalaryPayment {
    addSalaryPayment: ISalaryPayment
}
export interface ISalaryPaymentInput extends ISalaryPayment {
    monthCode: string;
}

export interface ISalaryPayment {
    employee: string;
    salaryTableCode: string;
    payedCash: number;
    payedCashless: number;
    date: string;
}

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
