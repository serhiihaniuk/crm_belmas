import { gql } from '@apollo/client';

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
                monthCode
                dayCode
            }
        }
    }
`;
