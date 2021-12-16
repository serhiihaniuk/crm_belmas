import {gql} from '@apollo/client';

export const GET_APPOINTMENTS = gql`
    query GET_APPOINTMENTS($employee: ID!, $dateFrom: String, $dateTo: String, $sortBy: String) {
        getAppointments(employee: $employee, dateFrom: $dateFrom, dateTo: $dateTo, sortBy: $sortBy){
            _id
            client
            price
            status
            paymentMethod
            date
            instagram
            procedure
            description
            employee{
                _id
            }
        }
    }`;

export const GET_APPOINTMENTS_BY_DAYS = gql`
    query GET_APPOINTMENTS_BY_DAYS($AppointmentsByDatesInput: AppointmentsByDatesInput!) {
        getAppointmentsByDate(AppointmentsByDatesInput: $AppointmentsByDatesInput){
            date
            appointments{
                _id
                client
                price
                status
                paymentMethod
                date
                instagram
                procedure
                description
                employee{
                    _id
                }
            }
        }
    }
`
