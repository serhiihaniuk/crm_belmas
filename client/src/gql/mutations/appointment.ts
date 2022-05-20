import { gql } from '@apollo/client';

export const CREATE_APPOINTMENT = gql`
    mutation createAppointment($AppointmentInput: AppointmentInput!) {
        createAppointment(AppointmentInput: $AppointmentInput) {
            _id
        }
    }
`;

export const UPDATE_APPOINTMENT = gql`
    mutation updateAppointment($appointmentID: ID!, $AppointmentInput: AppointmentInput!) {
        updateAppointment(appointmentID: $appointmentID, AppointmentInput: $AppointmentInput) {
            _id
            client
            cash
            cashless
            status
            paymentMethod
            date
            instagram
            procedure {
                typeOf
                procedure
                duration
                procedureCode
            }
            description
            time
            employee {
                _id
            }
        }
    }
`;

export const DELETE_APPOINTMENT = gql`
    mutation deleteAppointment($id: ID!) {
        deleteAppointment(id: $id)
    }
`;

export const CALCULATE_APPOINTMENT = gql`
    mutation calculateAppointment($id: ID!, $cash: Int!, $cashless: Int!, $paymentMethod: String!) {
        calculateAppointment(id: $id, cash: $cash, cashless: $cashless, paymentMethod: $paymentMethod) {
            _id
            cash
            cashless
            status
            paymentMethod
        }
    }
`;
