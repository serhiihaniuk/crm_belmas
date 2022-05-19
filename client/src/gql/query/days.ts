import { gql } from '@apollo/client';

export const GET_DAYS_IN_RANGE = gql`
    query GET_DAYS_IN_RANGE($from: String!, $to: String!, $employeeID: String!) {
      getDaysInRange(from: $from, to: $to, employeeID: $employeeID) {
        _id
  	    dayCode
        isOff
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
                time
                monthCode,
                dayCode,
                employee {
                    _id
                }
            }
          dayOff {
              _id
          }
        }
    }
`;
