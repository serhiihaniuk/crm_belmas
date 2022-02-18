import { gql } from '@apollo/client';
export interface IMonthTotalQuery {
    getMonthStats: IMonthStats;
}
export interface IMonthStats  {
    monthCode: string
    month: string
    year: string
    cashlessAtTheBeginning: number
    cashless: number
    cash: number
    currentCashless: number
    currentCash: number
    expensesCash: number
    expensesCashless: number
    salaryCash: number
    salaryCashless: number
    _id: string
}

export const GET_MONTH_STATS = gql`
    query GET_MONTH_STATS($monthCode: String!) {
        getMonthStats(monthCode: $monthCode){
            monthCode
            month
            year
            cashlessAtTheBeginning
            cashless
            cash
            currentCashless
            currentCash
            expensesCash
            expensesCashless
            salaryCash
            salaryCashless
            _id
        }
    }
`;

