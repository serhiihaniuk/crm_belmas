import { gql } from '@apollo/client';

export const CREATE_DAY_OFF = gql`
    mutation CREATE_DAY_OFF($employeeID: String!, $dayCode: String!) {
        createDayOff(employeeID: $employeeID, dayCode: $dayCode) {
            _id
            day {
                dayCode
            }
            employee {
                _id
            }
        }
    }
`;

export const DELETE_DAY_OFF = gql`
    mutation DELETE_DAY_OFF($dayOffID: String!) {
        deleteDayOff(dayOffID: $dayOffID) {
            _id
        }
    }
`;