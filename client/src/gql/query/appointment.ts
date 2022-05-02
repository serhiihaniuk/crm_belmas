import { gql } from '@apollo/client';

export const GET_APPOINTMENTS_TOTAL_PRICE = gql`
    query GET_APPOINTMENTS_TOTAL_PRICE($dateFrom: String, $dateTo: String) {
        getAppointmentsTotalPrice(dateFrom: $dateFrom, dateTo: $dateTo) {
            cash
            cashless
        }
    }
`;

export const GET_APPOINTMENTS_BY_DAYS = gql`
    query GET_APPOINTMENTS_BY_DAYS($AppointmentsByDatesInput: AppointmentsByDatesInput!) {
        getAppointmentsByDate(AppointmentsByDatesInput: $AppointmentsByDatesInput) {
            date
            appointments {
                _id
                client
                cash
                cashless
                status
                paymentMethod
                date
                instagram
                procedure
                description
                employee {
                    _id
                }
            }
        }
    }
`;
