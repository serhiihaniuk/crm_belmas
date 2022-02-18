import { gql } from '@apollo/client';

export interface IGetSalaryTablesQuery {
    getSalaryTablesByMonth: ISalaryTable[];
}

export interface ISalaryTable {
    salaryTableCode: string;
    _id: string;
    employee: {
        _id: string;
        name: string;
    };
    totalEarned: number;
    payedCash: number;
    payedCashless: number;
    month: string;
    tips: number;
    payments: IPayment[];
}

export interface IPayment {
    _id: string;
    payedCash: number;
    payedCashless: number;
    date: string;
}

export const GET_SALARY_TABLES_BY_MONTH = gql`
    query GET_SALARY_TABLES_BY_MONTH($monthCode: String!) {
        getSalaryTablesByMonth(monthCode: $monthCode) {
            salaryTableCode
            _id
            employee {
                _id
                name
            }
            totalEarned
            payedCash
            payedCashless
            month
            tips
            payments {
                _id
                payedCash
                payedCashless
                date
            }
        }
    }
`;
