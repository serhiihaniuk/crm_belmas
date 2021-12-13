import { gql } from '@apollo/client';

export const CREATE_APPOINTMENT = gql`
    mutation createAppointment($AppointmentInput: AppointmentInput!) {
        createAppointment(AppointmentInput: $AppointmentInput) {
            _id
        }
    }`;

export const UPDATE_APPOINTMENT = gql`
    mutation updateAppointment($appointmentID: ID!, $AppointmentInput: AppointmentInput!) {
        updateAppointment(appointmentID: $appointmentID, AppointmentInput: $AppointmentInput) {
            _id
        }
    }`;

export const DELETE_APPOINTMENT = gql`
    mutation deleteAppointment($id: ID!) {
        deleteAppointment(id: $id)
    }`;
