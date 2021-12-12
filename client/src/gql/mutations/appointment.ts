import { gql } from '@apollo/client';

export const CREATE_APPOINTMENT = gql`
    mutation createAppointment($AppointmentInput: AppointmentInput!) {
        createAppointment(AppointmentInput: $AppointmentInput) {
            _id
        }
    }`;
