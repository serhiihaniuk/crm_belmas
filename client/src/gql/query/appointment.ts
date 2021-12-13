import { gql } from '@apollo/client';

export const GET_APPOINTMENTS = gql`
    query GET_APPOINTMENTS($employee: ID!, $dateFrom: String, $dateTo: String, $sortBy: String) {
        getAppointments(employee: $employee, dateFrom: $dateFrom, dateTo: $dateTo, sortBy: $sortBy){
            _id
            client
            price
            date
            instagram
            procedure
            description
            employee{
                _id
            }
        }
    }`;

export const GET_APPOINTMENT_FROM_CACHE = gql`
    fragment selectedAppointment on Appointment {
        _id
        client
        procedure
        description
        instagram
        date
        creator
    }`;
